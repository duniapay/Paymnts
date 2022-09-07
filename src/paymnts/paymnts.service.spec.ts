import { Test, TestingModule } from '@nestjs/testing';
import { PaymntsService } from './paymnts.service';

describe('PaymntsService', () => {
  let service: PaymntsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymntsService],
    }).compile();

    service = module.get<PaymntsService>(PaymntsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
