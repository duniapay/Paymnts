import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Banks, BankTransferResponse, BankTxModel } from './dto/bank-transfer.dto';
import * as rp from 'request-promise';

@Injectable()
export class BankService {
  private readonly baseUrl: string;
  private readonly authUsername: string;
  private readonly authPassword: string;
  constructor(private readonly configService: ConfigService) {
    this.authUsername = this.configService.get<string>('GTBANK_USERNAME');
    this.authPassword = this.configService.get<string>('GTBANK_PASSWORD');
    this.baseUrl = this.configService.get<string>('GTBANK_URL');
  }

  public async disburse(id: string, account: any, amount: number): Promise<BankTransferResponse> {
    const tx = new BankTxModel();
    tx.amount = amount;
    tx.id = Number(id);
    tx.partner_reference = id;
    tx.partner_id = id;
    tx.receiver_phone_number = account.mobile;
    tx.receiver_bank_name = account.institutionName;
    tx.receiver_bank_account = account.accountNumber;
    tx.receiver_bank_code = account.bank_code;
    tx.receiver_address = account.address;

    const body = {
      ...tx,
    };
    const data = await this.makeRequest({
      body,
      uri: '/bank/transfer',
      method: 'POST',
    });

    return data;
  }
  private makeRequest({
    body,
    method,
    uri,
    params,
    baseUrl = this.baseUrl,
  }: {
    body?: any;
    method: string;
    uri: string;
    baseUrl?: string;
    params?: any;
  }) {
    if (process.env.APP_ENV === 'development') {
      return Promise.resolve({});
    }

    return rp({
      method,
      auth: {
        user: this.authUsername,
        pass: this.authPassword,
        sendImmediately: true,
      },
      uri: `${baseUrl}${uri}`,
      body,
      qs: {
        ...params,
      },
      json: true,
    });
  }
  private async balance(): Promise<number> {
    const data: number = await this.makeRequest({
      uri: '/account/balance',
      method: 'GET',
    });

    return data;
  }
  private async getBanks(): Promise<Banks[]> {
    const data = await this.makeRequest({
      uri: '/bank/list',
      method: 'GET',
    });
    return data;
  }
}
