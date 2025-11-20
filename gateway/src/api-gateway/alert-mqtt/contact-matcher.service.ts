import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';
import { proxyHttpRequest } from 'src/utils/proxy.utils';
import { ProxyRouteMap, createProxyRouteMap } from 'src/utils/proxy.routes';
import { ConfigService } from '@nestjs/config';
import { AlertEvent } from '../../types/alert';

export interface MatchingContact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

@Injectable()
export class ContactMatcherService {
  private proxyRoutes: ProxyRouteMap;

  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {
    this.proxyRoutes = createProxyRouteMap(config);
  }

  async findMatchingContacts(alert: AlertEvent): Promise<MatchingContact[]> {
    const basePath = 'api/oceanops';
    const route = this.proxyRoutes[basePath];
    if (!route) {
      throw new Error(`No proxy route config found for ${basePath}`);
    }

    const config: AxiosRequestConfig = {
      method: 'post',
      url: `https://${route.host}${route.targetPath}/alerts/subscriptions/matching-alert`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
      },
      data: {
        topic: alert?.data?.attributes?.alert_category,
        severity: alert?.data?.severity,
        resource: alert?.data?.resource,
        event: alert?.data?.event,
        wigosId: alert?.data?.attributes?.wigos_id,
        country: alert?.data?.attributes?.Country,
        time: alert?.time,
      },
    };

    return proxyHttpRequest(this.httpService, config);
  }
}
