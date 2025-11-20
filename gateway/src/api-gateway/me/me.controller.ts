import { Controller, Patch, Post, Req, Body, UseGuards, HttpException, Logger, Get } from '@nestjs/common';
import { Request } from 'express';
import { MeService } from './me.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AxiosResponse } from 'axios';

@Controller('oceanops/auth')
@UseGuards(JwtAuthGuard)
export class MeController {
  private readonly logger = new Logger(MeController.name, { timestamp: true });
  constructor(private readonly meService: MeService) {}

  @Get('me')
  async getMe(@Req() req: Request) {
    const userId = (req as any).user?.userId;
    if (!userId) throw new HttpException({ error: 'Missing userId' }, 401);
    return this.meService.proxyGetMe(req, userId);
  }
  
  @Patch('me')
  async updateMe(@Req() req: Request, @Body() body: any) {
    const userId = (req as any).user?.userId;
    this.logger.log((req as any).user);
    if (!userId) throw new HttpException({ error: 'Missing userId' }, 401);
    return this.meService.proxyPatchMe(req, body, userId);
  }

  @Post('change-password')
  async changePassword(@Req() req: Request, @Body() body: any) {
    const userId = (req as any).user?.userId;
    if (!userId) throw new HttpException({ message: 'Missing userId' }, 401);

    try {
      const upstream: AxiosResponse<any> =
        await this.meService.proxyPostChangePassword(req, body, userId);

      // Success → return the upstream JSON/body
      return upstream.data; // Nest will set 200 here (because upstream was 2xx)
    } catch (e: unknown) {
      // Axios throws on non-2xx; type it safely
      const err = e as { response?: AxiosResponse<any>; message?: string };
      const status = err.response?.status ?? 500;
      const payload = err.response?.data ?? { message: err.message || 'Proxy error' };
      throw new HttpException(payload, status);
    }
  }
}
