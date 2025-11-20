import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig, AxiosHeaders , AxiosResponse } from 'axios';
import { buildAxiosRequestConfigFromSourceRequest, proxyHttpRequest } from '../../utils/proxy.utils';
import { createProxyRouteMap, ProxyRouteMap } from '../../utils/proxy.routes';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MeService {
  private readonly logger = new Logger(MeService.name, { timestamp: true });
  private readonly proxyRoutes: ProxyRouteMap;
  private readonly gwSecret: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.proxyRoutes = createProxyRouteMap(this.configService);
    this.gwSecret = this.configService.get<string>('GATEWAY_SHARED_SECRET', '');
    if (!this.gwSecret) {
      throw new Error('GATEWAY_SHARED_SECRET is not set');
    }
  }

  async proxyGetMe(req: Request, contactId: number) {
    const basePath = 'api/oceanops';
    const route = this.proxyRoutes[basePath];
    if (!route) throw new Error(`No proxy route config found for ${basePath}`);

    const cfg: AxiosRequestConfig = buildAxiosRequestConfigFromSourceRequest(req, basePath, route);
    cfg.method = 'GET';

    // 🔽 normalize then mutate headers as a plain object
    const headers = normalizeHeaders(cfg.headers);
    headers['authorization'] = req.headers['authorization'] as string;
    headers['accept'] = 'application/json';

    // add shared secret (strip spoofed first)
    delete headers['x-gateway-secret'];
    headers['X-Gateway-Secret'] = this.gwSecret;

    // X-Contact-Id for /auth/me
    const internalPath = req.path.replace(/^\/api\/oceanops/, '');
    const needsContactId = (cfg.method === 'GET' && internalPath === '/auth/me');
    if (needsContactId) {
      if (!contactId) throw new UnauthorizedException('Missing contactId');
      delete headers['x-contact-id'];
      headers['X-Contact-Id'] = String(contactId);
    }

    cfg.headers = headers;

    this.logger.log(`→ ${cfg.method} ${cfg.url}`);
    return proxyHttpRequest(this.httpService, cfg);
  }

  async proxyPatchMe(req: Request, body: any, contactId: number) {
    const basePath = 'api/oceanops';
    const route = this.proxyRoutes[basePath];
    if (!route) throw new Error(`No proxy route config found for ${basePath}`);

    const cfg: AxiosRequestConfig = buildAxiosRequestConfigFromSourceRequest(req, basePath, route);
    cfg.method = 'PATCH';
    cfg.data = body;

    const headers = normalizeHeaders(cfg.headers);
    headers['authorization'] = req.headers['authorization'] as string;
    headers['accept'] = 'application/json';
    headers['content-type'] = 'application/json';

    delete headers['x-gateway-secret'];
    headers['X-Gateway-Secret'] = this.gwSecret;

    const internalPath = req.path.replace(/^\/api\/oceanops/, '');
    const needsContactId = (cfg.method === 'PATCH' && internalPath === '/auth/me');
    if (needsContactId) {
      if (!contactId) throw new UnauthorizedException('Missing contactId');
      delete headers['x-contact-id'];
      headers['X-Contact-Id'] = String(contactId);
    }

    cfg.headers = headers;

    this.logger.log(`→ ${cfg.method} ${cfg.url}`);
    return proxyHttpRequest(this.httpService, cfg);
  }

  async proxyPostChangePassword(req: Request, body: any, contactId: number): Promise<AxiosResponse<any>> {
    const basePath = 'api/oceanops';
    const route = this.proxyRoutes[basePath];
    if (!route) throw new Error(`No proxy route config found for ${basePath}`);

    const cfg: AxiosRequestConfig = buildAxiosRequestConfigFromSourceRequest(req, basePath, route);
    cfg.method = 'POST';
    cfg.data = body;

    const headers = normalizeHeaders(cfg.headers);
    headers['authorization'] = req.headers['authorization'] as string;
    headers['accept'] = 'application/json';
    headers['content-type'] = 'application/json';

    delete headers['x-gateway-secret'];
    headers['X-Gateway-Secret'] = this.gwSecret;

    const internalPath = req.path.replace(/^\/api\/oceanops/, '');
    const needsContactId = (cfg.method === 'POST' && internalPath === '/auth/change-password');
    if (needsContactId) {
      if (!contactId) throw new UnauthorizedException('Missing contactId');
      delete headers['x-contact-id'];
      headers['X-Contact-Id'] = String(contactId);
    }

    cfg.headers = headers;

    this.logger.log(`→ ${cfg.method} ${cfg.url}`);
    return await firstValueFrom(this.httpService.request(cfg));
  }

}

function normalizeHeaders(h: AxiosRequestConfig['headers']): Record<string, string> {
  if (!h) return {};
  if (h instanceof AxiosHeaders) return h.toJSON() as Record<string, string>;
  return { ...(h as Record<string, string>) };
}