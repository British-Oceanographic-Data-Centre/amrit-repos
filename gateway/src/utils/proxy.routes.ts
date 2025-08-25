import { ConfigService } from '@nestjs/config';

export type ProxyRoute = {
  
    host: string;
    targetPath: string;
    authHeader?: string;
    protocol : string
  
}

export type ProxyRouteMap = {
  [basePath: string]: ProxyRoute
}


/**
 * Builds the proxy route map dynamically using ConfigService for env vars.
 */
export function createProxyRouteMap(config: ConfigService): ProxyRouteMap {
  return {
    'api/alerta': {
      host: config.getOrThrow<string>('ALERTA_HOST'),
      protocol: config.getOrThrow<string>('ALERTA_PROTOCOL'),
      targetPath: '/api',
      authHeader: `Key ${config.getOrThrow<string>('ALERTA_READ_API_KEY')}`,
    },
    'api/oceanops': {
      host: config.getOrThrow<string>('OCEANOPS_HOST'),
      protocol: config.getOrThrow<string>('OCEANOPS_PROTOCOL'),
      targetPath: '/api/data',
    }
  };
}
