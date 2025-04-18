import { fetchAlertSubscriptions } from '@/lib/alertSubscriptions/fetchSubscriptions.server';
import MySubscriptionsClient from './MySubscriptionsClient';
import { verifySession } from '@/app/_lib/session';

const MySubscriptions = async () => {
  const subscriptions = await fetchAlertSubscriptions(); 
  const session = await verifySession();
  const contactId = session?.userId;

  if (!contactId) {
    throw new Error('Missing contactId from session');
  }

  return <MySubscriptionsClient initialData={subscriptions} contactId={contactId}  />;
};

export default MySubscriptions;
