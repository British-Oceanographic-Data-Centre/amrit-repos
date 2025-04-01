import { Test, TestingModule } from '@nestjs/testing';
import { AlertaService } from './alerta.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

describe('AlertaService', () => {
  let service: AlertaService;

    // Mock ConfigService
  const mockConfigService = {
    getOrThrow: jest.fn((key: string) => {
      const mockConfig: Record<string, string> = {
        ALERTA_HOST: 'http://mock-alerta-host',
        ALERTA_READ_API_KEY: 'mock-alerta-key',
      };
      if (mockConfig[key]) return mockConfig[key];
      throw new Error(`Config key ${key} not found`);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [AlertaService, { provide: ConfigService, useValue: mockConfigService }],
      
    }).compile();

    service = module.get<AlertaService>(AlertaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
