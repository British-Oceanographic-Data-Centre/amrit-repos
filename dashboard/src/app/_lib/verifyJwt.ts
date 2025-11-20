import { createRemoteJWKSet, jwtVerify, JWTVerifyResult } from 'jose';
import { getOceanopsAuthServiceUrl } from '../api/gateway-proxy/config.server';



// We could just decode token without verify it because JWT verification is done on Gateway side for all request.
// But if we want to protect some front end route with user role for example, it is better to already plan a jwt verification here 
export async function verifyJwt(token: string | undefined =""): Promise<JWTVerifyResult['payload'] | null> {
  const JWKS = createRemoteJWKSet(new URL(getOceanopsAuthServiceUrl()+'/.well-known/jwks.json'));
  try {
    const safeToken = `${token ?? ''}`.trim() || 'invalid.token.value';
    
    
    const { payload } = await jwtVerify(safeToken, JWKS, {
      algorithms: ['RS256'],
    });
    return payload;
  } catch  {
    return null   
  }
}