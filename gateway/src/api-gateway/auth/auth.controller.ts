import { All, Controller, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request} from 'express';

@Controller('oceanops')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @All('*')
    alertaProxy(@Req() req: Request) {
        return this.authService.tempAuthProxyRequest(req);
    }




}
