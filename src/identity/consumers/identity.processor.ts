import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { AMLService } from '../providers/aml.service';

@Processor('kyc-queue')
export class IdentityProcessor {
  constructor(private readonly amlService: AMLService) {}

  /**
   * transfer funds to a mobile-money account
   * @param job
   * @returns
   */
  @Process('kyc')
  async check(job: Job) {
    const selfieDoc = await this.amlService.downloadSelfieDocument();
    const selfieValidationResponse = await this.amlService.validateSelfieDocument(selfieDoc);

    const idDoc = await this.amlService.downloadSelfieDocument();

    const idValidationResponse = await this.amlService.validateIdentityDocument(idDoc);

    const amlCheckResponse = await this.amlService.amlChecks(null);
    return { selfieValidationResponse, idValidationResponse, amlCheckResponse };

    // console.log(`${selfieValidationResponse} ${idValidationResponse} ${amlCheckResponse}`);
  }

  @OnQueueActive()
  onActive(job: Job) {
    // console.log(`Processing job ${job.id} of type ${job.name} with data ${job.data}...`);
  }
}
