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

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.proxyRoutes = createProxyRouteMap(this.configService);
  }

  async proxyRequest(req: Request): Promise<any> {
    const basePath = 'api/oceanops';

    this.logger.log(`Proxy ${req.method} request to OceanOPS Alerts Subscriptions`);

    const route = this.proxyRoutes[basePath];
    if (!route) {
      throw new Error(`No proxy route config found for ${basePath}`);
    }

    const config: AxiosRequestConfig = buildAxiosRequestConfigFromSourceRequest(req, basePath, route);

    return proxyHttpRequest(this.httpService, config);
  }
}
