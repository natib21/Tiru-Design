import { Injectable, NotFoundException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { CreateTemplateDto, UpdateTemplateDto, ListTemplatesDto } from '../dto';
import { validateProjectContent, ProjectContent } from '../../projects/schemas/content.schema';

@Injectable()
export class TemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Extract placeholder keys from content
   * Scans all text elements for {{key}} patterns
   */
  private extractPlaceholderKeys(content: ProjectContent): string[] {
    const keyPattern = /\{\{([a-z][a-z0-9_]{0,40})\}\}/g;
    const keys = new Set<string>();

    const scanElements = (elements: any[]) => {
      for (const element of elements) {
        if (element.type === 'text' && element.content) {
          let match;
          while ((match = keyPattern.exec(element.content)) !== null) {
            keys.add(match[1]);
          }
        }
        if (element.type === 'group' && element.children) {
          scanElements(element.children);
        }
      }
    };

    content.pages?.forEach((page: any) => {
      if (page.elements) {
        scanElements(page.elements);
      }
    });

    return Array.from(keys).sort();
  }

  /**
   * List published templates (public endpoint)
   */
  async list(dto: ListTemplatesDto) {
    const client = this.prisma.client;
    if (!client) throw new Error('Database client not available');

    const limit = dto.limit || 20;
    const where: any = {
      status: 'PUBLISHED',
      ...(dto.cursor ? { id: { lt: dto.cursor } } : {}),
      ...(dto.category ? { category: dto.category } : {}),
      ...(dto.language ? { language: dto.language } : {}),
      ...(dto.freeOnly ? { priceMinor: 0 } : {}),
      ...(dto.q ? {
        OR: [
          { title: { contains: dto.q, mode: 'insensitive' } },
          { description: { contains: dto.q, mode: 'insensitive' } },
        ],
      } : {}),
    };

    const templates = await client.template.findMany({
      where,
      orderBy: [
        { publishedAt: 'desc' },
        { id: 'desc' },
      ],
      take: limit + 1,
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        language: true,
        priceMinor: true,
        thumbnailKey: true,
        schemaVersion: true,
        publishedAt: true,
        // content excluded from list
      },
    });

    const hasMore = templates.length > limit;
    const items = hasMore ? templates.slice(0, limit) : templates;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return {
      items,
      nextCursor,
      hasMore,
    };
  }

  /**
   * Get a single published template (public endpoint)
   */
  async findOne(id: string) {
    const client = this.prisma.client;
    if (!client) throw new Error('Database client not available');

    const template = await client.template.findFirst({
      where: {
        id,
        status: 'PUBLISHED',
      },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return template;
  }

  /**
   * Use a template to create a project
   * Requires workspace context and policy check
   */
  async useTemplate(
    templateId: string,
    workspaceId: string,
    userId: string,
  ) {
    const client = this.prisma.client;
    if (!client) throw new Error('Database client not available');

    const template = await client.template.findFirst({
      where: {
        id: templateId,
        status: 'PUBLISHED',
      },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    // Check if template can be used (payment check)
    const canUse = this.canUseTemplate(template);
    if (!canUse.allowed) {
      throw new HttpException(
        {
          statusCode: HttpStatus.PAYMENT_REQUIRED,
          message: canUse.reason,
          error: 'PAYMENT_REQUIRED',
        },
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    // Deep copy content and create project
    const project = await client.project.create({
      data: {
        workspaceId,
        createdById: userId,
        name: template.title,
        content: template.content,
        schemaVersion: template.schemaVersion,
        version: 1,
        sourceTemplateId: template.id,
        sourceTemplateVersion: template.version,
      },
    });

    return project;
  }

  /**
   * Check if a template can be used
   * Later: add purchase verification
   */
  private canUseTemplate(template: any): { allowed: boolean; reason?: string } {
    if (template.priceMinor > 0) {
      return {
        allowed: false,
        reason: 'This template requires purchase. Payment functionality coming soon.',
      };
    }

    return { allowed: true };
  }

  /**
   * Admin: Create a template (DRAFT status)
   */
  async create(dto: CreateTemplateDto, ownerWorkspaceId?: string) {
    const client = this.prisma.client;
    if (!client) throw new Error('Database client not available');

    // Validate content
    const validation = validateProjectContent(dto.content);
    if (!validation.success) {
      throw new BadRequestException(`Invalid content: ${validation.error}`);
    }

    // Extract placeholder keys from content
    const placeholderKeys = this.extractPlaceholderKeys(validation.data!);

    const template = await client.template.create({
      data: {
        ownerWorkspaceId: ownerWorkspaceId || null,
        title: dto.title,
        description: dto.description,
        category: dto.category,
        language: dto.language,
        priceMinor: dto.priceMinor,
        thumbnailKey: dto.thumbnailKey,
        content: validation.data as any,
        schemaVersion: validation.data!.schemaVersion,
        placeholderKeys,
      },
    });

    return template;
  }

  /**
   * Admin: Update a template (increments version)
   */
  async update(id: string, dto: UpdateTemplateDto) {
    const client = this.prisma.client;
    if (!client) throw new Error('Database client not available');

    // Check if template exists
    const existing = await client.template.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Template not found');
    }

    const updateData: any = {};

    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.category !== undefined) updateData.category = dto.category;
    if (dto.language !== undefined) updateData.language = dto.language;
    if (dto.priceMinor !== undefined) updateData.priceMinor = dto.priceMinor;
    if (dto.thumbnailKey !== undefined) updateData.thumbnailKey = dto.thumbnailKey;

    if (dto.content !== undefined) {
      // Validate content
      const validation = validateProjectContent(dto.content);
      if (!validation.success) {
        throw new BadRequestException(`Invalid content: ${validation.error}`);
      }

      updateData.content = validation.data;
      updateData.schemaVersion = validation.data!.schemaVersion;
      updateData.placeholderKeys = this.extractPlaceholderKeys(validation.data!);
      updateData.version = { increment: 1 };
    }

    const template = await client.template.update({
      where: { id },
      data: updateData,
    });

    return template;
  }

  /**
   * Admin: Publish a template
   */
  async publish(id: string) {
    const client = this.prisma.client;
    if (!client) throw new Error('Database client not available');

    const template = await client.template.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });

    return template;
  }

  /**
   * Admin: Unpublish a template
   */
  async unpublish(id: string) {
    const client = this.prisma.client;
    if (!client) throw new Error('Database client not available');

    const template = await client.template.update({
      where: { id },
      data: {
        status: 'UNPUBLISHED',
      },
    });

    return template;
  }

  /**
   * Admin: List all templates (all statuses)
   */
  async adminList(dto: ListTemplatesDto) {
    const client = this.prisma.client;
    if (!client) throw new Error('Database client not available');

    const limit = dto.limit || 20;
    const where: any = {
      ...(dto.cursor ? { id: { lt: dto.cursor } } : {}),
      ...(dto.category ? { category: dto.category } : {}),
      ...(dto.language ? { language: dto.language } : {}),
      ...(dto.q ? {
        OR: [
          { title: { contains: dto.q, mode: 'insensitive' } },
          { description: { contains: dto.q, mode: 'insensitive' } },
        ],
      } : {}),
    };

    const templates = await client.template.findMany({
      where,
      orderBy: [
        { updatedAt: 'desc' },
        { id: 'desc' },
      ],
      take: limit + 1,
    });

    const hasMore = templates.length > limit;
    const items = hasMore ? templates.slice(0, limit) : templates;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return {
      items,
      nextCursor,
      hasMore,
    };
  }

  /**
   * Admin: Get any template by ID (any status)
   */
  async adminFindOne(id: string) {
    const client = this.prisma.client;
    if (!client) throw new Error('Database client not available');

    const template = await client.template.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return template;
  }
}
