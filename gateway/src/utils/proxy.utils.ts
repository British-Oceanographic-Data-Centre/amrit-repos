import { IncomingHttpHeaders } from 'http';
import { Request} from 'express';
import { HttpService } from '@nestjs/axios';
import {AxiosError, AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpException } from '@nestjs/common';
import { ProxyRoute } from './proxy.routes';


/**
 * Sends an HTTP request using Axios through NestJS HttpService.
 * Handles errors and throws appropriate HttpExceptions.
 * 
 * @param httpService - NestJS HttpService instance
 * @param config - Axios request configuration
 * @returns Response data from the proxied request
 * @throws HttpException when the request fails
 */
export async function proxyHttpRequest<T = unknown>(httpService: HttpService, config: AxiosRequestConfig): Promise<T> {
  const { data } = await firstValueFrom(
    httpService.request<T>(config).pipe(
      catchError((error: AxiosError) => {
        const status = error.response?.status || 500;
        const message = error.response?.data || { message: 'Unexpected error' };
        throw new HttpException(message, status);
      })
    )
  );

  return data;
}


/**
     * Builds an AxiosRequestConfig from the incoming HTTP request.
     * 
     * @param req - Incoming Express/NestJS request object.
     * @param host - target host name
     * @param baseProxyPath - base Path on gateway. ex: 'api/alerta', 'api/auth'.
     * @returns AxiosRequestConfig
     */
export function buildAxiosRequestConfigFromSourceRequest(req: Request, baseProxyPath: string,  route : ProxyRoute) {
	const { host, targetPath, authHeader } = route;
  
	const method = req.method.toLowerCase();
	const params = req.query;
  
	// Force content-type ONLY for methods with a body
	const isBodyMethod = ['post', 'put', 'patch'].includes(method);
	const data = isBodyMethod ? req.body  as Record<string, any>: undefined;
	
  // build headers
	const headers = {
		...cleanProxyHeaders(req.headers),
		host,
		accept: 'application/json',
		'user-agent': req.headers['user-agent'] || 'OceanOPS-Gateway',
		...(isBodyMethod && {
		  'Content-Type': 'application/json' //  force correct type
		}),
	};
  
  
  const relativePath = req.path.replace(`/${baseProxyPath}`, targetPath);
  const url = `https://${host}${relativePath}`;


    // configure the axios request from the source request & api's url
	const config: AxiosRequestConfig = {
	  method,
	  url,
	  headers,
	  params,
	  paramsSerializer : {
      indexes: null
    },
	  ...(isBodyMethod && { data }),
	};
  
	if (authHeader) {
	  config.headers = {
		...config.headers,
		Authorization: authHeader,
	  };
	}
  
	return config;
  }

/**
 * Cleans (remove) HTTP headers that may interfere with forwarding (e.g. host, content-length)
 * 
 * @param headers 
 * @returns 
 */
export function cleanProxyHeaders(headers: IncomingHttpHeaders): Record<string, string> {
    const excluded = [
      'host',
      'Host',
      'content-length',
      'connection',
      'accept-encoding',
      'postman-token',
      'user-agent',
    ];
  
    return Object.fromEntries(
      Object.entries(headers)
        .filter(([key]) => !excluded.includes(key.toLowerCase()))
        .map(([key, value]) => [
          key,
          Array.isArray(value) ? value.join(',') : String(value),
        ]),
    );
  }

  export function addJWTinAuthHeaderAsBearer (jwt: string,config: AxiosRequestConfig ) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${jwt}`,
        };      
    }