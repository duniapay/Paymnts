import { Module } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankController } from './bank.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankTransactionEntity } from './entities/bank.entity';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [TypeOrmModule.forFeature([BankTransactionEntity]), LoggerModule],
  controllers: [BankController],
  providers: [BankService],
  exports: [TypeOrmModule],
})
export class BankModule {}
