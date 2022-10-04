import { Module } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { IdentityController } from './identity.controller';
import { LoggerModule } from '../logger/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdentityEntity } from './entities/identity.entity';
import { UsersModule } from '../users/users.module';
import { BullModule } from '@nestjs/bull';
import { AMLService } from './providers/aml.service';

@Module({
  imports: [
    LoggerModule,
    UsersModule,
    TypeOrmModule.forFeature([IdentityEntity]),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'kyc-queue',
    }),
  ],
  controllers: [IdentityController],
  providers: [IdentityService, AMLService],
  exports: [TypeOrmModule, BullModule, AMLService],
})
export class IdentityModule {}
