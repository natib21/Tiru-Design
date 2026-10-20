import { MembershipRole } from '@prisma/client';

/**
 * Policy actions that can be performed in a workspace
 */
export type PolicyAction =
  | 'workspace:read'
  | 'workspace:update'
  | 'workspace:delete'
  | 'member:manage'
  | 'project:create'
  | 'project:read'
  | 'project:update'
  | 'project:delete';

/**
 * Role-based policy map
 * Deny by default: if an action is not listed for a role, it is denied
 */
const ROLE_POLICIES: Record<MembershipRole, PolicyAction[]> = {
  OWNER: [
    'workspace:read',
    'workspace:update',
    'workspace:delete',
    'member:manage',
    'project:create',
    'project:read',
    'project:update',
    'project:delete',
  ],
  EDITOR: [
    'workspace:read',
    'project:create',
    'project:read',
    'project:update',
    'project:delete',
  ],
  VIEWER: [
    'workspace:read',
    'project:read',
  ],
};

/**
 * Check if a membership can perform an action in a workspace
 * 
 * @param membership - The user's membership (role)
 * @param workspace - The workspace context (for future plan/entitlement checks)
 * @param action - The action to check
 * @returns true if allowed, false otherwise
 */
export function can(
  membership: { role: MembershipRole },
  workspace: { plan?: string },
  action: PolicyAction
): boolean {
  // Check role-based permissions
  const allowedActions = ROLE_POLICIES[membership.role] || [];
  if (!allowedActions.includes(action)) {
    return false;
  }

  // Plan/entitlement check (placeholder - always returns true for now)
  // This allows adding plan-based restrictions later without changing callers
  const planCheck = checkPlanEntitlement(workspace, action);
  
  return planCheck;
}

/**
 * Placeholder for plan/entitlement checks
 * Always returns true for now, allowing future plan restrictions without changing callers
 */
function checkPlanEntitlement(
  workspace: { plan?: string },
  action: PolicyAction
): boolean {
  // TODO: Implement plan-based restrictions
  // Example: free plan might limit project:create to 5 projects
  return true;
}
