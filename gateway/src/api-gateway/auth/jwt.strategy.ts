import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
import { JwtPayload } from "../../types/types";
import { ConfigService } from "@nestjs/config";
import { Request } from 'express';
import { createProxyRouteMap } from "../../utils/proxy.routes";



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

/**
 * 
 * @param req Extract the JWT from the incomming request. First look at Authorization header (Bearer ....).
 * If Bearer null, extract the session cookie.
 * @returns 
 */
export function extractTokenFromRequest(req: Request): string | null {    
    // 1. Try Authorization header
    const JWTFromAuthHeaderFunction = ExtractJwt.fromAuthHeaderAsBearerToken();
    if (JWTFromAuthHeaderFunction(req)) {
        return JWTFromAuthHeaderFunction(req);
    }  
  
    // 2. Try Cookie header
    const cookies = req.cookies;
    if (cookies && cookies['session']) {
        return cookies['session'] as string;
    } 
  
    return null;
  }
