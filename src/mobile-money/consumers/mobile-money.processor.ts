import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MomoCollectionDTO, MomoTransferDTO } from '../dto/create-mobile-money.dto';
import { IntouchService } from '../providers/intouch.service';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

@Processor('transactions-queue')
export class MomoProcessor {
  private readonly logger = new Logger(MomoProcessor.name);

  constructor(private readonly intouchService: IntouchService, private readonly configService: ConfigService) {}

  /**
   * transfer funds to a mobile-money account
   * @param job
   * @returns
   */
  @Process('momo-transfer')
  async transfer(job: Job<MomoTransferDTO>) {
    this.logger.debug(`Processing momo-transfer ${job.data}`);
    await this.intouchService.transfer(job.data);
  }

  /**
   * collect funds from a mobile-money account
   * @param job
   * @returns
   */
  @Process('momo-collect')
  async collect(job: Job<MomoCollectionDTO>) {
    this.logger.debug(`Processing momo-collect ${job.data}`);
    await this.intouchService.collect(job.data);
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(`Processing job ${job.id} of type ${job.name} with data ${job.data}...`);
  }
}
