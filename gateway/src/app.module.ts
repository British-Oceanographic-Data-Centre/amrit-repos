import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiGatewayModule } from './api-gateway/api-gateway.module';
import { AlertsMqttModule } from './api-gateway/alert-mqtt/listener.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { EmailModule } from './mailer/mailer.module';

@Module({
  imports: [EmailModule, AlertsMqttModule, ApiGatewayModule, HttpModule, ConfigModule.forRoot({isGlobal: true,})],
  controllers: [AppController],
  providers: [EmailModule, AppService],
})
export class AppModule {}
