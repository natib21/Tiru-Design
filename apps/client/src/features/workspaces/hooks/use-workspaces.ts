import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { workspacesApi, type WorkspaceItem } from '../api/workspaces-api';
import { useActiveWorkspaceStore } from '../active-workspace';
import { projectQueryKeys } from '@/features/projects/query-keys';

export const workspaceQueryKeys = {
  all: ['workspaces'] as const,
  list: () => [...workspaceQueryKeys.all, 'list'] as const,
  detail: (id: string) => [...workspaceQueryKeys.all, 'detail', id] as const,
};

export function useWorkspaces() {
  return useQuery({
    queryKey: workspaceQueryKeys.list(),
    queryFn: () => workspacesApi.list(),
    staleTime: 60_000,
  });
}

export function useActiveWorkspace() {
  const activeWorkspaceId = useActiveWorkspaceStore((s) => s.activeWorkspaceId);
  const { data: workspaces, isLoading, error } = useWorkspaces();

  const activeWorkspace =
    workspaces?.find((w) => w.id === activeWorkspaceId) ||
    workspaces?.find((w) => w.type === 'PERSONAL') ||
    workspaces?.[0] ||
    null;

  const role = activeWorkspace?.role || 'MEMBER';
  const isViewer = role === 'VIEWER';
  const canEdit = !isViewer;

  return {
    activeWorkspace,
    activeWorkspaceId: activeWorkspace?.id ?? activeWorkspaceId,
    role,
    isViewer,
    canEdit,
    isLoading,
    error,
  };
}

export function useSwitchWorkspace() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setActiveWorkspaceId = useActiveWorkspaceStore((s) => s.setActiveWorkspaceId);
  const currentWorkspaceId = useActiveWorkspaceStore((s) => s.activeWorkspaceId);

  return (newWorkspace: WorkspaceItem) => {
    if (newWorkspace.id === currentWorkspaceId) return;

    // 1. Clear cached server queries of the previous workspace
    if (currentWorkspaceId) {
      queryClient.removeQueries({
        queryKey: projectQueryKeys.lists(currentWorkspaceId),
      });
      queryClient.removeQueries({
        queryKey: projectQueryKeys.details(currentWorkspaceId),
      });
    }

    // 2. Set new active workspace
    setActiveWorkspaceId(newWorkspace.id);

    // 3. Navigate to dashboard
    navigate('/dashboard');
  };
}

export function useCreateTeamWorkspace() {
  const queryClient = useQueryClient();
  const switchWorkspace = useSwitchWorkspace();

  return useMutation({
    mutationFn: (name: string) => workspacesApi.createTeam(name),
    onSuccess: (newWorkspace) => {
      queryClient.invalidateQueries({ queryKey: workspaceQueryKeys.list() });
      switchWorkspace(newWorkspace);
    },
  });
}
