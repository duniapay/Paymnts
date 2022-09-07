import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MessagingController } from './messaging.controller';
import { MessagingService } from './messaging.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PAYMNTS_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'payments',
            brokers: process.env.CLOUDKARAFKA_BROKERS.split(','),
          },
          consumer: {
            groupId: 'payments-consumer',
          },
        },
      },
    ]),
    MessagingModule,
  ],
  providers: [MessagingService, MessagingController],
  controllers: [MessagingController],
  exports: [MessagingService],
})
export class MessagingModule {}
