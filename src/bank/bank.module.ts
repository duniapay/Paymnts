import { Module } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankController } from './bank.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankTransactionEntity } from './entities/bank.entity';
import { LoggerModule } from '../logger/logger.module';
import { BullModule } from '@nestjs/bull';
import { BankProcessor } from './consumers/bank.processor';
import { GTBankService } from './providers/gtbank.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BankTransactionEntity]),
    LoggerModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'bank-payments-queue',
    }),
  ],
  controllers: [BankController],
  providers: [BankService, BankProcessor, GTBankService],
  exports: [TypeOrmModule, BullModule, GTBankService],
})
export class BankModule {}
