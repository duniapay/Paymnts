import { Test, TestingModule } from '@nestjs/testing';
import { MobileMoneyController } from './mobile-money.controller';
import { MobileMoneyService } from './mobile-money.service';

describe('MobileMoneyController', () => {
  let controller: MobileMoneyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MobileMoneyController],
      providers: [MobileMoneyService],
    }).compile();

    controller = module.get<MobileMoneyController>(MobileMoneyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
