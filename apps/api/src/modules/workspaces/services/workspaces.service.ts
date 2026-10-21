import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class WorkspacesService {
  constructor(private readonly prisma: PrismaService) {}

  async getWorkspacesForUser(userId: string) {
    const client = this.prisma.client;
    if (!client) throw new Error('Database client not available');

    const memberships = await client.membership.findMany({
      where: {
        userId,
        status: 'ACTIVE'
      },
      include: {
        workspace: true
      }
    });

    return memberships.map((m: typeof memberships[0]) => ({
      id: m.workspace.id,
      type: m.workspace.type,
      name: m.workspace.name,
      plan: m.workspace.plan,
      role: m.role,
      createdAt: m.workspace.createdAt,
      updatedAt: m.workspace.updatedAt
    }));
  }

  async createTeamWorkspace(userId: string, name: string) {
    const client = this.prisma.client;
    if (!client) throw new Error('Database client not available');

    const result = await client.$transaction(async (tx: typeof client) => {
      const workspace = await tx.workspace.create({
        data: {
          type: 'TEAM',
          name
        }
      });

      await tx.membership.create({
        data: {
          userId,
          workspaceId: workspace.id,
          role: 'OWNER',
          status: 'ACTIVE'
        }
      });

      return workspace;
    });

    return {
      id: result.id,
      type: result.type,
      name: result.name,
      plan: result.plan,
      role: 'OWNER',
      createdAt: result.createdAt,
      updatedAt: result.updatedAt
    };
  }

  async getWorkspaceById(workspaceId: string, userId: string) {
    const client = this.prisma.client;
    if (!client) throw new Error('Database client not available');

    // Rule: GET /workspaces/:id for a non-member returns 404
    // This is the endpoint's responsibility - it looks up a specific resource by ID
    // If the user doesn't have access, we hide the resource existence (404)
    const membership = await client.membership.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId
        }
      },
      include: {
        workspace: true
      }
    });

    if (!membership || membership.status !== 'ACTIVE') {
      throw new NotFoundException('Workspace not found');
    }

    return {
      id: membership.workspace.id,
      type: membership.workspace.type,
      name: membership.workspace.name,
      plan: membership.workspace.plan,
      role: membership.role,
      createdAt: membership.workspace.createdAt,
      updatedAt: membership.workspace.updatedAt
    };
  }

  async getMembership(workspaceId: string, userId: string) {
    const client = this.prisma.client;
    if (!client) throw new Error('Database client not available');

    const membership = await client.membership.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId
        },
        status: 'ACTIVE'
      },
      include: {
        workspace: true
      }
    });

    return membership;
  }

  async getPersonalWorkspace(userId: string) {
    const client = this.prisma.client;
    if (!client) throw new Error('Database client not available');

    const membership = await client.membership.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
        workspace: {
          type: 'PERSONAL'
        }
      },
      include: {
        workspace: true
      }
    });

    if (!membership) {
      throw new NotFoundException('Personal workspace not found');
    }

    return {
      workspaceId: membership.workspaceId,
      role: membership.role,
      status: membership.status,
      plan: membership.workspace.plan
    };
  }
}
