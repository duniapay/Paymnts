import { Injectable } from '@nestjs/common';
import { WalletTransferResponse } from './dto/wallet-transfer-response.dto';

@Injectable()
export class WalletService {
  collect(id: string, account: any, amount: number): Promise<WalletTransferResponse> {
    throw new Error('Method not implemented.');
  }
  disburse(id: string, account: any, amount: number): Promise<WalletTransferResponse> {
    throw new Error('Method not implemented.');
  }
}
