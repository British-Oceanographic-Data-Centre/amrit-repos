import { Controller, Get } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Public } from '../auth/public.decorator';
import { createProxyRouteMap, ProxyRoute } from '../../utils/proxy.routes';

@Controller('data')
export class AlertFiltersController {
  private readonly oceanopsRoute : ProxyRoute;

  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService
  ) {
    const routes = createProxyRouteMap(this.configService);
    this.oceanopsRoute = routes['api/oceanops'];
  }

  private async fetchFromOceanOps<T = unknown>(path: string): Promise<T> { 
	const fullUrl = `https://${this.oceanopsRoute.host}${this.oceanopsRoute.targetPath}/${path}`;
	const res = await firstValueFrom(this.http.get(fullUrl));
    return res.data as T;
  }

  @Public()
  @Get('countries')
  async getCountries() {
    return this.fetchFromOceanOps('country?include=["id","name"]');
  }

  @Public()
  @Get('basins')
  async getBasins() {
    return this.fetchFromOceanOps('basins');
  }

  @Public()
  @Get('severities')
  async getSeverities() {
    return this.fetchFromOceanOps('alerts/severities');
  }
}
