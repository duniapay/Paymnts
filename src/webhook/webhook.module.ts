import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhookEntity } from './entities/webhook.entity';
import { LoggerModule } from '../logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import { WebhookEventEntity } from './entities/webhook-event.entity';

@Module({
  imports: [LoggerModule, TypeOrmModule.forFeature([WebhookEntity, WebhookEventEntity])],
  controllers: [WebhookController],
  providers: [WebhookService],
  exports: [TypeOrmModule],
})
export class WebhookModule {}
