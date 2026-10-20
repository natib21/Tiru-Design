import { SetMetadata } from '@nestjs/common';
import { PolicyAction } from '../policies/workspace-policy';

export const POLICY_KEY = 'policy';

/**
 * Decorator to require a specific policy action for a route
 * Must be used with WorkspaceGuard - the policy guard runs AFTER workspace context is established
 */
export const RequirePolicy = (action: PolicyAction) => SetMetadata(POLICY_KEY, action);
