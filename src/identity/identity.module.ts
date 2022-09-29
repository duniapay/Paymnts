import { Module } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { IdentityController } from './identity.controller';
import { LoggerModule } from '../logger/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdentityEntity } from './entities/identity.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [LoggerModule, UsersModule, TypeOrmModule.forFeature([IdentityEntity])],
  controllers: [IdentityController],
  providers: [IdentityService],
  exports: [TypeOrmModule],
})
export class IdentityModule {}
