import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';
import { Public } from '../../auth/public.decorator';

class RequestDto { email!: string; }

@Controller('password-reset')
export class PasswordResetController {
  constructor(private readonly svc: PasswordResetService) {}

  @Public()
  @Post('request')
  @HttpCode(202)
  async request(@Body('email') email: string) {
    return this.svc.request(email);
  }

  @Public()
  @Post('confirm')
  async confirm(@Body() body: { token: string; newPassword: string }) {
    return this.svc.confirm(body.token, body.newPassword);
  }
}
