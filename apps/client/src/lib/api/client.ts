import { API_TIMEOUT_MS } from '@/constants/app';
import { env } from '@/config/env';
import {
  createApiError,
  normalizeHttpError,
  normalizeTransportError,
  type ApiError,
} from '@/lib/api/errors';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type RequestOptions = {
  signal?: AbortSignal;
  timeoutMs?: number;
  headers?: HeadersInit;
  /** Skip the global 401 redirect (used by session restore). */
  skipAuthRedirect?: boolean;
};

type ContextHeadersProvider = () => Record<string, string>;
type UnauthorizedHandler = (error: ApiError) => void;

let getContextHeaders: ContextHeadersProvider = () => ({});
let onUnauthorized: UnauthorizedHandler | undefined;

export function setApiContextHeaders(provider: ContextHeadersProvider): void {
  getContextHeaders = provider;
}

export function setUnauthorizedHandler(handler: UnauthorizedHandler | undefined): void {
  onUnauthorized = handler;
}

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
  const value = match?.[1];
  return value ? decodeURIComponent(value) : undefined;
}

function csrfHeaders(): Record<string, string> {
  const token = readCookie('XSRF-TOKEN') ?? readCookie('csrf_token');
  return token ? { 'X-XSRF-TOKEN': token } : {};
}

function joinUrl(base: string, path: string): string {
  return `${base.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
}

function mergeSignals(timeoutMs: number, external?: AbortSignal): AbortSignal {
  const timeout = AbortSignal.timeout(timeoutMs);
  if (!external) return timeout;
  return AbortSignal.any([timeout, external]);
}

async function parseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? '';
  if (response.status === 204) return undefined;
  if (contentType.includes('application/json')) {
    return (await response.json()) as unknown;
  }
  const text = await response.text();
  return text.length > 0 ? text : undefined;
}

async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  options: RequestOptions = {},
): Promise<T> {
  const url = joinUrl(env.VITE_API_BASE_URL, path);
  const headers = new Headers({
    Accept: 'application/json',
    ...csrfHeaders(),
    ...getContextHeaders(),
    ...Object.fromEntries(new Headers(options.headers).entries()),
  });

  if (body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const response = await fetch(url, {
      method,
      credentials: 'include',
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: mergeSignals(options.timeoutMs ?? API_TIMEOUT_MS, options.signal),
    });

    const parsed = await parseBody(response);

    if (!response.ok) {
      const error = normalizeHttpError(response.status, parsed);
      if (error.code === 'unauthorized' && !options.skipAuthRedirect) {
        onUnauthorized?.(error);
      }
      throw error;
    }

    return parsed as T;
  } catch (error) {
    throw normalizeTransportError(error);
  }
}

export const apiClient = {
  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>('GET', path, undefined, options);
  },
  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>('POST', path, body, options);
  },
  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>('PUT', path, body, options);
  },
  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>('PATCH', path, body, options);
  },
  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>('DELETE', path, undefined, options);
  },
};

export function assertNever(value: never, message = 'Unhandled value'): never {
  throw createApiError({
    code: 'unknown',
    status: null,
    message: `${message}: ${String(value)}`,
  });
}
