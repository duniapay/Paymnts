import { SupportedOperatorEnum } from '@fiatconnect/fiatconnect-types';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { INTOUCH_SERVICE, INTOUCH_SERVICE_CI } from '../../domain/utils/constants';
import { encrypt } from '../../domain/utils/hash.utils';
import {
  IntouchAccountConfig,
  IntouchDisburseRequestBody,
  IntouchAPIResponseInterface,
  IntouchCollectRequestBody,
  MomoCollectionDTO,
  MomoTransferDTO,
} from '../dto/create-mobile-money.dto';
import * as rp from 'request-promise';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class IntouchService {
  private readonly logger = new Logger(IntouchService.name);

  constructor(private readonly configService: ConfigService) {}

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
        gu_transaction_id: uuidv4(),
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
  public async collect(tx: MomoCollectionDTO) {
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
  public async transfer(tx: MomoTransferDTO) {
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
}
