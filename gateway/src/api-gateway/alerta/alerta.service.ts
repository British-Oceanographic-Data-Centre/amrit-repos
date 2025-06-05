import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { Request} from 'express';
import { addJWTinAuthHeaderAsBearer, buildAxiosRequestConfigFromSourceRequest, proxyHttpRequest } from '../../utils/proxy.utils';
import { createProxyRouteMap, ProxyRoute, ProxyRouteMap } from '../../utils/proxy.routes';
import { extractTokenFromRequest } from '../auth/jwt.strategy';
import { alertaCustomParams } from 'src/constants/alertaCustomParams';
import { AlertApiResponse, AlertCountApiResponse } from 'src/types/alert';

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
    this.logger.log(`Proxy ${req.method} request to Alerta API (${req.path}) `);
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

   if (req.path.includes("/count")) {
      // make request to Alerta api. No need to remove custom parameters as there should be none for this /count endpoint
      return proxyHttpRequest<AlertCountApiResponse>(this.httpService, config);
   } else {
      // check for non-native (ie. custom alert params) and remove it from config.params    
      const removedCustomAlertParam = this.cleanConfigParamFromAlertCustomsParams (config,alertaCustomParams );
      // make request to Alerta PI without theses cutsom param :
      let data = await proxyHttpRequest<AlertApiResponse>(this.httpService, config);
      // fitlter alerts data based on custom params if presents :
      if (Object.keys(removedCustomAlertParam).length > 0) {        
        data = this.filterAlertsDataWithCustomAttributesParams (data, removedCustomAlertParam);
      }
      return data;
   }
  }

  /**
 * Filters the list of alerts based on custom attribute parameters that were removed
 * from the original query before proxying the request to the Alerta API.
 *
 * This function performs a local post-filtering on the alerts returned by the Alerta API,
 * using the provided custom parameters. It checks whether each alert's `attributes` object
 * matches all specified key-value pairs. If a parameter value is an array, it checks that
 * the attribute value is included in that array.
 *
 * The function also updates the `total` field in the response to reflect the new count
 * of filtered alerts, which is used by the front-end for pagination and display purposes.
 *
 * @param data - The original response from the Alerta API containing all alerts
 * @param removedCustomAlertParam - A map of custom filtering parameters to apply (e.g. { Country: "France" })
 * @returns A new AlertApiResponse object with filtered alerts and updated total count
 */
private filterAlertsDataWithCustomAttributesParams (data:AlertApiResponse , removedCustomAlertParam:Record<string, unknown>){    
    const filteredAlerts = data.alerts.filter((alert) => {
      if (!alert.attributes) return false; 

      return Object.entries(removedCustomAlertParam).every(([key, value]) => {
        const alertAttrValue = alert.attributes?.[key];
        
        if (Array.isArray(value)) { // if array of value
          return value.includes(alertAttrValue);
        }
        return alertAttrValue === value;
      });
    });

  return {
    ...data,
    alerts: filteredAlerts,
    total: filteredAlerts.length, // update total count which is used in next front-end
  };  
}

/**
 * clean the Axios request config : if query parameters contains custom alert attributes which are not supportied natively b Alerta, remove it.
 * return the list of removed query parameters
 * @param config - the original AxiosRequestConfig object built from source request
 * @param alertaCustomParams - A list of custom alert attributes which are not supported by the Alerta API
 * @returns - A map of removed custom parameters and their values in source request (e.g. { Country: "France" })
 */
private cleanConfigParamFromAlertCustomsParams(config: AxiosRequestConfig,alertaCustomParams: string[]): Record<string, unknown> {
const removedParams: Record<string, string |string[]> = {}; 

  if (config.params && typeof config.params === 'object' && !Array.isArray(config.params)) {
    const paramEntries = config.params as Record<string, string |string[]>;

    for (const custom of alertaCustomParams) {
      if (Object.prototype.hasOwnProperty.call(paramEntries, custom)) {
        removedParams[custom] = paramEntries[custom];
        delete paramEntries[custom];
      }
    }
  }
  return removedParams;
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
