import { All, Controller,  Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request} from 'express';
import { Public } from './public.decorator';

@Controller('oceanops/auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    
    @Public()
    @Post('/login')
    loginProxy(@Req() req: Request) {
        return this.authService.authProxyRequest(req);
    }

    @All('*')
    authProxy(@Req() req: Request) {
        return this.authService.authProxyRequest(req);
    }




}
