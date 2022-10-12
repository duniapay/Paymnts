import { FiatType, TransferStatus, TransferType, WebhookEventType } from '@fiatconnect/fiatconnect-types';
import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { BankTransferDTO } from '../../bank/dto/create-bank.dto';
import { MomoCollectionDTO, MomoTransferDTO } from '../../mobile-money/dto/create-mobile-money.dto';

import { WebhookService } from '../webhook.service';

@Processor('transactions-queue')
export class WebhookProcessor {
  constructor(private readonly webhookService: WebhookService) {}

  /**
   * transfer funds to a mobile-money account
   * @param job
   * @returns
   */
  @Process('bank-transfer')
  async bankTransfer(job: Job<BankTransferDTO>) {
    await this.webhookService.notify({
      eventType: WebhookEventType.TransferOutStatusEvent,
      provider: job.data.partner_id,
      url: job.data.meta?.url,
      payload: {
        status: TransferStatus.TransferStarted,
        transferType: TransferType.TransferIn,
        fiatType: FiatType.XOF,
        amount: job.data.amount,
        txId: job.data.meta?.txId,
        partner_id: job.data.partner_id,
        meta: {
          ...job.data.meta,
          txId: undefined,
          url: undefined,
        },
      },
    });
  }

  /**
   * collect funds from a mobile-money account
   * @param job
   * @returns
   */
  @Process('momo-collect')
  async collect(job: Job<MomoCollectionDTO>) {
    await this.webhookService.notify({
      eventType: WebhookEventType.TransferInStatusEvent,
      provider: job.data.partner_id,
      url: job.data.meta?.url,
      payload: {
        status: job.data.meta.txId?.status,
        transferType: TransferType.TransferIn,
        fiatType: FiatType.XOF,
        amount: job.data.amount,
        txId: job.data.meta?.txId,
        partner_id: job.data.partner_id,
        meta: {
          ...job.data.meta,
          txId: undefined,
          url: undefined,
        },
      },
    });
  }

  /**
   * collect funds from a mobile-money account
   * @param job
   * @returns
   */
  @Process('momo-transfer')
  async momoTransfer(job: Job<MomoTransferDTO>) {
    await this.webhookService.notify({
      eventType: WebhookEventType.TransferOutStatusEvent,
      provider: job.data.partner_id,
      url: job.data.meta?.url,
      payload: {
        status: TransferStatus.TransferStarted,
        transferType: TransferType.TransferOut,
        fiatType: FiatType.XOF,
        amount: job.data.amount,
        txId: job.data.meta?.txId,
        partner_id: job.data.partner_id,
        meta: {
          ...job.data.meta,
          txId: undefined,
          url: undefined,
        },
      },
    });
  }

  @OnQueueActive()
  onActive(job: Job) {
    // console.log(`Processing job ${job.id} of type ${job.name} with data ${job.data}...`);
  }
}
