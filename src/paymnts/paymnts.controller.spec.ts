import { Test, TestingModule } from '@nestjs/testing';
import { PaymntsController } from './paymnts.controller';
import { PaymntsService } from './paymnts.service';

describe('PaymntsController', () => {
  let controller: PaymntsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymntsController],
      providers: [PaymntsService],
    }).compile();

    controller = module.get<PaymntsController>(PaymntsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
