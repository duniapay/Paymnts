import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhookEntity } from './entities/webhook.entity';
import { LoggerModule } from '../logger/logger.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [LoggerModule, TypeOrmModule.forFeature([WebhookEntity])],
  controllers: [WebhookController],
  providers: [WebhookService],
  exports: [TypeOrmModule],
})
export class WebhookModule {}
