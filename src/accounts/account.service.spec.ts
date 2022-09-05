import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccountService } from './account.service';

import { AccountEntity } from './entity/account.entity';

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: getRepositoryToken(AccountEntity),
          useValue: {
            get: jest.fn(() => new AccountEntity()), // really it can be anything, but the closer to your actual logic the better
            findOne: jest.fn(() => new AccountEntity()),
            findById: jest.fn(() => new AccountEntity()),
            findAll: jest.fn(() => [new AccountEntity()]),
            delete: jest.fn(() => null),
            create: jest.fn(() => new AccountEntity()),
          },
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
