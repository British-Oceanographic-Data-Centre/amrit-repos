import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { Request} from 'express';
import { buildAxiosRequestConfigFromSourceRequest, proxyHttpRequest } from '../../utils/proxy.utils';
import { createProxyRouteMap, ProxyRouteMap } from '../../utils/proxy.routes';

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

      // make request to Alerta api
      const data = proxyHttpRequest<unknown>(this.httpService, config);

      //TO DO ? here can add some logic if needed (ex : change Alert model with a mapper)
      
      return data;
    }   


}
