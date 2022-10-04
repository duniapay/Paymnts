import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as rp from 'request-promise';
import { encrypt } from '../../domain/utils/hash.utils';
import { Banks, BankTransferDTO, BankTransferResponse, BankTxModel } from '../dto/create-bank.dto';

@Injectable()
export class GTBankService {
  private readonly logger = new Logger(GTBankService.name);
  private readonly baseUrl: string;
  private readonly authUsername: string;
  private readonly authPassword: string;
  constructor(private readonly configService: ConfigService) {
    this.authUsername = this.configService.get<string>('GTBANK_USERNAME');
    this.authPassword = this.configService.get<string>('GTBANK_PASSWORD');
    this.baseUrl = this.configService.get<string>('GTBANK_URL');
  }
  public async balance(): Promise<number> {
    const data: number = await this.makeRequest({
      uri: '/account/balance',
      method: 'GET',
    });

    return data;
  }
  public async getBanks(): Promise<Banks[]> {
    const data = await this.makeRequest({
      uri: '/bank/list',
      method: 'GET',
    });
    return data;
  }
  public async disburse(payload: BankTransferDTO): Promise<BankTransferResponse> {
    const {
      country,
      amount,
      currency,
      receiver_phone_number,
      partner_id,
      reference,
      receiver_bank_account,
      receiver_bank_name,
      receiver_bank_code,
      city,
    } = payload;
    const tx = new BankTxModel();
    const hash = encrypt({
      tx_id: reference,
      amount,
      currency,
      partner_id,
    }).content;
    tx.amount = amount;
    // TODO FIX: account
    tx.id = hash;
    tx.partner_reference = reference;
    tx.partner_id = 'HARDCODED_ID_BANK';
    tx.receiver_phone_number = receiver_phone_number;
    tx.receiver_bank_name = receiver_bank_name;
    tx.receiver_bank_account = receiver_bank_account;
    tx.receiver_bank_code = receiver_bank_code;
    tx.receiver_address = country.concat(city);
    let response;
    if (this.configService.get<string>('NODE_ENV') === 'development') Promise.resolve({});
    else {
      const body = {
        ...tx,
      };
      // TODO FIX: Generate Hash
      response = await this.makeRequest({
        body,
        uri: '/bank/transfer',
        method: 'POST',
      });
    }
    return response;
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
    if (process.env.NODE_ENV === 'development') {
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
}
