import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
import { JwtPayload } from "src/types/types";
import { createProxyRouteMap } from "src/utils/proxy.routes";
import { ConfigService } from "@nestjs/config";
import { Request } from 'express';



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    
    constructor( private readonly configService: ConfigService) {
        // get the oceanops route from the config file for the JWKS endpoint :
        const proxyRoutes = createProxyRouteMap(configService);
        const route = proxyRoutes['api/oceanops'];
        // may be for speed, have the public key.pem in gateway environnement instead of making a request to JWKS endpoint ?
        const jwksEndpoint = `https://${route.host}${route.targetPath}/auth/.well-known/jwks.json` 
        
        super({
            // extract token from request :
            // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            jwtFromRequest: extractTokenFromRequest,
            // don't ignore expiration :
            ignoreExpiration: false,
            // get the public key from the JWKS endpoint
            secretOrKeyProvider: jwksRsa.passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: jwksEndpoint,
              }),

              algorithms: ['RS256'],

        });
       
    }

    validate(payload: JwtPayload) {
        // May also put some logic here to retrieve more information on user, verify if the userId match a user in the database, look in a potential table of revoken token, etc.
        // ex :  authService.getUserDetails, etc.
        return { userId: payload.contactId, username: payload.sub, name: payload.name };
    }

    
}
function extractTokenFromRequest(req: Request): string | null {
    console.log ("get JWT")
    // 1. Try Authorization header
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        console.log(authHeader)
      return authHeader.slice(7).trim(); // remove 'Bearer '
    }
  
    // 2. Try Cookie header
    const cookies = req.cookies;
    if (cookies && cookies['session']) {
        console.log(cookies['session'])
        return cookies['session'];
    }
  
    return null;
  }
