import { Module } from '@nestjs/common';
import { MomoService } from './mobile-money.service';
import { MobileMoneyController } from './mobile-money.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MobileMoneyTransactionEntity } from './entities/mobile-money.entity';
import { LoggerModule } from '../logger/logger.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [LoggerModule, UsersModule, TypeOrmModule.forFeature([MobileMoneyTransactionEntity])],
  controllers: [MobileMoneyController],
  providers: [MomoService],
  exports: [TypeOrmModule],
})
export class MobileMoneyModule {}
