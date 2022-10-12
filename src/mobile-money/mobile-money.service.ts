import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IntouchAPIResponseInterface, MomoCollectionDTO, MomoTransferDTO } from './dto/create-mobile-money.dto';
import { MobileMoneyTransactionEntity } from './entities/mobile-money.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { TransferStatus } from '@fiatconnect/fiatconnect-types';
import { UsersService } from '../users/users.service';

@Injectable()
export class MomoService {
  private readonly logger = new Logger(MomoService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(MobileMoneyTransactionEntity)
    private repository: Repository<MobileMoneyTransactionEntity>,
    private readonly userService: UsersService,

    @InjectQueue('transactions-queue') private queue: Queue,
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
    entity.status = TransferStatus.TransferFiatFundsDebited;
    this.logger.log('Creating a transaction');
    const user = await this.userService.findOne({ id: entity.partner_id });

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
        meta: {
          url: user.webhook_url,
        },
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
        meta: {
          url: user.webhook_url,
        },
      };

      const savedEntity = await this.repository.save(entity);
      dto.meta.txId = savedEntity.id;
      this.queue.add('transfer', dto);

      return savedEntity;
    }
  }

  public async update(requestStatus: IntouchAPIResponseInterface): Promise<any> {
    const { partner_transaction_id, status, recipient_phone_number } = requestStatus;
    this.logger.log(`update ${partner_transaction_id}`);
    const entity = await this.repository.findOneBy({ id: partner_transaction_id });
    entity.status = TransferStatus.TransferFiatFundsDebited;
    const updateResult = await this.repository.update({ id: partner_transaction_id }, entity);
    entity.status = TransferStatus.TransferComplete;
    return updateResult;
  }
}
