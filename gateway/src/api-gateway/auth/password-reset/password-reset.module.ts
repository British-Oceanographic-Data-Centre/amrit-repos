// password-reset/password-reset.module.ts
import { Module } from '@nestjs/common';
import { PasswordResetController } from './password-reset.controller';
import { PasswordResetService } from './password-reset.service';
import { MailerService } from '../../../mailer/mailer.service';

@Module({
  controllers: [PasswordResetController],
  providers: [PasswordResetService, MailerService],
})
export class PasswordResetModule {}
