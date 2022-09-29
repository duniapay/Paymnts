import { Test, TestingModule } from '@nestjs/testing';
import { MobileMoneyService } from './mobile-money.service';

describe('MobileMoneyService', () => {
  let service: MobileMoneyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MobileMoneyService],
    }).compile();

    service = module.get<MobileMoneyService>(MobileMoneyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
