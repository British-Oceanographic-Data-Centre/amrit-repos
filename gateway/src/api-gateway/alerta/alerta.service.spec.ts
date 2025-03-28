import { Test, TestingModule } from '@nestjs/testing';
import { AlertaService } from './alerta.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

describe('AlertaService', () => {
  let service: AlertaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule.forRoot({ isGlobal: true })],
      providers: [AlertaService],
      
    }).compile();

    service = module.get<AlertaService>(AlertaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
