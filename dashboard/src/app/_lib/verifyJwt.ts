import { AUTHSERVICE_API_BASE_URL } from '@/config/api-routes';
import { createRemoteJWKSet, jwtVerify, JWTVerifyResult } from 'jose';

const JWKS = createRemoteJWKSet(new URL(AUTHSERVICE_API_BASE_URL+'/.well-known/jwks.json'));

// We could just decode token without verify it because JWT verification is done on Gateway side for all request.
// But if we want to protect some front end route with user role for example, it is better to already plan a jwt verification here 
export async function verifyJwt(token: string | undefined =""): Promise<JWTVerifyResult['payload'] | null> {
  try {

    if (!token || typeof token !== 'string' || token.trim() === "") {
      return null;
    }
    
    const { payload } = await jwtVerify(token, JWKS, {
      algorithms: ['RS256'],
    });
    return payload;
  } catch (err) {
    console.error('JWT verification failed:', err);
    return null;
  }
}