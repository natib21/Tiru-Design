import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { projectsApi, type CreateProjectInput, type ProjectItem } from '../api/projects-api';
import { projectQueryKeys } from '../query-keys';
import { useActiveWorkspace } from '@/features/workspaces/hooks/use-workspaces';

export function useProjectsInfinite() {
  const { activeWorkspaceId } = useActiveWorkspace();

  return useInfiniteQuery({
    queryKey: projectQueryKeys.list(activeWorkspaceId || 'no-workspace'),
    queryFn: ({ pageParam }) =>
      projectsApi.list({ cursor: pageParam as string | undefined, limit: 12 }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore && lastPage.nextCursor ? lastPage.nextCursor : undefined,
    enabled: Boolean(activeWorkspaceId),
    staleTime: 30_000,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { activeWorkspaceId } = useActiveWorkspace();

  return useMutation({
    mutationFn: (input: CreateProjectInput) => projectsApi.create(input),
    onSuccess: (newProject) => {
      if (activeWorkspaceId) {
        queryClient.invalidateQueries({
          queryKey: projectQueryKeys.lists(activeWorkspaceId),
        });
      }
      navigate(`/editor/${newProject.id}`);
    },
  });
}

export function useRenameProject() {
  const queryClient = useQueryClient();
  const { activeWorkspaceId } = useActiveWorkspace();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      projectsApi.rename(id, name),
    onSuccess: (updated) => {
      if (activeWorkspaceId) {
        queryClient.setQueriesData(
          { queryKey: projectQueryKeys.lists(activeWorkspaceId) },
          (oldData: any) => {
            if (!oldData?.pages) return oldData;
            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                items: page.items.map((item: ProjectItem) =>
                  item.id === updated.id ? { ...item, name: updated.name } : item
                ),
              })),
            };
          }
        );
      }
    },
  });
}

export function useDuplicateProject() {
  const queryClient = useQueryClient();
  const { activeWorkspaceId } = useActiveWorkspace();

  return useMutation({
    mutationFn: (id: string) => projectsApi.duplicate(id),
    onSuccess: () => {
      if (activeWorkspaceId) {
        queryClient.invalidateQueries({
          queryKey: projectQueryKeys.lists(activeWorkspaceId),
        });
      }
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  const { activeWorkspaceId } = useActiveWorkspace();

  return useMutation({
    mutationFn: (id: string) => projectsApi.remove(id),
    onSuccess: (_, deletedId) => {
      if (activeWorkspaceId) {
        queryClient.setQueriesData(
          { queryKey: projectQueryKeys.lists(activeWorkspaceId) },
          (oldData: any) => {
            if (!oldData?.pages) return oldData;
            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                items: page.items.filter((item: ProjectItem) => item.id !== deletedId),
              })),
            };
          }
        );
      }
    },
  });
}
