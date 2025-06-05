import type { GatewayMethod, GatewayProxyPayload } from './types';

export async function gatewayFetchViaProxy<T>(
  method: GatewayMethod,
  path: string,
  body?: GatewayProxyPayload['body']
): Promise<T> {
  let res: Response;

  if (method === 'GET') {
    const url = `/api/gateway-proxy?path=${encodeURIComponent(path)}`;
    res = await fetch(url, { method: 'GET' });
  } else {
    res = await fetch('/api/gateway-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method, path, body }),
    });
  }

  const contentType = res.headers.get('content-type') || '';

  if (!res.ok) {
    const text = await res.text();
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

  const text = await res.text();
  return text ? JSON.parse(text) : ({} as T);
}
