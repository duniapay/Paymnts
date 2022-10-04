import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { WebhookEntity } from './entities/webhook.entity';

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
