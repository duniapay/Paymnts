import { Controller, Inject, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { async } from 'rxjs';

@Controller('messaging')
export class MessagingController implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject('PAYMNTS_SERVICE') private readonly client: ClientKafka) {}
  async onModuleInit() {
    ['transaction.created', 'transaction.updated'].forEach((key) => this.client.subscribeToResponseOf(`${key}`));
    await this.client.connect();
  }
  async onModuleDestroy() {
    await this.client.close();
  }
}
