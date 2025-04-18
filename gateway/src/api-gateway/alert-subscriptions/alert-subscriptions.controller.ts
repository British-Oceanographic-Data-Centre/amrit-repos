import { Controller, Post, Get, Req, Delete } from '@nestjs/common';
import { Request } from 'express';
import { AlertSubscriptionsService } from './alert-subscriptions.service';

@Controller('oceanops/alerts/subscriptions')
export class AlertSubscriptionsController {
  constructor(private readonly service: AlertSubscriptionsService) {}

  @Get()
  handleGet(@Req() req: Request) {
    return this.service.proxyRequest(req);
  }

  @Post()
  handlePost(@Req() req: Request) {
    return this.service.proxyRequest(req);
  }

  @Delete(':id')
  handleDelete(@Req() req: Request) {
    return this.service.proxyRequest(req);
  }

  // Add PATCH similarly
}
