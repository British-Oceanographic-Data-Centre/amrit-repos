import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '../../../mailer/mailer.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PasswordResetService {
  private readonly logger = new Logger(PasswordResetService.name);
  private apiBase : string;
  private gwSecret: string;

  constructor(
    private readonly mailer: MailerService,
    private readonly config: ConfigService) {
      const protocol = this.config.get<string>('OCEANOPS_PROTOCOL', 'https');
      const host = this.config.get<string>('OCEANOPS_HOST', 'localhost:8080');
      // mirror proxy.routes.ts → targetPath: '/api/data'
      const targetPath = '/api/data';
      this.apiBase = `${protocol}://${host}${targetPath}`;
      this.gwSecret = this.config.get<string>('GATEWAY_SHARED_SECRET', '');
    }

  async request(email: string) {
    const clean = (email ?? '').trim().toLowerCase();
    this.logger.debug(`Forwarding to API: ${JSON.stringify({ email })}`);
    const res = await fetch(`${this.apiBase}/password/reset/request`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Accept': 'application/json',
        'X-Gateway-Secret': this.gwSecret, 
      },
      body: JSON.stringify({ email: clean }),
    });

    const raw = await res.text();
    this.logger.debug(`OceanOPS /request -> ${res.status} ${raw}`);

    if (!res.ok) return { upstreamStatus: res.status, upstreamBody: tryParse(raw) };

    const body = tryParse(raw);
    if (res.status === 202 && body?.mailPayload) {
      const { to, subject, text } = body.mailPayload;
      const html = text
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1">$1</a>')
      .replace(/\n/g, '<br/>');
      
      await this.mailer.sendMail(to, subject, html, 'AMRIT');
      return { queued: true };
    }
    return body ?? { queued: false, mailPayload: null };
  }

  async confirm(token: string, newPassword: string) {
    const res = await fetch(`${this.apiBase}/password/reset/confirm`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json' ,
        'X-Gateway-Secret': this.gwSecret,
      },
      body: JSON.stringify({ token: (token ?? '').trim(), newPassword }),
    });

    const raw = await res.text();
    this.logger.debug(`OceanOPS /confirm -> ${res.status} ${raw}`);

    if (!res.ok) return { upstreamStatus: res.status, upstreamBody: tryParse(raw) };
    return { ok: true };
  }
}

function tryParse(t: string) {
  try { return JSON.parse(t); } catch { return { raw: t }; }
}
