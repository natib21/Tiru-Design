import { client, ApiError } from '@/shared/api';

export interface ProjectItem {
  id: string;
  workspaceId: string;
  createdById: string;
  name: string;
  schemaVersion: number;
  version: number;
  createdAt: string;
  updatedAt: string;
  content?: {
    canvas?: { width: number; height: number; background: string };
    pages?: Array<{ id: string; name: string }>;
  };
}

export interface ProjectsListResponse {
  items: ProjectItem[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface CreateProjectInput {
  name: string;
  width?: number;
  height?: number;
}

type GenericCaller = (
  url: string,
  options?: {
    body?: unknown;
    params?: {
      query?: Record<string, unknown>;
      path?: Record<string, string>;
      header?: Record<string, string>;
    };
    signal?: AbortSignal;
  }
) => Promise<{ data?: unknown; error?: unknown }>;

const clientGet = client.GET as unknown as GenericCaller;
const clientPost = client.POST as unknown as GenericCaller;
const clientPatch = client.PATCH as unknown as GenericCaller;
const clientDelete = client.DELETE as unknown as GenericCaller;

export const projectsApi = {
  /**
   * List projects in current workspace with cursor-based pagination
   */
  async list(params?: { cursor?: string; limit?: number }): Promise<ProjectsListResponse> {
    const response = await clientGet('/projects', {
      params: {
        query: {
          cursor: params?.cursor,
          limit: params?.limit || 20,
        },
      },
    });

    if (response.error) {
      throw new ApiError(500, 'FETCH_PROJECTS_FAILED', 'Failed to fetch projects');
    }

    const data = response.data as ProjectsListResponse;
    return {
      items: data?.items || [],
      nextCursor: data?.nextCursor || null,
      hasMore: Boolean(data?.hasMore),
    };
  },

  /**
   * Create new design with minimal valid content matching backend schema
   */
  async create(input: CreateProjectInput): Promise<ProjectItem> {
    const width = input.width || 1920;
    const height = input.height || 1080;

    const minimalContent = {
      schemaVersion: 1,
      canvas: {
        width,
        height,
        background: '#ffffff',
      },
      pages: [
        {
          id: 'page-1',
          name: 'Page 1',
          elements: [],
        },
      ],
    };

    const response = await clientPost('/projects', {
      body: {
        name: input.name.trim(),
        content: minimalContent,
      },
    });

    if (response.error) {
      throw new ApiError(400, 'CREATE_PROJECT_FAILED', 'Failed to create project');
    }

    return response.data as ProjectItem;
  },

  async get(id: string): Promise<ProjectItem> {
    const response = await clientGet(`/projects/${id}`);
    if (response.error) {
      throw new ApiError(404, 'PROJECT_NOT_FOUND', 'Project not found');
    }
    return response.data as ProjectItem;
  },

  async rename(id: string, name: string): Promise<ProjectItem> {
    const response = await clientPatch(`/projects/${id}`, {
      body: { name: name.trim() },
    });
    if (response.error) {
      throw new ApiError(400, 'RENAME_PROJECT_FAILED', 'Failed to rename project');
    }
    return response.data as ProjectItem;
  },

  async duplicate(id: string): Promise<ProjectItem> {
    const response = await clientPost(`/projects/${id}/duplicate`, {});
    if (response.error) {
      throw new ApiError(400, 'DUPLICATE_PROJECT_FAILED', 'Failed to duplicate project');
    }
    return response.data as ProjectItem;
  },

  async remove(id: string): Promise<void> {
    const response = await clientDelete(`/projects/${id}`);
    if (response.error) {
      throw new ApiError(400, 'DELETE_PROJECT_FAILED', 'Failed to delete project');
    }
  },
};

export default projectsApi;
