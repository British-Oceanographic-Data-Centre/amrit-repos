import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { RequestMethod } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { httpAdapter} = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  app.enableCors({
    origin: 'http://localhost:3000',    
  });

  app.setGlobalPrefix('api',{
    exclude: [
      { path: '/', method: RequestMethod.GET }, // exclude '/api' for main controller to have http://localhost:3000 to be available (cypress test...)
    ],
  });

  await app.listen(process.env.PORT ?? 3001, process.env.HOSTNAME || 'localhost');
}
bootstrap();
