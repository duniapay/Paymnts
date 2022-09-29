import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config';
import { HealthModule } from './health/health.module';
import { BankModule } from './bank/bank.module';
import { MobileMoneyModule } from './mobile-money/mobile-money.module';
import { BankService } from './bank/bank.service';
import { MomoService } from './mobile-money/mobile-money.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { IdentityModule } from './identity/identity.module';

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
    ScheduleModule.forRoot(),
    HealthModule,
    AuthModule,
    UsersModule,
    BankModule,
    MobileMoneyModule,
    IdentityModule,
  ],
  controllers: [AppController],
  providers: [AppService, MomoService, BankService],
})
export class AppModule {}
