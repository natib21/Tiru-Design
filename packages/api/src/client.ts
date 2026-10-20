export type ApiError = {
  status?: number;
  code?: string;
  message: string;
  details?: unknown;
};

export type FetchOptions = {
  timeoutMs?: number;
  signal?: AbortSignal;
  headers?: Record<string, string>;
};

const defaultTimeout = 10_000;

function withTimeout(timeoutMs: number, signal?: AbortSignal) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const combinedSignal = controller.signal;

  if (signal) {
    signal.addEventListener('abort', () => controller.abort());
  }

  return { signal: combinedSignal, clear: () => clearTimeout(timeout) };
}

function parseJsonSafe<T>(res: Response): Promise<T | null> {
  return res.text().then((text) => {
    try {
      return text ? (JSON.parse(text) as T) : null;
    } catch {
      return null;
    }
  });
}

export const createApiClient = (baseUrl?: string) => {
  const resolvedBase = baseUrl ?? (typeof (globalThis as any).VITE_API_BASE_URL !== 'undefined' ? (globalThis as any).VITE_API_BASE_URL : undefined) ?? (typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_API_BASE_URL : undefined);

  if (!resolvedBase) {
    throw new Error('VITE_API_BASE_URL is not configured. Pass baseUrl to createApiClient.');
  }

  const buildUrl = (path: string) => `${resolvedBase.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;

  return {
    baseUrl: resolvedBase,
    async fetchJson<T = unknown>(path: string, opts: FetchOptions = {}): Promise<T> {
      const { timeoutMs = defaultTimeout, signal, headers } = opts;
      const { signal: timedSignal, clear } = withTimeout(timeoutMs, signal);
      try {
        const res = await fetch(buildUrl(path), { signal: timedSignal, headers });
        if (!res.ok) {
          const payload = await parseJsonSafe<any>(res);
          const err: ApiError = { status: res.status, message: payload?.message ?? res.statusText, details: payload };
          throw err;
        }
        const data = (await parseJsonSafe<T>(res)) as T;
        return data as T;
      } catch (err: any) {
        if (err && (err.name === 'AbortError' || err instanceof DOMException && err.name === 'AbortError')) {
          throw { code: 'timeout', message: 'Request aborted or timed out' } as ApiError;
        }
        if (err && err.status) throw err as ApiError;
        throw { message: err?.message ?? String(err) } as ApiError;
      } finally {
        clear();
      }
    }
  };
};
