import { GATEWAY_BASE_URL } from '@/config/api-routes';
import { cookies, headers } from 'next/headers';

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

interface FetchFromGatewayOptions {
  method?: HttpMethod;
  path: string;
  body?: unknown;
  cache?: RequestCache;  
}

export async function fetchFromGateway<T>({
  method = 'GET',
  path,
  body,
  cache = 'no-store',  
}: FetchFromGatewayOptions): Promise<T> {
  // retrieve cookies :
  const cookieStore = cookies(); 
  const cookieHeader = (await cookieStore).getAll().map(c => `${c.name}=${c.value}`).join('; ');

  //headers to forwars :
  const forwardedHeaders = await headers();
  
  const res = await fetch(`${GATEWAY_BASE_URL}${path}`, {
    method,
    cache,
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
      'X-Forwarded-For': forwardedHeaders.get('x-forwarded-for') ?? '', //To forward client IP
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    throw new Error(`Gateway request failed: ${res.status} ${res.statusText}`);
  }

  	const contentType = res.headers.get('content-type') || '';
	if (!contentType.includes('application/json')) {
	return {} as T;
	}

	const text = await res.text();
	return text ? JSON.parse(text) : ({} as T);

}