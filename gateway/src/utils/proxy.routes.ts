import { ConfigService } from '@nestjs/config';

export type ProxyRouteMap = {
  [basePath: string]: {
    host: string;
    targetPath: string;
    authHeader?: string;
  };
};

/**
 * Builds the proxy route map dynamically using ConfigService for env vars.
 */
export function createProxyRouteMap(config: ConfigService): ProxyRouteMap {
  return {
    'api/alerta': {
      host: config.getOrThrow<string>('ALERTA_HOST'),
      targetPath: '/api',
      authHeader: `Key ${config.getOrThrow<string>('ALERTA_READ_API_KEY')}`,
    },
    // Future routes:
    // 'api/oceanops': {
    //   host: config.getOrThrow<string>('OCEANOPS_HOST'),
    //   targetPath: '/some/other/path',
    // }
  };
}
