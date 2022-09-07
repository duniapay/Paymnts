import { SupportedOperatorEnum } from '@fiatconnect/fiatconnect-types';
import { Injectable } from '@nestjs/common';
import * as rp from 'request-promise';
import { ConfigService } from '@nestjs/config';
import {
  IntouchAccountConfig,
  IntouchAPIResponseInterface,
  IntouchCollectRequestBody,
  IntouchDisburseRequestBody,
} from './dto/momo-transaction.dto';
import { INTOUCH_SERVICE, INTOUCH_SERVICE_CI } from './utils/constants';

@Injectable()
export class MomoService {
  constructor(private readonly configService: ConfigService) {}
  public async collect(id: string, account: any, amount: number, otp: string) {
    const mto: SupportedOperatorEnum = account.operator;
    try {
      const config: IntouchAccountConfig = this.prepareConfig(account);
      const payload: IntouchCollectRequestBody = this.generateCollectionBodyPayload(id, config, account, amount, mto, otp);
      const data: IntouchAPIResponseInterface = await this.makeRequest({
        type: 'collect',
        body: payload,
        uri: `${config.merchantID}/transaction`,
        method: 'PUT',
        loginAgent: config.loginAgent,
        passwordAgent: config.passwordAgent,
        username: config.username,
        password: config.password,
      });
      return data;
    } catch (e) {
      throw new Error(e);
    }
  }
  public async disburse(id: string, account: any, amount: number) {
    const mto: SupportedOperatorEnum = account.operator;

    const config: IntouchAccountConfig = this.prepareConfig(account);
    const payload: IntouchDisburseRequestBody = this.generateDisbursementBodyPayload(id, config, account, amount, mto);

    try {
      const data: IntouchAPIResponseInterface = await this.makeRequest({
        type: 'disburse',
        method: 'POST',
        baseUrl: `https://api.gutouch.com/v1/${config.merchantID}`,
        uri: '/cashin',
        loginAgent: config.loginAgent,
        passwordAgent: config.passwordAgent,
        username: config.username,
        password: config.password,
        body: payload,
      });
      //   console.log(data);
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
  private prepareConfig(account: any): IntouchAccountConfig {
    let config: IntouchAccountConfig;
    if (account.country === 'BF') {
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
    if (account.country === 'CIV') {
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
    account: any,
    amount: number,
    operator: SupportedOperatorEnum,
    otp: string,
  ): IntouchCollectRequestBody {
    if (account.country === 'BF') {
      return {
        idFromClient: id,
        amount,
        recipientNumber: account.mobile,
        serviceCode: INTOUCH_SERVICE[operator.toUpperCase()].CASHIN,
        callback: config.callbackUrl,
        additionnalInfos: {
          destinataire: account.mobile,
          recipientFirstName: '',
          recipientLastName: '',
          otp,
        },
      };
    }
    if (account.country === 'CIV') {
      return {
        idFromClient: id,
        amount,
        recipientNumber: account.mobile,
        serviceCode: INTOUCH_SERVICE_CI[operator.toUpperCase()].CASHIN,
        callback: config.callbackUrl,
        additionnalInfos: {
          destinataire: account.mobile,
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
    account: any,
    amount: number,
    operator: SupportedOperatorEnum,
  ): IntouchDisburseRequestBody {
    if (account.country === 'BF') {
      return {
        partner_transaction_id: id,
        amount,
        call_back_url: config.callbackUrl,
        login_api: config.loginAgent,
        password_api: config.passwordAgent,
        partner_id: config.partnerID,
        service_id: INTOUCH_SERVICE[operator.toUpperCase()].CASHOUT,
        recipient_phone_number: account.phoneNumber,
      };
    }
    if (account.country === 'CIV') {
      return {
        partner_transaction_id: id,
        amount,
        call_back_url: config.callbackUrl,
        login_api: config.loginAgent,
        password_api: config.passwordAgent,
        partner_id: config.partnerID,
        service_id: INTOUCH_SERVICE[operator.toUpperCase()].CASHOUT,
        recipient_phone_number: account.phoneNumber,
      };
    }
  }
}
