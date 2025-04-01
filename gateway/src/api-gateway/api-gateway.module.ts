import { Module } from '@nestjs/common';
import { AlertaModule } from './alerta/alerta.module';

@Module({
    imports: [AlertaModule],
})
export class ApiGatewayModule {}
