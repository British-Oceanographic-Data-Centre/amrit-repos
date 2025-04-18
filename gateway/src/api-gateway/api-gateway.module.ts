import { Module } from '@nestjs/common';
import { AlertaModule } from './alerta/alerta.module';
import { AuthModule } from './auth/auth.module';
import { AlertSubscriptionsModule } from './alert-subscriptions/alert-subscriptions.module';


@Module({
    imports: [AlertaModule, AuthModule, AlertSubscriptionsModule],
})
export class ApiGatewayModule {}
