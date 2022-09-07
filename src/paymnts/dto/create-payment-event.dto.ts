import { TransferStatus, TransferType } from '@fiatconnect/fiatconnect-types';

export class CreateTransactionEventDto {
  public readonly id?: string;
  public readonly account: any;
  public readonly accountId: string;
  public readonly amount: number;
  public readonly userId: string;

  public readonly metadata: any;
  public readonly currency: string;

  public status?: TransferStatus;
  public failure_reason?: string;

  public readonly transferType: TransferType;

  constructor(
    id?: string,
    account?: any,
    userId?: string,
    amount?: number,
    currency?: string,
    status?: TransferStatus,
    metadata?: any,
    transferType?: TransferType,
    failure_reason?: string,
  ) {
    this.account = account;
    this.amount = amount;
    this.userId = userId;
    this.id = id;
    this.status = status;
    this.metadata = metadata;
    this.transferType = transferType;
    this.currency = currency;
    this.failure_reason = failure_reason;
  }
}
