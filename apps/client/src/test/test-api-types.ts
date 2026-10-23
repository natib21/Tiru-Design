import type { Client } from 'openapi-fetch';
import type { paths as BasePaths } from '@/shared/api/schema';

export interface TestPathsExtension {
  '/test/resource-1': {
    get: {
      responses: {
        200: {
          content: {
            'application/json': { id: string };
          };
        };
        401: {
          content: {
            'application/json': { statusCode: number; error: string; message: string };
          };
        };
      };
    };
  };
  '/test/resource-2': {
    get: {
      responses: {
        200: {
          content: {
            'application/json': { id: string };
          };
        };
        401: {
          content: {
            'application/json': { statusCode: number; error: string; message: string };
          };
        };
      };
    };
  };
  '/test/resource-3': {
    get: {
      responses: {
        200: {
          content: {
            'application/json': { id: string };
          };
        };
        401: {
          content: {
            'application/json': { statusCode: number; error: string; message: string };
          };
        };
      };
    };
  };
  '/test/secure': {
    get: {
      responses: {
        200: {
          content: {
            'application/json': { secure: boolean };
          };
        };
        401: {
          content: {
            'application/json': { statusCode: number; error: string; message: string };
          };
        };
      };
    };
  };
  '/test/conflict': {
    get: {
      responses: {
        409: {
          content: {
            'application/json': {
              statusCode: number;
              error: string;
              message: string;
              currentVersion?: number | string | Record<string, unknown> | null;
            };
          };
        };
      };
    };
  };
  '/test/workspace-check': {
    get: {
      responses: {
        200: {
          content: {
            'application/json': { workspaceId: string | null };
          };
        };
      };
    };
  };
}

export type TestPaths = BasePaths & TestPathsExtension;
export type TestClient = Client<TestPaths>;
