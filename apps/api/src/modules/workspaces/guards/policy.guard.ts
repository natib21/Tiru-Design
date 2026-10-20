import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { POLICY_KEY } from '../decorators/require-policy.decorator';
import { PolicyAction, can } from '../policies/workspace-policy';

/**
 * Policy Guard
 * 
 * Runs AFTER WorkspaceGuard to check if the user's role allows the requested action.
 * 
 * Requirements:
 * - Only ACTIVE memberships get access (INVITED and REMOVED are refused)
 * - A request with no workspace context is refused (never skipped)
 */
@Injectable()
export class PolicyGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPolicy = this.reflector.getAllAndOverride<PolicyAction>(
      POLICY_KEY,
      [context.getHandler(), context.getClass()]
    );

    // If no policy is required, allow access
    if (!requiredPolicy) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const workspace = request.workspace;

    // A route with a policy but no workspace context is refused
    if (!workspace) {
      throw new ForbiddenException(
        'Workspace context is required for this operation'
      );
    }

    // Only ACTIVE memberships get access
    if (workspace.status !== 'ACTIVE') {
      throw new ForbiddenException(
        'You do not have active access to this workspace'
      );
    }

    // Check if the role allows this action
    const allowed = can(
      { role: workspace.role },
      { plan: workspace.plan },
      requiredPolicy
    );

    if (!allowed) {
      throw new ForbiddenException(
        `You do not have permission to perform this action`
      );
    }

    return true;
  }
}
