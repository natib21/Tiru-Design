import { client, ApiError } from '@/shared/api';

export interface WorkspaceItem {
  id: string;
  type: 'PERSONAL' | 'TEAM';
  name: string;
  plan?: 'FREE' | 'PRO' | 'ENTERPRISE';
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
  createdAt?: string;
  updatedAt?: string;
}

type GenericCaller = (
  url: string,
  options?: { body?: unknown; params?: Record<string, unknown>; signal?: AbortSignal }
) => Promise<{ data?: unknown; error?: unknown }>;

const clientGet = client.GET as unknown as GenericCaller;
const clientPost = client.POST as unknown as GenericCaller;

export const workspacesApi = {
  async list(): Promise<WorkspaceItem[]> {
    const response = await clientGet('/workspaces');
    if (response.error) {
      throw new ApiError(500, 'FETCH_WORKSPACES_FAILED', 'Failed to fetch workspaces');
    }
    return (response.data as WorkspaceItem[]) || [];
  },

  async createTeam(name: string): Promise<WorkspaceItem> {
    const response = await clientPost('/workspaces', {
      body: { name: name.trim() },
    });
    if (response.error) {
      throw new ApiError(400, 'CREATE_WORKSPACE_FAILED', 'Failed to create workspace');
    }
    return response.data as WorkspaceItem;
  },

  async get(id: string): Promise<WorkspaceItem> {
    const response = await clientGet(`/workspaces/${id}`);
    if (response.error) {
      throw new ApiError(404, 'WORKSPACE_NOT_FOUND', 'Workspace not found');
    }
    return response.data as WorkspaceItem;
  },
};

export default workspacesApi;
