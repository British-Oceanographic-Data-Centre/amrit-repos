import { All, Controller, Get, Req } from '@nestjs/common';
import { AlertaService } from './alerta.service';
import { Request } from 'express';
import { Public } from '../auth/public.decorator';

@Controller('alerta')
export class AlertaController {

    constructor(private readonly alertaService: AlertaService) {}

    @Public()
    @Get('/alerts')
    alertaGetAlertsProxy(@Req() req: Request) {
        return this.alertaService.alertaProxyRequest(req);
    }

    @All('*path')
    alertaProxy(@Req() req: Request) {
        return this.alertaService.alertaProxyRequest(req);
    }


}
