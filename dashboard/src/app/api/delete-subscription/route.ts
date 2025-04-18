import { NextRequest, NextResponse } from 'next/server';
import { GATEWAY_BASE_URL } from '@/config/api-routes';

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing subscription ID' }, { status: 400 });
  }

  try {
    const baseUrl = GATEWAY_BASE_URL;
    const gatewayUrl = `${baseUrl}/oceanops/alerts/subscriptions/${id}`;

    const res = await fetch(gatewayUrl, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Cookie: req.headers.get('cookie') || '',
        'User-Agent': req.headers.get('user-agent') || '',
      },
      credentials: 'include',
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: errText }, { status: res.status });
    }

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error during DELETE';
    console.error('Error in DELETE route.');
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
