import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AlertaModule } from '../src/api-gateway/alerta/alerta.module';
import { AlertaService } from '../src/api-gateway/alerta/alerta.service';
import { Server } from 'http';

describe('AlertaController (e2e)', () => {
    let app: INestApplication;
  
    const alertaServiceMock = {
      alertaProxyRequest: jest.fn().mockResolvedValue({ message: 'OK' }),
    };
  
    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AlertaModule],
      })
        .overrideProvider(AlertaService)
        .useValue(alertaServiceMock)
        .compile();
  
      app = moduleFixture.createNestApplication();
      await app.init();
    });
  
    it('/alerta (GET)', () => {
      return request(app.getHttpServer() as unknown as Server)
		.get('/alerta/alerts')
		.expect(200)
		.expect({ message: 'OK' });
			});
  
    afterAll(async () => {
      await app.close();
    });
  });