import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { proxyHttpRequest, buildAxiosRequestConfigFromSourceRequest } from '../../utils/proxy.utils';
import { createProxyRouteMap, ProxyRouteMap } from '../../utils/proxy.routes';

@Injectable()
export class AlertSubscriptionsService {
  private readonly logger = new Logger(AlertSubscriptionsService.name, { timestamp: true });
  private readonly proxyRoutes: ProxyRouteMap;
  private readonly gwSecret: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.proxyRoutes = createProxyRouteMap(this.configService);
    this.gwSecret = this.configService.get<string>('GATEWAY_SHARED_SECRET', '');
  }

  async proxyRequest(req: Request): Promise<any> {
    const basePath = 'api/oceanops';

    this.logger.log(`Proxy ${req.method} request to OceanOPS Alerts Subscriptions`);

    const route = this.proxyRoutes[basePath];
    if (!route) {
      throw new Error(`No proxy route config found for ${basePath}`);
    }

    const config: AxiosRequestConfig = buildAxiosRequestConfigFromSourceRequest(req, basePath, route);

    config.headers = config.headers ?? {};
    delete (config.headers as any)['X-Gateway-Secret'];
    delete (config.headers as any)['x-gateway-secret'];
    (config.headers as any)['X-Gateway-Secret'] = this.gwSecret;

    return proxyHttpRequest(this.httpService, config);
  }
}
