import { Module } from '@nestjs/common';
import { AlertsMqttService } from './listener.service';
import { HttpModule } from '@nestjs/axios';
import { EmailModule } from '../../mailer/mailer.module';
import { EmailFormatterService } from './email-formatter.service';
import { ContactMatcherService } from './contact-matcher.service';

@Module({
  imports: [HttpModule, EmailModule],
  providers: [AlertsMqttService, EmailModule, EmailFormatterService, ContactMatcherService ],
  exports: [EmailFormatterService, ContactMatcherService ]
})
export class AlertsMqttModule {}
