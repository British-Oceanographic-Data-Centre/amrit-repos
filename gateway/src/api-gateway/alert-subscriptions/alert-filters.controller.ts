import { Controller, Get, Req } from '@nestjs/common';
import { Public } from '../auth/public.decorator';
import { Request } from 'express';
import { AlertSubscriptionsService } from './alert-subscriptions.service';

@Controller('data')
export class AlertFiltersController {

  constructor(private readonly alertSubscriptionsService : AlertSubscriptionsService ) {}


  @Public()
  @Get('countries')
  getCountries(@Req() req: Request) {
    
    req.url = req.url.replace('countries','country?include=["id","name"]');

    return this.alertSubscriptionsService.proxyRequest(req);
  }

  @Public()
  @Get('basins')
  getBasins(@Req() req: Request) {
    return this.alertSubscriptionsService.proxyRequest(req);
  }

  @Public()
  @Get('alerts/severities')
  getSeverities(@Req() req: Request) {
    return this.alertSubscriptionsService.proxyRequest(req);
  }
}
