import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as rp from 'request-promise';

@Injectable()
export class AMLService {
  private readonly logger = new Logger(AMLService.name);
  private readonly baseUrl: string;
  private readonly authUsername: string;
  private readonly authPassword: string;
  constructor(private readonly configService: ConfigService) {
    this.authUsername = this.configService.get<string>('GTBANK_USERNAME');
    this.authPassword = this.configService.get<string>('GTBANK_PASSWORD');
    this.baseUrl = this.configService.get<string>('GTBANK_URL');
  }
  public async downloadSelfieDocument(): Promise<number> {
    const data: number = await this.makeRequest({
      uri: '/account/balance',
      method: 'GET',
    });

    return data;
  }

  public async downloadIdentityDocument(): Promise<number> {
    const data: number = await this.makeRequest({
      uri: '/account/balance',
      method: 'GET',
    });

    return data;
  }
  public async validateSelfieDocument(docu: any): Promise<number> {
    const data: number = await this.makeRequest({
      uri: '/account/balance',
      method: 'POST',
      body: docu,
    });

    return data;
  }
  public async validateIdentityDocument(docu: any): Promise<number> {
    const data: number = await this.makeRequest({
      uri: '/account/balance',
      method: 'POST',
      body: docu,
    });

    return data;
  }
  public async amlChecks(userInfo: any): Promise<number> {
    const data: number = await this.makeRequest({
      uri: '/account/balance',
      method: 'POST',
      body: userInfo,
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
