import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IntouchAPIResponseInterface, MomoCollectionDTO, MomoTransferDTO } from './dto/create-mobile-money.dto';
import { MobileMoneyTransactionEntity } from './entities/mobile-money.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class MomoService {
  private readonly logger = new Logger(MomoService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(MobileMoneyTransactionEntity)
    private repository: Repository<MobileMoneyTransactionEntity>,
    @InjectQueue('mobile-money-payments-queue') private queue: Queue,
  ) {}

  public async findOne(id: string): Promise<MobileMoneyTransactionEntity> {
    this.logger.log('Returning one transaction');
    return this.repository.findOneBy({ id });
  }
  public async create(tx: any): Promise<MobileMoneyTransactionEntity> {
    const entity = new MobileMoneyTransactionEntity();
    entity.operator = tx.operator;
    entity.amount = tx.amount;
    entity.city = tx.city;
    entity.country = tx.country;
    entity.receiver_phone_number = tx.receiver_phone_number;
    entity.reference = tx.reference;
    entity.currency = tx.currency;
    entity.partner_id = tx.partner_id;
    entity.sending_reason = tx.sending_reason;
    entity.receiver_first_name = tx.receiver_first_name;
    entity.receiver_last_name = tx.receiver_last_name;
    entity.status = 'Operation being processed.';
    this.logger.log('Creating a transaction');

    if (tx.otp !== undefined) {
      entity.otp = tx.otp;

      const dto: MomoCollectionDTO = {
        otp: tx.otp,
        amount: 500,
        operator: tx.operator,
        country: tx.country,
        reference: tx.reference,
        partner_id: tx.reference,
        currency: tx.currency,
        receiver_phone_number: tx.receiver_phone_number,
        receiver_last_name: tx.receiver_last_name,
        receiver_first_name: tx.receiver_first_name,
        city: tx.city,
        sending_reason: tx.sending_reason,
      };
      this.queue.add('collect', dto);
    } else {
      const dto: MomoTransferDTO = {
        amount: 0,
        operator: tx.operator,
        country: tx.country,
        reference: tx.reference,
        partner_id: tx.partner_id,
        currency: tx.currency,
        receiver_phone_number: tx.receiver_phone_number,
        receiver_last_name: tx.receiver_last_name,
        receiver_first_name: tx.receiver_first_name,
        city: tx.city,
        sending_reason: tx.sending_reason,
      };
      this.queue.add('transfer', dto);
    }
    return this.repository.save(entity);
  }

  public async update(requestStatus: IntouchAPIResponseInterface): Promise<any> {
    const { partner_transaction_id, status, recipient_phone_number } = requestStatus;
    // const decrypted = decrypt(partner_transaction_id);
    // const { currency, partner_id, tx_id, account } = decrypted;
    this.logger.log(`update ${partner_transaction_id}`);
    const entity = await this.repository.findOneBy({ id: partner_transaction_id });
    entity.status = status;
    const updateResult = await this.repository.update({ id: partner_transaction_id }, entity);
    await this.queue.add('notify', {
      user_id: entity.owner.id,
      url: entity.owner.webhook_url.url,
      tx: {
        status,
        failure_reason: entity.failure_reason,
      },
    });
    return updateResult;
  }
}
