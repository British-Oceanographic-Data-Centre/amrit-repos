
import 'server-only'

import { cache } from 'react';
import { AuthUserType } from '@/types/user';
import { verifySession } from './session';


// Here function to fetch data Only on server components. We can use verifySession to check the user's session before fetching data

export const getUser = cache(async () => {
const session = await verifySession()
if (!session) return null


const authUser : AuthUserType = {"name":session.username, "contactId": session.userId}
// could do other thing here like fetch user image, user subscriptions, etc....


return authUser;
  })