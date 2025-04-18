import { NextRequest, NextResponse } from 'next/server';
import { postSubscription } from '@/lib/alertSubscriptions/postSubscription.server';

export async function POST(req: NextRequest) {
  const payload = await req.json();

  try {
    const result = await postSubscription(payload);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
