export class PaymntModel {
  country: string;

  reference: string;

  merchant_account: string;

  amount: number;

  currency: 'XOF';

  receiver_phone_number: string;
}

export class Airtime extends PaymntModel {
  provider: string;
}

export class MomoCollectionDTO extends PaymntModel {
  provider: string;

  otp: string;
}

export class MomoTransferDTO extends PaymntModel {
  provider: string;
}

export interface IntouchAccountConfig {
  callbackUrl: string;
  loginAgent: string;
  passwordAgent: string;
  username: string;
  merchantID: string;
  password: string;
  partnerID: string;
  call_back_url?: string;
  login_api?: string;
}

export interface IntouchDisburseRequestBody {
  partner_transaction_id?: string;
  call_back_url?: string;
  login_api?: string;
  amount: number;
  password_api?: string;
  partner_id?: string;
  service_id?: string;
  recipient_phone_number?: string;
}

export interface IntouchCollectRequestBody {
  idFromClient: string;
  amount: number;
  recipientNumber: any;
  serviceCode: any;
  callback: string;
  additionnalInfos: {
    destinataire: any;
    recipientFirstName?: string;
    recipientLastName?: string;
    otp?: string;
  };
}

export interface IntouchAPIResponseInterface {
  status: string;
  service_id: string;
  gu_transaction_id: string;
  recipient_phone_number: number;
  amount: number;
  partner_transaction_id: string;
  message: 'Operation being processed.' | string;
  payToken?: string;
  baseCalculCommission?: number;
  transaction_date?: Date;
  merchant_code?: string;
}

export class WalletTransfer extends PaymntModel {}
