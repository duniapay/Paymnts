import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config';
import { HealthModule } from './health/health.module';
import { PaymntsModule } from './paymnts/paymnts.module';
import { MessagingModule } from './messaging/messaging.module';
import { MomoService } from './momo-service/momo-service.service';
import { BankService } from './bank-service/bank-service.service';
import { WalletService } from './wallet-service/wallet-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.get('database'),
      inject: [ConfigService],
    }),
    MessagingModule,
    ScheduleModule.forRoot(),
    HealthModule,
    PaymntsModule,
  ],
  controllers: [AppController],
  providers: [AppService, MomoService, BankService, WalletService],
})
export class AppModule {}
