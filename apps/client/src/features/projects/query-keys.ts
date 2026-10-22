/**
 * Query key factory for Projects.
 * Workspace-scoped query keys MUST include the active workspace ID
 * so that cache entries are isolated per workspace and invalidated
 * cleanly when switching workspaces or logging out.
 */
export const projectQueryKeys = {
  all: ['projects'] as const,
  lists: (workspaceId: string) => [...projectQueryKeys.all, 'list', workspaceId] as const,
  list: (workspaceId: string, filters?: Record<string, unknown>) =>
    [...projectQueryKeys.lists(workspaceId), filters] as const,
  details: (workspaceId: string) => [...projectQueryKeys.all, 'detail', workspaceId] as const,
  detail: (workspaceId: string, projectId: string) =>
    [...projectQueryKeys.details(workspaceId), projectId] as const,
};
