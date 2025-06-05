import { NextRequest, NextResponse } from 'next/server';
import { postToGateway } from '@/lib/gateway/postToGateway.server';
import { patchToGateway } from '@/lib/gateway/patchToGateway.server';
import { deleteFromGateway } from '@/lib/gateway/deleteFromGateway.server';
import { getFromGateway } from '@/lib/gateway/getFromGateway.server';

interface GatewayProxyPayload {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  body?: unknown;
}

export async function POST(req: NextRequest) {
  let method: GatewayProxyPayload['method'];
  let path: GatewayProxyPayload['path'];
  let body: GatewayProxyPayload['body'];

  try {
	const rawBody = await req.text();
	if (!rawBody) throw new Error('Empty request body');
	const parsed: GatewayProxyPayload = JSON.parse(rawBody);
	method = parsed.method;
	path = parsed.path;
	body = parsed.body;
  } catch {
	return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  try {
    let result;

    if (method === 'POST') {
      result = await postToGateway(path, body);
    } else if (method === 'PATCH') {
      result = await patchToGateway(path, body);
    } else if (method === 'DELETE') {
      result = await deleteFromGateway(path);
    } else {
      return NextResponse.json({ error: 'Invalid method' }, { status: 400 });
    }

    return NextResponse.json(result ?? {}); // avoid crash on empty
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get('path');

  if (!path) {
    return NextResponse.json({ error: 'Missing path' }, { status: 400 });
  }

  try {
    const result = await getFromGateway(path);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}