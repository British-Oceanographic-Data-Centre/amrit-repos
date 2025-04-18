import { cookies, headers } from 'next/headers';
import { AlertSubscription } from '@/types/alert-subscription';
import { GATEWAY_BASE_URL } from '@/config/api-routes';

const baseUrl = GATEWAY_BASE_URL;

export async function fetchAlertSubscriptions(): Promise<AlertSubscription[]> {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  const forwardedHeaders = await headers();

  const res = await fetch(`${baseUrl}/oceanops/alerts/subscriptions`, {
    headers: {
      Cookie: `session=${session}`,
      'X-Forwarded-For': forwardedHeaders.get('x-forwarded-for') ?? '',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch alert subscriptions');
  }

  return res.json();
}
