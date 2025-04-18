import { NextResponse } from 'next/server';
import { fetchAlertSubscriptions } from '@/lib/alertSubscriptions/fetchSubscriptions.server';

export async function GET() {
  try {
    const subscriptions = await fetchAlertSubscriptions();
    return NextResponse.json(subscriptions);
  } catch  {
    console.error('[get-subscriptions] Failed.');
    return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
  }
}
