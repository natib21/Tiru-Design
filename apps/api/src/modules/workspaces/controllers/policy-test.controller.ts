import { Controller, Get, UseGuards } from '@nestjs/common';
import { WorkspaceGuard } from '../guards/workspace.guard';
import { PolicyGuard } from '../guards/policy.guard';
import { RequirePolicy } from '../decorators/require-policy.decorator';

/**
 * TEST-ONLY Controller
 * 
 * This controller is registered only in the test environment to test policy guards
 * through real HTTP requests. Each route requires a specific policy action.
 * 
 * DO NOT register this in production!
 */
@Controller('test/policy')
@UseGuards(WorkspaceGuard, PolicyGuard)
export class PolicyTestController {
  @Get('workspace-read')
  @RequirePolicy('workspace:read')
  async testWorkspaceRead() {
    return { action: 'workspace:read', allowed: true };
  }

  @Get('workspace-update')
  @RequirePolicy('workspace:update')
  async testWorkspaceUpdate() {
    return { action: 'workspace:update', allowed: true };
  }

  @Get('workspace-delete')
  @RequirePolicy('workspace:delete')
  async testWorkspaceDelete() {
    return { action: 'workspace:delete', allowed: true };
  }

  @Get('member-manage')
  @RequirePolicy('member:manage')
  async testMemberManage() {
    return { action: 'member:manage', allowed: true };
  }

  @Get('project-create')
  @RequirePolicy('project:create')
  async testProjectCreate() {
    return { action: 'project:create', allowed: true };
  }

  @Get('project-read')
  @RequirePolicy('project:read')
  async testProjectRead() {
    return { action: 'project:read', allowed: true };
  }

  @Get('project-update')
  @RequirePolicy('project:update')
  async testProjectUpdate() {
    return { action: 'project:update', allowed: true };
  }

  @Get('project-delete')
  @RequirePolicy('project:delete')
  async testProjectDelete() {
    return { action: 'project:delete', allowed: true };
  }

  @Get('unknown-action')
  @RequirePolicy('unknown:action' as any)
  async testUnknownAction() {
    return { action: 'unknown:action', allowed: true };
  }

  @Get('no-workspace-context')
  async testNoWorkspaceContext() {
    // This route has PolicyGuard but the test will call it without WorkspaceGuard
    return { noContext: true };
  }
}
