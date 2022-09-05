import { TransferStatus, TransferType } from '@fiatconnect/fiatconnect-types';
import { BaseModel } from '../../domain/model/base.model';

export class TransferModel extends BaseModel {
  accountId: string;
  amount: number;
  status?: TransferStatus;
  failure_reason?: string;
  transferType?: TransferType;
}
