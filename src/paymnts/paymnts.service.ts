import { FiatAccountSchema, TransferStatus, TransferType } from '@fiatconnect/fiatconnect-types';
import { Injectable, Logger } from '@nestjs/common';
import { KafkaContext } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BankService } from '../bank-service/bank-service.service';
import { BankTransferResponse } from '../bank-service/dto/bank-transfer.dto';
import { LoggerService } from '../logger/logger.service';
import { IntouchAPIResponseInterface } from '../momo-service/dto/momo-transaction.dto';
import { MomoService } from '../momo-service/momo-service.service';
import { WalletTransferResponse } from '../wallet-service/dto/wallet-transfer-response.dto';
import { WalletService } from '../wallet-service/wallet-service.service';
import { CreateTransactionEventDto } from './dto/create-payment-event.dto';
import { UpdateTransactionEventDto } from './dto/update-payment-event.dto';

@Injectable()
export class PaymntsService {
  constructor(
    private readonly logger: LoggerService = new Logger(PaymntsService.name),
    private readonly bankService: BankService,
    private readonly momoService: MomoService,
    private readonly walletService: WalletService,
  ) {}

  async handleCreatedEvent(message: any, context: KafkaContext) {
    const originalMessage = context.getMessage();
    const obj = JSON.parse(JSON.stringify(originalMessage.value)) as CreateTransactionEventDto;
    const { id, account, amount, metadata } = obj;
    // TODO: Get account schema
    // TODO: Process Transaction with PSP API
    let res: IntouchAPIResponseInterface | BankTransferResponse | WalletTransferResponse;
    if (obj.transferType === TransferType.TransferIn && obj.account.fiatAccountSchema === FiatAccountSchema.MobileMoney) {
      res = await this.momoService.collect(id, account, amount, metadata?.otp);
    }
    if (obj.transferType === TransferType.TransferOut && obj.account.fiatAccountSchema === FiatAccountSchema.MobileMoney) {
      res = await this.momoService.disburse(id, account, amount);
    }
    if (obj.transferType === TransferType.TransferIn && obj.account.fiatAccountSchema === FiatAccountSchema.DuniaWallet) {
      res = await this.walletService.collect(id, account, amount);
    }
    if (obj.transferType === TransferType.TransferOut && obj.account.fiatAccountSchema === FiatAccountSchema.DuniaWallet) {
      res = await this.walletService.disburse(id, account, amount);
    }
    if (obj.transferType === TransferType.TransferOut && obj.account.fiatAccountSchema === FiatAccountSchema.AccountNumber) {
      res = await this.bankService.disburse(id, account, amount);
    }
    if (obj.transferType === TransferType.TransferIn && obj.account.fiatAccountSchema === FiatAccountSchema.AccountNumber) {
      // Not implemented
      throw new Error('Not implemented');
    }

    // todo: update status based on tx response
    // Update Status
    obj.status = TransferStatus.TransferStarted;
    return obj;
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  handleCron() {
    // Load Tx status from webhooks database and update accordingly
    this.logger.debug('Loading Transaction statuses from the past 5 minutes ...');
  }

  handleCompletedEvent(message: any, context: KafkaContext) {
    const originalMessage = context.getMessage();
    const obj = JSON.parse(JSON.stringify(originalMessage.value)) as UpdateTransactionEventDto;
    obj.status = TransferStatus.TransferComplete;
    return obj;
  }

  handleUpdatedEvent(message: any, context: KafkaContext) {
    const originalMessage = context.getMessage();
    const obj = JSON.parse(JSON.stringify(originalMessage.value)) as UpdateTransactionEventDto;
    return obj;
  }
}
