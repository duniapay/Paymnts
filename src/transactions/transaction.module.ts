import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransferEntity } from './entity/transfer.entity';
import { TransferRepository } from './repository/transfer.repository';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [LoggerModule, TypeOrmModule.forFeature([TransferEntity])],
  controllers: [TransactionController],
  providers: [TransactionService, TransferRepository],
})
export class TransactionModule {}
