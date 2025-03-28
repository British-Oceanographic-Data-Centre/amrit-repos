import { All, Controller, Req } from '@nestjs/common';
import { AlertaService } from './alerta.service';
import { Request } from 'express';

@Controller('alerta')
export class AlertaController {

 constructor(private readonly alertaService: AlertaService) {}

    @All('*')
    alertaProxy(@Req() req: Request) {
        return this.alertaService.alertaProxyRequest(req);
    }


}
