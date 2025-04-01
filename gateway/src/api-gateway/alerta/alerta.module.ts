import { Module } from '@nestjs/common';
import { AlertaController } from './alerta.controller';
import { AlertaService } from './alerta.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [AlertaController],
  providers: [AlertaService]
})
export class AlertaModule {}
