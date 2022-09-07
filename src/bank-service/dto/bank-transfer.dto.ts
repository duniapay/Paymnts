import { PaymntModel } from '../../momo-service/dto/momo-transaction.dto';

export class BankTransfer extends PaymntModel {
  receiver_bank_code: string;
  receiver_bank_name: string;
  receiver_bank_account: string;
  receiver_first_name: string;
  receiver_last_name: string;
  receiver_address: string;
  receiver_phone_number: string;

  sending_reason: string;
}

export class BankName {
  Code: string;
  Name: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BankAccount {}

export interface BankTransaction {
  amount: number;
  currency: string;
  receiver_first_name: string;
  receiver_last_name: string;
  receiver_address: string;
  receiver_bank_account: string;
  receiver_phone_number: string;
  receiver_bank_name: string;
  receiver_bank_code: string;
  sending_reason: string;
}

export interface BankName {
  Code: string;
  Name: string;
}

export interface BankTransaction {
  transaction_id: string;
  receiver: string;
  amount: number;
  treatment_status: string;
  transaction_date: Date;
}

export interface Statement {
  merchant: string;
  current_balance: number;
  transactions: {
    bank_transfer: BankTransaction[];
    mobile_money: BankTransaction[];
  };
}

export interface BankTransferStatus {
  gtb_reference: string;
  merchant_reference: string;
  sender_name: string;
  sender_address: string;
  sender_phone_number: string;
  sender_country: string;
  sending_amount: number;
  sending_currency: string;
  sending_reason: string;
  receiver_name: string;
  receiver_phone_number: string;
  receiver_bank_account: string;
  receiver_bank_name: string;
}

export interface BankTransferResponse {
  gtb_reference: string;
  merchant_reference: string;
  sender_name: string;
  sender_address: string;
  sender_phone_number: string;
  sender_country: string;
  sending_amount: number;
  sending_currency: string;
  sending_reason: string;
  receiver_name: string;
  receiver_phone_number: string;
  receiver_bank_account: string;
  receiver_bank_name: string;
  receiver_bank_code: string;
  transaction_status: string;
  transaction_date: string;
  remarks: string;
}

export class BankTxModel {
  id: number;
  partner_reference: string;
  partner_id: string;
  amount: number;
  created_at?: Date;
  updated_at?: Date;
  receiver_phone_number: string;
  receiver_bank_name: string;
  receiver_bank_account: string;
  receiver_bank_code: Date;
  receiver_address: string;
  status?: string;
  reason?: string;
}

export interface Banks {
  Code: string;
  Name: string;
}
