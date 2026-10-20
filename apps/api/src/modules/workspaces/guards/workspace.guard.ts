import { Injectable, CanActivate, ExecutionContext, ForbiddenException, BadRequestException } from '@nestjs/common';
import { WorkspacesService } from '../services/workspaces.service';

@Injectable()
export class WorkspaceGuard implements CanActivate {
  constructor(private readonly workspacesService: WorkspacesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.id) {
      throw new ForbiddenException('User not authenticated');
    }

    let workspaceId = request.headers['x-workspace-id'];

    // If no workspace header, default to personal workspace
    if (!workspaceId) {
      const personalWorkspace = await this.workspacesService.getPersonalWorkspace(user.id);
      request.workspace = {
        workspaceId: personalWorkspace.workspaceId,
        role: personalWorkspace.role,
        status: personalWorkspace.status,
        plan: personalWorkspace.plan
      };
      return true;
    }

    // Validate workspace ID format
    if (typeof workspaceId !== 'string' || workspaceId.length === 0) {
      throw new BadRequestException('Invalid workspace ID');
    }

    // Check membership
    // Rule: X-Workspace-Id header with a non-member workspace returns 403
    // This is the guard's responsibility - it checks workspace access for the request
    const membership = await this.workspacesService.getMembership(workspaceId, user.id);

    if (!membership) {
      throw new ForbiddenException('You do not have access to this workspace');
    }

    request.workspace = {
      workspaceId: membership.workspaceId,
      role: membership.role,
      status: membership.status,
      plan: membership.workspace.plan
    };

    return true;
  }
}
