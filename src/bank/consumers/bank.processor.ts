import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { BankTransferDTO } from '../dto/create-bank.dto';
import { GTBankService } from '../providers/gtbank.service';

@Processor('transactions-queue')
export class BankProcessor {
  constructor(private readonly gTBankService: GTBankService) {}

  /**
   * transfer funds to a mobile-money account
   * @param job
   * @returns
   */
  @Process('bank-transfer')
  async transfer(job: Job<BankTransferDTO>) {
    // console.log('transfer job details ', job);
    // await this.intouchService.transfer(vehicleArray);
  }

  @OnQueueActive()
  onActive(job: Job) {
    // console.log(`Processing job ${job.id} of type ${job.name} with data ${job.data}...`);
  }
}
