import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

describe('AuthController', () => {
  let controller: AuthController;

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
      
      controllers: [AuthController],
      providers: [AuthService, { provide: ConfigService, useValue: mockConfigService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
