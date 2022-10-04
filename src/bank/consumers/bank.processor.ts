import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { GTBankService } from '../providers/gtbank.service';

@Processor('bank-payments-queue')
export class BankProcessor {
  constructor(private readonly gTBankService: GTBankService) {}

  /**
   * transfer funds to a mobile-money account
   * @param job
   * @returns
   */
  @Process('transfer')
  async transfer(job: Job) {
    // console.log('transfer job details ', job);
    // await this.intouchService.transfer(vehicleArray);
  }

  /**
   * collect funds from a mobile-money account
   * @param job
   * @returns
   */
  @Process('collect')
  async collect(job: Job) {
    // console.log('collection job details ', job);
    // await this.intouchService.collect(vehicleArray);
  }

  @OnQueueActive()
  onActive(job: Job) {
    // console.log(`Processing job ${job.id} of type ${job.name} with data ${job.data}...`);
  }
}
