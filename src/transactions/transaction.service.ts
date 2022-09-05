import { TransferStatus } from '@fiatconnect/fiatconnect-types';
import { Injectable, Logger } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';

import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransferEntity } from './entity/transfer.entity';
import { TransferRepository } from './repository/transfer.repository';

@Injectable()
export class TransactionService {
  constructor(private repository: TransferRepository, private readonly logger: LoggerService = new Logger(TransactionService.name)) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const entity = new TransferEntity();
    entity.fiatAccountId = createTransactionDto.accountId;
    entity.amount = createTransactionDto.amount;
    entity.status = TransferStatus.TransferStarted;
    entity.transferType = createTransactionDto.transferType;

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

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const entity = new TransferEntity();
    entity.fiatAccountId = updateTransactionDto.accountId;
    entity.amount = updateTransactionDto.amount;
    entity.status = updateTransactionDto.status;
    entity.transferType = updateTransactionDto.transferType;

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
    await this.repository.remove(entity).then((data) => {
      return true;
    });
  }
}
