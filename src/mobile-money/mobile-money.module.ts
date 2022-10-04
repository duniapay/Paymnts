import { Module } from '@nestjs/common';
import { MomoService } from './mobile-money.service';
import { MobileMoneyController } from './mobile-money.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MobileMoneyTransactionEntity } from './entities/mobile-money.entity';
import { LoggerModule } from '../logger/logger.module';
import { UsersModule } from '../users/users.module';
import { BullModule } from '@nestjs/bull';
import { MomoProcessor } from './consumers/mobile-money.processor';
import { IntouchService } from './providers/intouch.service';

@Module({
  imports: [
    LoggerModule,
    UsersModule,
    TypeOrmModule.forFeature([MobileMoneyTransactionEntity]),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'mobile-money-payments-queue',
    }),
  ],
  controllers: [MobileMoneyController],
  providers: [MomoService, MomoProcessor, IntouchService],
  exports: [TypeOrmModule, BullModule],
})
export class MobileMoneyModule {}
