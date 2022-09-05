import { Injectable, Logger } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';

import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountEntity } from './entity/account.entity';
import { AccountRepository } from './repository/account.repository';

@Injectable()
export class AccountService {
  constructor(private repository: AccountRepository, private readonly logger: LoggerService = new Logger(AccountService.name)) {}
  async create(createAccountDto: CreateAccountDto) {
    const entity = new AccountEntity();

    entity.accountName = createAccountDto.accountName;
    entity.institutionName = createAccountDto.institutionName;
    entity.accountNumber = createAccountDto.accountNumber;
    entity.fiatAccountSchema = createAccountDto.fiatAccountSchema;
    entity.fiatAccountType = createAccountDto.fiatAccountType;
    entity.mobile = createAccountDto.mobile;
    entity.operator = createAccountDto.operator;
    entity.owner = createAccountDto.ownerId;
    await this.repository.save(entity).then((data) => {
      return data;
    });
  }

  async findAll() {
    await this.repository.find().then((data) => {
      return data;
    });
  }

  async findOne(id: number) {
    await this.repository.findOneBy({ id }).then((data) => {
      return data;
    });
  }

  async update(id: number, updateAccountDto: UpdateAccountDto) {
    const entity = new AccountEntity();
    entity.accountName = updateAccountDto.accountName;
    entity.institutionName = updateAccountDto.institutionName;
    entity.accountNumber = updateAccountDto.accountNumber;
    entity.fiatAccountSchema = updateAccountDto.fiatAccountSchema;
    entity.fiatAccountType = updateAccountDto.fiatAccountType;
    entity.mobile = updateAccountDto.mobile;
    entity.operator = updateAccountDto.operator;
    entity.owner = updateAccountDto.ownerId;
    await this.repository
      .update(
        {
          id,
        },
        entity,
      )
      .then((data) => {
        return data;
      });
  }

  async remove(id: number) {
    const entity = await this.repository.findOneBy({ id });
    await this.repository.remove(entity).then(() => {
      return true;
    });
  }
}
