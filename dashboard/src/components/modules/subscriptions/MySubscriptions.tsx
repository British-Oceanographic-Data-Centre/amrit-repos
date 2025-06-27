import MySubscriptionsClient from './MySubscriptionsClient';
import { verifySession } from '@/app/_lib/session';
import { getFromGateway } from '@/lib/gateway/getFromGateway.server';
import { AlertSubscription } from '@/types/alert-subscription';

const MySubscriptions = async () => {

  const session = await verifySession();
  const contactId = session?.userId;

  if (!contactId) {
    throw new Error('Missing contactId from session');
  }

 

  const subscriptions = await getFromGateway<AlertSubscription[]>(
        '/oceanops/alerts/subscriptions?contactId='+contactId
   
  );

  return <MySubscriptionsClient initialData={subscriptions} contactId={contactId}  />;
};

export default MySubscriptions;
