import { GATEWAY_BASE_URL } from '@/config/api-routes';
import { cookies, headers } from 'next/headers';

  const baseUrl = GATEWAY_BASE_URL;

  export async function postSubscription(payload: {
	contactId: number;
	topicId: number;
	sendEmail?: boolean;
	minSeverityId?: number;
	countryName?: string;
	basinName?: string;
	wigosId?: string;
	minTime?: string;
	maxTime?: string;
  }) {
	const cookieStore = await cookies();
	const session = cookieStore.get('session')?.value;
	const forwardedHeaders = await headers();
	
	const res = await fetch(`${baseUrl}/oceanops/alerts/subscriptions`, {
	  method: 'POST',
	  headers: {
		Cookie: `session=${session}`,
		'X-Forwarded-For': forwardedHeaders.get('x-forwarded-for') ?? '',
		'Content-Type': 'application/json',
	  },
	  cache: 'no-store',
	  body: JSON.stringify(payload),
	});
  
	if (!res.ok) {
	  const errMsg = await res.text();
	  console.error('POST failed.');
	  throw new Error('Failed to create subscription : ' + errMsg);
	}
  
	return await res.json();
  }
  