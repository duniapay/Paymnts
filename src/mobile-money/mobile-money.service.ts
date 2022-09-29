import { SupportedOperatorEnum } from '@fiatconnect/fiatconnect-types';
import { Injectable, Logger } from '@nestjs/common';
import * as rp from 'request-promise';
import { ConfigService } from '@nestjs/config';
import { INTOUCH_SERVICE, INTOUCH_SERVICE_CI } from '../domain/utils/constants';
import {
  IntouchAccountConfig,
  IntouchCollectRequestBody,
  IntouchAPIResponseInterface,
  IntouchDisburseRequestBody,
  MomoCollectionDTO,
  MomoTransferDTO,
} from './dto/create-mobile-money.dto';
import { encrypt, decrypt } from '../domain/utils/hash.utils';
import { MobileMoneyTransactionEntity } from './entities/mobile-money.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MomoService {
  private readonly logger = new Logger(MomoService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(MobileMoneyTransactionEntity)
    private repository: Repository<MobileMoneyTransactionEntity>,
  ) {}

  public async findOne(id: string): Promise<MobileMoneyTransactionEntity> {
    this.logger.log('Returning one transaction');
    return await this.repository.findOneBy({ id });
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
    this.logger.log('Creating a transaction');

    if (tx.otp) {
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
      const response = await this.collect(dto);
      entity.status = response.status;
    }
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
    const response = await this.transfer(dto);
    entity.status = response.message;
    return this.repository.save(entity);
  }

  public async update(id: string, requestStatus: IntouchAPIResponseInterface): Promise<MobileMoneyTransactionEntity> {
    const { payToken, status, message, service_id, partner_transaction_id, gu_transaction_id, recipient_phone_number, amount } =
      requestStatus;
    const decrypted = decrypt(partner_transaction_id);
    const { currency, partner_id, tx_id, account } = decrypted;

    // TODO: Find transaction by id
    // TODO: Update transaction status
    throw new Error('Method not implemented.');
  }
  private async collect(tx: MomoCollectionDTO) {
    const { reference, country, amount, otp, operator, currency, partner_id, receiver_phone_number } = tx;
    const mto: SupportedOperatorEnum = operator;
    const hash = encrypt({
      tx_id: reference,
      amount,
      currency,
      partner_id,
    }).content;
    try {
      const config: IntouchAccountConfig = this.prepareConfig(country);
      const payload: IntouchCollectRequestBody = this.generateCollectionBodyPayload(
        hash,
        config,
        country,
        receiver_phone_number,
        amount,
        mto,
        otp,
      );
      const data = await this.makeRequest({
        type: 'collect',
        body: payload,
        uri: `${config.merchantID}/transaction`,
        method: 'PUT',
        loginAgent: config.loginAgent,
        passwordAgent: config.passwordAgent,
        username: config.username,
        password: config.password,
      });
      return data as IntouchAPIResponseInterface;
    } catch (e) {
      throw new Error(e);
    }
  }
  private async transfer(tx: MomoTransferDTO) {
    const { reference, country, amount, currency, partner_id, operator, receiver_phone_number } = tx;

    const mto: SupportedOperatorEnum = operator;

    const hash = encrypt({
      tx_id: reference,
      amount,
      currency,
      partner_id,
    }).content;

    const config: IntouchAccountConfig = this.prepareConfig(country);
    const payload: IntouchDisburseRequestBody = this.generateDisbursementBodyPayload(
      hash,
      config,
      country,
      amount,
      receiver_phone_number,
      mto,
    );

    try {
      const data: IntouchAPIResponseInterface = (await this.makeRequest({
        type: 'disburse',
        method: 'POST',
        baseUrl: `https://api.gutouch.com/v1/${config.merchantID}`,
        uri: '/cashin',
        loginAgent: config.loginAgent,
        passwordAgent: config.passwordAgent,
        username: config.username,
        password: config.password,
        body: payload,
      })) as IntouchAPIResponseInterface;
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  private async makeRequest({
    type,
    body,
    method,
    uri,
    params,
    baseUrl = 'https://api.gutouch.com/dist/api/touchpayapi/v1/',
    loginAgent,
    passwordAgent,
    username,
    password,
  }: {
    type: 'disburse' | 'airtime' | 'collect';
    body: any;
    method: string;
    uri: string;
    baseUrl?: string;
    params?: any;
    loginAgent: string;
    passwordAgent: string;
    username: string;
    password: string;
  }) {
    if (process.env.NODE_ENV === 'development') {
      return Promise.resolve({
        status: 'Success',
        service_id: 'service-id',
        gu_transaction_id: '',
        recipient_phone_number: body.receiver_phone_number,
        amount: body.amount,
        partner_transaction_id: body.reference,
        message: 'Operation being processed.',
        payToken: null,
        baseCalculCommission: Number(body) * 0.02,
        transaction_date: Date.now(),
        merchant_code: 'merchant-code',
      });
    }
    try {
      let data: IntouchAPIResponseInterface;

      switch (type) {
        case 'collect':
          data = await rp({
            method,
            auth: {
              user: username,
              pass: password,
              sendImmediately: false,
            },
            uri: `${baseUrl}${uri}`,
            body,
            qs: {
              loginAgent,
              passwordAgent,
              ...params,
            },
            json: true,
          });
          return data;
        case 'disburse':
          data = await rp({
            method,
            auth: {
              user: username,
              pass: password,
              sendImmediately: false,
            },
            uri: `${baseUrl}${uri}`,
            body,
            json: true,
          });
          return data;
        default:
          break;
      }
    } catch (e) {
      throw new Error(e);
    }
  }
  private prepareConfig(country: any): IntouchAccountConfig {
    let config: IntouchAccountConfig;
    if (country === 'BF') {
      return {
        callbackUrl: this.configService.get<string>('BF_CALL_BACK_URL'),
        loginAgent: this.configService.get<string>('BF_INTOUCH_LOGIN_AGENT'),
        passwordAgent: this.configService.get<string>('BF_INTOUCH_PASSWORD_AGENT'),
        username: this.configService.get<string>('BF_INTOUCH_AUTH_USERNAME'),
        merchantID: this.configService.get<string>('BF_INTOUCH_AUTH_PASSWORD'),
        password: this.configService.get<string>('BF_INTOUCH_MERCHANT_ID'),
        partnerID: this.configService.get<string>('BF_INTOUCH_PARTNER_ID'),
      };
    }
    if (country === 'CIV') {
      return {
        callbackUrl: this.configService.get<string>('CI_CALL_BACK_URL'),
        loginAgent: this.configService.get<string>('CI_INTOUCH_LOGIN_AGENT'),
        passwordAgent: this.configService.get<string>('CI_INTOUCH_PASSWORD_AGENT'),
        username: this.configService.get<string>('CI_INTOUCH_AUTH_USERNAME'),
        merchantID: this.configService.get<string>('CI_INTOUCH_AUTH_PASSWORD'),
        password: this.configService.get<string>('CI_INTOUCH_MERCHANT_ID'),
        partnerID: this.configService.get<string>('CI_INTOUCH_PARTNER_ID'),
      };
    }
    return config;
  }

  private generateCollectionBodyPayload(
    id: string,
    config: IntouchAccountConfig,
    country: any,
    mobile_number: string,
    amount: number,
    operator: SupportedOperatorEnum,
    otp: string,
  ): IntouchCollectRequestBody {
    console.log(operator.toUpperCase());
    if (country === 'BF') {
      return {
        idFromClient: id,
        amount,
        recipientNumber: mobile_number,
        serviceCode: INTOUCH_SERVICE[operator.toUpperCase()].CASHIN,
        callback: config.callbackUrl,
        additionnalInfos: {
          destinataire: mobile_number,
          recipientFirstName: '',
          recipientLastName: '',
          otp,
        },
      };
    }
    if (country === 'CIV') {
      return {
        idFromClient: id,
        amount,
        recipientNumber: mobile_number,
        serviceCode: INTOUCH_SERVICE_CI[operator.toUpperCase()].CASHIN,
        callback: config.callbackUrl,
        additionnalInfos: {
          destinataire: mobile_number,
          recipientFirstName: '',
          recipientLastName: '',
          otp,
        },
      };
    }
  }

  private generateDisbursementBodyPayload(
    id: string,
    config: IntouchAccountConfig,
    country: any,
    amount: number,
    mobile_number: string,
    operator: SupportedOperatorEnum,
  ): IntouchDisburseRequestBody {
    if (country === 'BF') {
      return {
        partner_transaction_id: id,
        amount,
        call_back_url: config.callbackUrl,
        login_api: config.loginAgent,
        password_api: config.passwordAgent,
        partner_id: config.partnerID,
        service_id: INTOUCH_SERVICE[operator.toUpperCase()].CASHOUT,
        recipient_phone_number: mobile_number,
      };
    }
    if (country === 'CIV') {
      return {
        partner_transaction_id: id,
        amount,
        call_back_url: config.callbackUrl,
        login_api: config.loginAgent,
        password_api: config.passwordAgent,
        partner_id: config.partnerID,
        service_id: INTOUCH_SERVICE[operator.toUpperCase()].CASHOUT,
        recipient_phone_number: mobile_number,
      };
    }
  }
}
