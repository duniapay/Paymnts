import { WebhookEventType, WebhookRequestBody } from '@fiatconnect/fiatconnect-types';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { FindOneOptions, Repository } from 'typeorm';
import { KYCWebhookRequestBody, TransferInWebhookRequestBody, TransferOutWebhookRequestBody } from '../../types';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { WebhookEventEntity } from './entities/webhook-event.entity';
import { WebhookEntity } from './entities/webhook.entity';
import { createHmac } from 'crypto';
import axios from 'axios';
@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    @InjectRepository(WebhookEntity) private readonly webhookRepository: Repository<WebhookEntity>,
    private readonly configService: ConfigService,
  ) {}

  create(createWebhookDto: CreateWebhookDto) {
    const webhookUrlEntity = new WebhookEntity();
    webhookUrlEntity.url = createWebhookDto.url;
    return this.webhookRepository.save(webhookUrlEntity);
  }

  findAll() {
    return this.webhookRepository.find();
  }

  public async notify(e: KYCWebhookRequestBody | TransferInWebhookRequestBody | TransferOutWebhookRequestBody) {
    const event = new WebhookEventEntity();
    event.provider = e.provider;
    event.payload = e.payload;
    event.eventType = e.eventType;
    const savedEntity = await this.webhookRepository.save(event);
    await this.forwardWebhookEvent(e, '');
    return savedEntity;
  }
  private forwardWebhookEvent(e: KYCWebhookRequestBody | TransferInWebhookRequestBody | TransferOutWebhookRequestBody, secret: string) {
    const hmac = createHmac('sha1', secret);

    const webhookDigest = hmac.update(JSON.stringify(e)).digest('hex');
    const t = Date.now();

    const options = {
      headers: {
        'FiatConnect-Signature': `t=${t},s=${webhookDigest}`,
      },
      body: JSON.stringify({ ...e }),
    };
    return axios.post('', options);
  }

  findOne(id: number) {
    const query = {
      where: { id },
    } as FindOneOptions<WebhookEntity>;
    return this.webhookRepository.findOne(query);
  }

  update(id: number, updateWebhookDto: UpdateWebhookDto) {
    const webhookUrlEntity = new WebhookEntity();
    webhookUrlEntity.url = updateWebhookDto.url;
    return this.webhookRepository.update({ id }, webhookUrlEntity);
  }

  async remove(id: number) {
    await this.webhookRepository.delete(id);
  }
}
