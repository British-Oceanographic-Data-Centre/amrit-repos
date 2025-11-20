import 'server-only'
import { cookies } from "next/headers";
import { cache } from 'react';
import { verifyJwt } from './verifyJwt';
import { JwtPayloadType } from '@/types/types';


export async function createSession (access_token: string, expires_in: number) {
  const expirationDate = new Date(Date.now() + expires_in * 1000);

  const cookieStore = await cookies()

  cookieStore.set('session', access_token, {
      httpOnly: true,
      // secure: true,
      path: '/',
      sameSite: 'strict',    
      expires: expirationDate,
  });
}


export async function deleteSession() {
  (await cookies()).delete('session');
}


export const verifySession = cache(async () => {
  const access_token = (await cookies()).get('session')?.value  
 
  if (!access_token || access_token.trim() === "") {
    //redirect('/login')
    return null;
  }
 
  // verify and get token payload :
  const payload = await verifyJwt(access_token) as JwtPayloadType ;  
  if (payload) {
    return { isAuth: true, userId: payload?.contactId, username: payload?.name, roles:payload?.roles }
  }  else {
    return null;
  }
 

})

