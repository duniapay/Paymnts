import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { UsersService } from '../../users/users.service';
import { MomoCollectionDTO, MomoTransferDTO } from '../dto/create-mobile-money.dto';
import { IntouchService } from '../providers/intouch.service';
import * as crypto from 'crypto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Processor('mobile-money-payments-queue')
export class MomoProcessor {
  private readonly webhook_secret: string;
  private readonly provider_id: string;

  constructor(
    private readonly intouchService: IntouchService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    this.provider_id = this.configService.get<string>('PROVIDER_ID');
    this.webhook_secret = this.configService.get<string>('WEBHOOK_SECRET');
  }

  /**
   * transfer funds to a mobile-money account
   * @param job
   * @returns
   */
  @Process('transfer')
  async transfer(job: Job<MomoTransferDTO>) {
    await this.intouchService.transfer(job.data);
  }

  /**
   * collect funds from a mobile-money account
   * @param job
   * @returns
   */
  @Process('collect')
  async collect(job: Job<MomoCollectionDTO>) {
    await this.intouchService.collect(job.data);
  }

  /**
   * notify funds from a mobile-money account
   * @param job
   * @returns
   */
  @Process('notify')
  async notify(job: Job<any>) {
    const webhook_payload = job.data?.tx;
    const webhook_url = job.data?.url;

    const hmac = crypto.createHmac('sha1', this.webhook_secret);

    const webhookDigest = hmac.update(webhook_payload).digest('hex');
    const t = Date.now();
    const options = {
      headers: {
        'FiatConnect-Signature': `t=${t},s=${webhookDigest}`,
      },
      body: { ...webhook_payload },
    };
    return await axios.post(webhook_url, options);
  }

  @OnQueueActive()
  onActive(job: Job) {
    // this.logger.debug(`Processing job ${job.id} of type ${job.name} with data ${job.data}...`);
  }
}
