import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: process.env.CLOUDKARAFKA_BROKERS.split(','),
        sasl: {
          mechanism: 'scram-sha-256', // scram-sha-256 or scram-sha-512
          username: process.env.CLOUDKARAFKA_USERNAME,
          password: process.env.CLOUDKARAFKA_PASSWORD,
        },
      },
    },
  });
  await app.listen();
}
bootstrap();
