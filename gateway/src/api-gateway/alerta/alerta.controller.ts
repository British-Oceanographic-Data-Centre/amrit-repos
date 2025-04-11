import { All, Controller, Get, Post, Req } from '@nestjs/common';
import { AlertaService } from './alerta.service';
import { Request } from 'express';
import { Public } from '../auth/public.decorator';

@Controller('alerta')
export class AlertaController {

    constructor(private readonly alertaService: AlertaService) {}

    @Get('/alerts{/*path}')
    alertaGetAlertsProxy(@Req() req: Request) {
        return this.alertaService.alertaProxyRequest(req);
    }


    @Post('*path')
    alertaProxy(@Req() req: Request) {
        return this.alertaService.alertaProxyRequest(req);
    }


}
