import type { GatewayMethod, GatewayProxyPayload } from './types';

export async function gatewayFetchViaProxy<T>(
  method: GatewayMethod,
  path: string,
  body?: GatewayProxyPayload['body'],
  signal?: AbortSignal | null | undefined,
  cache?: boolean
): Promise<T> {
  let res: Response;

  if (method === 'GET') {
    const url = `/api/gateway-proxy?path=${encodeURIComponent(path)}`;
    res = await fetch(url, { 
      method: 'GET',
      signal, 
      ...(cache
        ? { cache: 'force-cache', next: { revalidate: 1800 } }
        : {}),
    });
  } else {
    res = await fetch('/api/gateway-proxy', {
      method: 'POST',
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ method, path, body }),
      signal:signal,
      credentials: 'include'
    });
  }

  const contentType = res.headers.get('content-type') || '';

  const text = await res.text();

  if (!res.ok) {
    
    try {
      const parsed = JSON.parse(text);
      throw new Error(parsed.error || `Gateway error (${res.status})`);
    } catch {
      throw new Error(text || `Gateway error (${res.status})`);
    }
  }

  if (!contentType.includes('application/json')) {
    return {} as T;
  }    
  
  return text ? JSON.parse(text) : ({} as T);
}
