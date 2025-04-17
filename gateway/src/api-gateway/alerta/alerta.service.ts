import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { Request} from 'express';
import { addJWTinAuthHeaderAsBearer, buildAxiosRequestConfigFromSourceRequest, proxyHttpRequest } from '../../utils/proxy.utils';
import { createProxyRouteMap, ProxyRoute, ProxyRouteMap } from '../../utils/proxy.routes';
import { extractTokenFromRequest } from '../auth/jwt.strategy';

@Injectable()
export class AlertaService {  
  private readonly logger = new Logger(AlertaService.name, { timestamp: true })
	private readonly proxyRoutes: ProxyRouteMap;

  constructor(
      private readonly httpService: HttpService,
      private readonly configService: ConfigService,
        
  )  {
  this.proxyRoutes = createProxyRouteMap(this.configService);
  }

  /**
   * For '/api/alert' endpoint, proxies incomming HTTP request to Alerta API.
   * Method is dynamic : rewrites request headers and path, forwards request body for POST/PUT/PATCH, and injects Alerta-specific headers (Host and API Key).
   * TO DO ? : This method could even be more generic by handling differents APIs bu parsing the path ('/api/{api-name}') and redirect to the right url. For now keeping one controller and service by API, in case there is specific logic to add.
   * 
   * @param req Incoming Express/NestJS request object.
   * @returns Data from Alerta API response.
   * @throws HttpException if Alerta API call fails.
   */
  async alertaProxyRequest(req: Request) : Promise<any>

    {  
    this.logger.log(`Proxy ${req.method} request to Alerta API`);
    const basePath = 'api/alerta'

    const route = this.proxyRoutes[basePath];
    if (!route) {
      throw new Error(`No proxy route config found for ${basePath}`);
    }
  
    //build axiosRequestConfig with source request parameters and target host parameter :
    const config: AxiosRequestConfig = buildAxiosRequestConfigFromSourceRequest(req,  basePath, route);
    // Use the JWT from oceanops/auth service to authenticate in Alerta
    if (req.method=='POST' || req.method=='DELETE' || req.method=='PUT') {
      // authenticate on Alerta by forwarding the JWT on api/alerta/auth/bearer endpoint
      const alerta_token =await  this.handleAuthOnAlerta(req, route);
      // add the alerta token as Bearer token in the request to proxy :
      addJWTinAuthHeaderAsBearer(alerta_token, config)
    }

    // make request to Alerta api
    const data = proxyHttpRequest<unknown>(this.httpService, config);

    //TO DO ? here can add some logic if needed (ex : change Alert model with a mapper)

    return data;
  }

  /**
   * Make a post request to api/alerta/auth/bearer with the JWT from the source request and return the alerta token
   * @param req : source request which should contained the JWT from the oceanops/auth service
   * @param route 
   * @returns alerta token
   */
  async handleAuthOnAlerta (req: Request, route : ProxyRoute) {
    this.logger.log(`Post Auth request to Alerta API`) 
    const { host, targetPath } = route; 

    const method = "post";
    const url = `https://${host}${targetPath}/auth/bearer`;
    const headers = {'Content-Type' : 'application/json'}
    

    const config : AxiosRequestConfig = {
      method,
      url,
      headers
    };

    // extract JWT from source request :
    const jwt = extractTokenFromRequest(req)
    if (jwt) {
      addJWTinAuthHeaderAsBearer(jwt,config);
    }    
 
    // make request to Alerta api auth endpoint which should return a token
    const data = await proxyHttpRequest< {token:string}>(this.httpService, config);  

    return data.token;
  }

}
