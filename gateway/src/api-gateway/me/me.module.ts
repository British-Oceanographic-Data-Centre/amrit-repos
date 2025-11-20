import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { MeController } from './me.controller';
import { MeService } from './me.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
  ],
  controllers: [MeController],
  providers: [MeService],
  exports: [MeService], 
})
export class MeModule {}
