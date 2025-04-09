import { Module } from '@nestjs/common';
import { AlertaModule } from './alerta/alerta.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [AlertaModule, AuthModule],
})
export class ApiGatewayModule {}
