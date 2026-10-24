import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { client as baseClient, ApiError } from '@/shared/api';
import type { TestClient } from './test-schema';
import { env } from '@/shared/config/env';
import { useAuthStore } from '@/features/auth';
import { useActiveWorkspaceStore } from '@/features/workspaces';

const client = baseClient as unknown as TestClient;

const server = setupServer();

beforeAll(() => {
  server.listen({ onUnhandledRequest(req) {
    console.log('UNHANDLED REQUEST:', req.method, req.url);
  } });
});

afterAll(() => {
  server.close();
});

beforeEach(() => {
  server.resetHandlers();
  useAuthStore.getState().clearSession();
  useActiveWorkspaceStore.getState().clearActiveWorkspace();
});

describe('API Client & Middleware', () => {
  it('refresh single-flight: three parallel requests that all get 401 cause exactly ONE refresh call, and all three are retried with the new token', async () => {
    useAuthStore.getState().setTokens({
      accessToken: 'initial-access-token',
      refreshToken: 'initial-refresh-token',
    });

    let refreshCallCount = 0;

    server.use(
      http.post(`${env.VITE_API_URL}/auth/refresh`, async ({ request }) => {
        refreshCallCount++;
        const body = (await request.json()) as { refreshToken: string };
        expect(body.refreshToken).toBe('initial-refresh-token');

        return HttpResponse.json({
          accessToken: 'rotated-access-token',
          refreshToken: 'rotated-refresh-token',
        });
      }),

      http.get(`${env.VITE_API_URL}/test/resource-1`, ({ request }) => {
        const auth = request.headers.get('authorization');
        if (auth === 'Bearer rotated-access-token') {
          return HttpResponse.json({ id: '1' });
        }
        return new HttpResponse(
          JSON.stringify({ statusCode: 401, error: 'UNAUTHORIZED', message: 'Token expired' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } },
        );
      }),

      http.get(`${env.VITE_API_URL}/test/resource-2`, ({ request }) => {
        const auth = request.headers.get('authorization');
        if (auth === 'Bearer rotated-access-token') {
          return HttpResponse.json({ id: '2' });
        }
        return new HttpResponse(
          JSON.stringify({ statusCode: 401, error: 'UNAUTHORIZED', message: 'Token expired' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } },
        );
      }),

      http.get(`${env.VITE_API_URL}/test/resource-3`, ({ request }) => {
        const auth = request.headers.get('authorization');
        if (auth === 'Bearer rotated-access-token') {
          return HttpResponse.json({ id: '3' });
        }
        return new HttpResponse(
          JSON.stringify({ statusCode: 401, error: 'UNAUTHORIZED', message: 'Token expired' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } },
        );
      }),
    );

    // Fire 3 parallel requests
    const [res1, res2, res3] = await Promise.all([
      client.GET('/test/resource-1'),
      client.GET('/test/resource-2'),
      client.GET('/test/resource-3'),
    ]);

    // Exactly one refresh call must occur
    expect(refreshCallCount).toBe(1);

    // All three requests succeeded with retried data
    expect(res1.data).toEqual({ id: '1' });
    expect(res2.data).toEqual({ id: '2' });
    expect(res3.data).toEqual({ id: '3' });

    // Store holds rotated tokens
    expect(useAuthStore.getState().accessToken).toBe('rotated-access-token');
    expect(useAuthStore.getState().refreshToken).toBe('rotated-refresh-token');
  });

  it('a failed refresh clears the session', async () => {
    useAuthStore.getState().setTokens({
      accessToken: 'expired-access-token',
      refreshToken: 'invalid-refresh-token',
    });

    server.use(
      http.get(`${env.VITE_API_URL}/test/secure`, () => {
        return new HttpResponse(
          JSON.stringify({ statusCode: 401, error: 'UNAUTHORIZED', message: 'Token expired' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } },
        );
      }),

      http.post(`${env.VITE_API_URL}/auth/refresh`, () => {
        return new HttpResponse(
          JSON.stringify({ statusCode: 401, error: 'UNAUTHORIZED', message: 'Invalid refresh token' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } },
        );
      }),
    );

    await expect(client.GET('/test/secure')).rejects.toThrow(ApiError);

    // Session must be cleared
    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().refreshToken).toBeNull();
  });

  it('ApiError mapping: a 409 response exposes currentVersion', async () => {
    server.use(
      http.get(`${env.VITE_API_URL}/test/conflict`, () => {
        return new HttpResponse(
          JSON.stringify({
            statusCode: 409,
            error: 'CONFLICT',
            message: 'Resource version conflict',
            currentVersion: 5,
          }),
          { status: 409, headers: { 'Content-Type': 'application/json' } },
        );
      }),
    );

    try {
      await client.GET('/test/conflict');
      expect.fail('Request should have thrown ApiError');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      const apiError = error as ApiError;
      expect(apiError.status).toBe(409);
      expect(apiError.code).toBe('CONFLICT');
      expect(apiError.message).toBe('Resource version conflict');
      expect(apiError.currentVersion).toBe(5);
    }
  });

  it('the workspace header is sent when a workspace is active and omitted when not', async () => {
    server.use(
      http.get(`${env.VITE_API_URL}/test/workspace-check`, ({ request }) => {
        const workspaceId = request.headers.get('x-workspace-id');
        return HttpResponse.json({ workspaceId });
      }),
    );

    // When workspace is active
    useActiveWorkspaceStore.getState().setActiveWorkspaceId('workspace-xyz-123');
    const activeRes = await client.GET('/test/workspace-check');
    expect(activeRes.data?.workspaceId).toBe('workspace-xyz-123');

    // When workspace is cleared / omitted
    useActiveWorkspaceStore.getState().clearActiveWorkspace();
    const inactiveRes = await client.GET('/test/workspace-check');
    expect(inactiveRes.data?.workspaceId).toBeNull();
  });
});
