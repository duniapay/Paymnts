import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './entity/account.entity';
import { AccountRepository } from './repository/account.repository';
import { dbConfig } from '../config/database';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [LoggerModule, TypeOrmModule.forFeature([AccountEntity])],
  controllers: [AccountController],
  providers: [AccountService, AccountRepository],
})
export class AccountModule {}
