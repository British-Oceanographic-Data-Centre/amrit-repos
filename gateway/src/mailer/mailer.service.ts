import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  private readonly transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT ?? '25', 10),
      secure: false,
      tls: { rejectUnauthorized: false },
    });
  }

  async sendMail(
    to: string,
    subject: string,
    html: string,
    senderName: string,
  ): Promise<void> {
    try {
      const info: SMTPTransport.SentMessageInfo = await this.transporter.sendMail({
        from: `${senderName} <${process.env.SMTP_SENDER}>`,
        to,
        subject,
        html,
      });

      this.logger.log(`Email sent: ${info.messageId}`);
    } catch (err: unknown) {
      this.logger.error('Failed to send email', err);
      throw err;
    }
  }

  async sendTestEmail(
    to: string,
    subject: string,
    html: string,
    senderName: string,
  ): Promise<void> {
    const testAccount = await nodemailer.createTestAccount();
    const testTransporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> =
      nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

    try {
      const info: SMTPTransport.SentMessageInfo = await testTransporter.sendMail({
        from: `${senderName} <${testAccount.user}>`,
        to,
        subject,
        html,
      });

      this.logger.log(`Mock Email sent: ${info.messageId}`);

      const previewUrl: string | false | undefined = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        this.logger.log(`📬 Preview URL: ${previewUrl}`);
      }
    } catch (err: unknown) {
      this.logger.error('Failed to send mock email', err);
      throw err;
    }
  }
}
