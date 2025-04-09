import { Test, TestingModule } from '@nestjs/testing';
import { AlertaController } from './alerta.controller';
import { AlertaService } from './alerta.service';
import {Request} from 'express';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

describe('AlertaController', () => {
  let alertaController: AlertaController;
  let alertaService: AlertaService

  // Mock ConfigService
const mockConfigService = {
  getOrThrow: jest.fn((key: string) => {
    const mockConfig: Record<string, string> = {
      ALERTA_HOST: 'http://mock-alerta-host',
      ALERTA_READ_API_KEY: 'mock-alerta-key',
      OCEANOPS_HOST: 'http://mock-oceanops-host'
    };
    if (mockConfig[key]) return mockConfig[key];
    throw new Error(`Config key ${key} not found`);
  }),
};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,        
      ],
      controllers: [AlertaController],
      providers: [AlertaService, { provide: ConfigService, useValue: mockConfigService }]
    }).compile();

    alertaController = module.get<AlertaController>(AlertaController);
    alertaService = module.get<AlertaService>(AlertaService);
  });

  it('should be defined', () => {
    expect(alertaController).toBeDefined();
  });

  it('should call alertaService.alertaProxyRequest with request object', async () => {
    const mockReq = { method: 'GET', url: '/test' } as Request;
    const expectedResponse = { message: 'OK' };

    jest.spyOn(alertaService, 'alertaProxyRequest').mockResolvedValue(expectedResponse);;    

    expect(await alertaController.alertaProxy(mockReq)).toBe(expectedResponse);

  })


});
