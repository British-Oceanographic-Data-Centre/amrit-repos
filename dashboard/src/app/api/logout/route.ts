import { NextResponse } from 'next/server';
import { logout } from '@/app/_actions/auth';

export async function POST() {
  await logout();
  return new NextResponse(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}
