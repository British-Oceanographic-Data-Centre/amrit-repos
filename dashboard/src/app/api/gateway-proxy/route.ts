// app/api/gateway-proxy/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { getGatewayBaseUrl } from './config.server';

import { getFromGateway } from '@/lib/gateway/getFromGateway.server';
import { postToGateway } from '@/lib/gateway/postToGateway.server';
import { patchToGateway } from '@/lib/gateway/patchToGateway.server';
import { deleteFromGateway } from '@/lib/gateway/deleteFromGateway.server';
import { putToGateway } from '@/lib/gateway/putToGateway.server';

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';

interface GatewayProxyPayload {
  method: Method;
  path: string;
  body?: unknown;
}

/**
 * POST: client sends { method, path, body } as JSON.
 * We call the typed-JSON wrappers and return JSON(200) on success,
 * or a 502 JSON error if upstream fails.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const raw = await req.text();
    if (!raw) return NextResponse.json({ error: 'Empty request body' }, { status: 400 });

    const { method, path, body } = JSON.parse(raw) as GatewayProxyPayload;

    let result: unknown;

    if (method === 'POST') {
      result = await postToGateway<unknown, unknown>(path, body);
      return NextResponse.json(result);
    }
    if (method === 'PATCH') {
      result = await patchToGateway<unknown, unknown>(path, body);
      return NextResponse.json(result);
    }
    if (method === 'DELETE') {
      result = await deleteFromGateway<unknown>(path);
      return NextResponse.json(result);
    }
    if (method === 'PUT') {
      result = await putToGateway<unknown, unknown>(path, body);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Invalid method' }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gateway proxy failed';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

/**
 * GET: client calls /api/gateway-proxy?path=<encoded>.
 * We decode the path. For /oceanops/auth/me we **passthrough** upstream status/body.
 * For everything else, we use the typed JSON getter and return JSON(200).
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const sp = new URL(req.url).searchParams;
  const rawPath = sp.get('path');
  if (!rawPath) {
    return NextResponse.json({ error: 'Missing path' }, { status: 400 });
  }

  const path = decodeURIComponent(rawPath); // undo client encodeURIComponent

  // Passthrough for auth/me so UI sees real 200/401 and body
  if (path.startsWith('/oceanops/auth/me')) {
    try {
      const cookieStore = await cookies();
      const allCookies = cookieStore.getAll();
      const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join('; ');
      const sessionCookie = allCookies.find((c) => c.name === 'session');
      const bearer = sessionCookie?.value ? `Bearer ${sessionCookie.value}` : undefined;
      const fwd = await headers();

      const upstream = await fetch(getGatewayBaseUrl() + path, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Cookie: cookieHeader,
          ...(bearer ? { Authorization: bearer } : {}),
          'X-Forwarded-For': fwd.get('x-forwarded-for') ?? '',
        },
        cache: 'no-store',
      });

      const text = await upstream.text();
      return new NextResponse(text || null, {
        status: upstream.status,
        headers: {
          'content-type': upstream.headers.get('content-type') ?? 'application/json',
        },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gateway proxy failed';
      return NextResponse.json({ error: message }, { status: 502 });
    }
  }

  // Default JSON proxy for other GETs
  try {
    const data = await getFromGateway<unknown>(path);
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gateway proxy failed';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
