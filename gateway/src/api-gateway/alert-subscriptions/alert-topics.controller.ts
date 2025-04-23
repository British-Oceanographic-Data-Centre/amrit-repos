import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { Public } from '../auth/public.decorator';
import { AlertSubscriptionsService } from './alert-subscriptions.service';

@Controller('data/topics')
export class AlertTopicsController {
  constructor(
   private readonly alertSubscriptionsService : AlertSubscriptionsService
  ) {  }



  @Public()
  @Get()
  getTopics(@Req() req: Request) {

    req.url = req.url.replace('topics','alerts/dictionary/topics');

    return this.alertSubscriptionsService.proxyRequest(req);
	  
  }
}
