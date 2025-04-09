import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { Request} from 'express';
import { createProxyRouteMap, ProxyRouteMap } from 'src/utils/proxy.routes';
import { buildAxiosRequestConfigFromSourceRequest, proxyHttpRequest } from 'src/utils/proxy.utils';

@Injectable()
export class AuthService {
    
    private readonly logger = new Logger(AuthService.name, { timestamp: true })
    private readonly proxyRoutes: ProxyRouteMap;

    constructor(
            private readonly httpService: HttpService,
            private readonly configService: ConfigService,
              
        )  {
            this.proxyRoutes = createProxyRouteMap(this.configService);
          }

    async tempAuthProxyRequest(req: Request): Promise<any>{
        this.logger.log(`Proxy ${req.method} request to OceanOps Authentication Service`);

        const route = this.proxyRoutes['api/oceanops'];
		if (!route) {
			throw new Error(`No proxy route config found for 'api/oceanops'`);
		}
  
         //build axiosRequestConfig with source request parameters and target host parameter :
        const config: AxiosRequestConfig = buildAxiosRequestConfigFromSourceRequest(req, 'api/oceanops', route);

        // make request to auth service
        const data = proxyHttpRequest<unknown>(this.httpService, config);
    
        return data
    }

    


}
