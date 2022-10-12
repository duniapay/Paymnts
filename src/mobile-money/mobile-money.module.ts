import { Module } from '@nestjs/common';
import { MomoService } from './mobile-money.service';
import { MobileMoneyController } from './mobile-money.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MobileMoneyTransactionEntity } from './entities/mobile-money.entity';
import { LoggerModule } from '../logger/logger.module';
import { UsersModule } from '../users/users.module';
import { MomoProcessor } from './consumers/mobile-money.processor';
import { IntouchService } from './providers/intouch.service';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [LoggerModule, UsersModule, QueueModule, TypeOrmModule.forFeature([MobileMoneyTransactionEntity]), QueueModule],
  controllers: [MobileMoneyController],
  providers: [MomoService, MomoProcessor, IntouchService],
  exports: [TypeOrmModule],
})
export class MobileMoneyModule {}
