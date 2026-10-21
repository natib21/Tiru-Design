import { Injectable, NotFoundException, ConflictException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { CreateProjectDto, UpdateProjectDto, UpdateContentDto, ListProjectsDto } from '../dto';
import { validateProjectContent, createBlankContent, ProjectContent } from '../schemas/content.schema';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new project in the workspace
   */
  async create(workspaceId: string, userId: string, dto: CreateProjectDto) {
    const client = this.prisma.client;
    if (!client) throw new Error('Database client not available');

    // Use provided content or create blank content
    const content = dto.content || createBlankContent();

    // Validate content
    const validation = validateProjectContent(content);
    if (!validation.success) {
      throw new BadRequestException(`Invalid content: ${validation.error}`);
    }

    const project = await client.project.create({
      data: {
        workspaceId,
        createdById: userId,
        name: dto.name,
        content: validation.data as any,
        schemaVersion: validation.data!.schemaVersion,
        version: 1,
      },
    });

    return project;
  }

  /**
   * List projects in the workspace with cursor-based pagination
   * Excludes soft-deleted projects
   */
  async list(workspaceId: string, dto: ListProjectsDto) {
    const client = this.prisma.client;
    if (!client) throw new Error('Database client not available');

    const limit = dto.limit || 20;

    const projects = await client.project.findMany({
      where: {
        workspaceId,
        deletedAt: null, // Exclude soft-deleted
        ...(dto.cursor ? { id: { lt: dto.cursor } } : {}),
      },
      orderBy: [
        { updatedAt: 'desc' },
        { id: 'desc' },
      ],
      take: limit + 1, // Fetch one extra to determine if there are more
    });

    const hasMore = projects.length > limit;
    const items = hasMore ? projects.slice(0, limit) : projects;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return {
      items,
      nextCursor,
      hasMore,
    };
  }

  /**
   * Get a single project by ID
   * Returns 404 if project doesn't exist in this workspace or is deleted
   */
  async findOne(workspaceId: string, projectId: string) {
    const client = this.prisma.client;
    if (!client) throw new Error('Database client not available');

    const project = await client.project.findFirst({
      where: {
        id: projectId,
        workspaceId, // Tenancy: must be in this workspace
        deletedAt: null, // Exclude soft-deleted
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  /**
   * Update project name (rename)
   */
  async update(workspaceId: string, projectId: string, dto: UpdateProjectDto) {
    // Verify project exists in this workspace
    await this.findOne(workspaceId, projectId);

    const client = this.prisma.client;
    if (!client) throw new Error('Database client not available');

    const project = await client.project.update({
      where: { id: projectId },
      data: { name: dto.name },
    });

    return project;
  }

  /**
   * Update project content with version check (autosave)
   * Returns 409 if version doesn't match (prevents concurrent overwrites)
   */
  async updateContent(workspaceId: string, projectId: string, dto: UpdateContentDto) {
    const client = this.prisma.client;
    if (!client) throw new Error('Database client not available');

    // Validate content
    const validation = validateProjectContent(dto.content);
    if (!validation.success) {
      throw new BadRequestException(`Invalid content: ${validation.error}`);
    }

    try {
      // Atomic update with version check in WHERE clause
      const updated = await client.project.update({
        where: {
          id: projectId,
          workspaceId, // Tenancy check
          deletedAt: null, // Must not be deleted
          version: dto.version, // Version check for optimistic locking
        },
        data: {
          content: validation.data as any,
          schemaVersion: validation.data!.schemaVersion,
          version: { increment: 1 },
        },
        select: {
          id: true,
          version: true,
          updatedAt: true,
        },
      });

      return updated;
    } catch (error: any) {
      // Handle Prisma P2025: Record not found (no matching row)
      if (error.code === 'P2025') {
        // Check if project exists to give better error message
        const project = await client.project.findFirst({
          where: {
            id: projectId,
            workspaceId,
            deletedAt: null,
          },
        });

        if (!project) {
          throw new NotFoundException('Project not found');
        }

        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            message: `Version mismatch: expected ${project.version}, received ${dto.version}. Content was modified by another session.`,
            error: 'CONFLICT',
            currentVersion: project.version,
          },
          HttpStatus.CONFLICT,
        );
      }
      throw error;
    }
  }

  /**
   * Duplicate a project (creates independent copy)
   */
  async duplicate(workspaceId: string, projectId: string, userId: string) {
    // Verify source project exists in this workspace
    const source = await this.findOne(workspaceId, projectId);

    const client = this.prisma.client;
    if (!client) throw new Error('Database client not available');

    // Create a copy with new ID and version
    const duplicate = await client.project.create({
      data: {
        workspaceId,
        createdById: userId,
        name: `${source.name} (Copy)`,
        content: source.content,
        schemaVersion: source.schemaVersion,
        version: 1, // New version sequence
        status: source.status,
      },
    });

    return duplicate;
  }

  /**
   * Soft delete a project
   */
  async remove(workspaceId: string, projectId: string) {
    // Verify project exists in this workspace
    await this.findOne(workspaceId, projectId);

    const client = this.prisma.client;
    if (!client) throw new Error('Database client not available');

    const project = await client.project.update({
      where: { id: projectId },
      data: { deletedAt: new Date() },
    });

    return project;
  }
}
