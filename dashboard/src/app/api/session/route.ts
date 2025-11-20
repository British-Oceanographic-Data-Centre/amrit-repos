import { NextResponse } from 'next/server';
import { verifySession } from '@/app/_lib/session';

export async function GET() {
  const session = await verifySession();
  return NextResponse.json(session ?? { isAuth: false, username: null });
}
