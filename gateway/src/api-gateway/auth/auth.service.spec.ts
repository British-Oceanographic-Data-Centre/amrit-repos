import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;

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
      imports: [HttpModule],
      providers: [AuthService, { provide: ConfigService, useValue: mockConfigService }],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
