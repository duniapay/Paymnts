import { ApiProperty } from '@nestjs/swagger';
import { IsDivisibleBy, IsNotEmpty, IsNumber, IsString, Matches, MaxLength, Min, MinLength, ValidateIf } from 'class-validator';

export class PaymntModel {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Receiver country',
    example: 'BF',
  })
  country: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Transaction reference|id from merchant',
    example: '6BA6B2CF8BB50B1D9FEDEB9E45BEFEB2BBE9E8F72F72E3E058776CEE4DE7C5D0',
  })
  reference: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Partner Merchant Id',
    example: 'id-from-login',
  })
  partner_id: string;
  @IsNumber()
  @IsNotEmpty()
  @IsDivisibleBy(5)
  @Min(1000)
  @ApiProperty({
    description: 'Transaction amount',
    example: '25000',
  })
  amount: number;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Transaction currency',
    example: 'XOF',
  })
  currency: 'XOF';

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{1,11}$/)
  @ApiProperty({
    description: 'Receiver phone number. \nHas to match a regular expression: /^\\+[1-9]\\d{1,14}$/',
    example: '+22678822709',
  })
  receiver_phone_number: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Receiver city',
    example: 'Ouagadougou',
  })
  city: string;

  @ValidateIf((o) => o.amount >= 25000)
  @IsNotEmpty()
  kycId?: string;
}

export class BankTransferDTO extends PaymntModel {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty({
    description: 'Receiver bank code',
    example: '083',
  })
  receiver_bank_code: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(24)
  @ApiProperty({
    description: 'Receiver bank name',
    example: 'ECOBANK BURKINA',
  })
  receiver_bank_name: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(24)
  @MaxLength(24)
  @ApiProperty({
    description: 'Receiver bank account number',
    example: 'BF08 3000 0117 0667 9020 0151',
  })
  receiver_bank_account: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  @ApiProperty({
    description: 'Receiver firstname',
    example: 'Toudarim',
  })
  receiver_first_name: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Receiver lastname',
    example: 'Ouedraogo',
  })
  @MinLength(6)
  @MaxLength(20)
  receiver_last_name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(45)
  @ApiProperty({
    description: 'Sending reason',
    example: 'School fees',
  })
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
  id: string;
  partner_reference: string;
  partner_id: string;
  amount: number;
  created_at?: Date;
  updated_at?: Date;
  receiver_phone_number: string;
  receiver_bank_name: string;
  receiver_bank_account: string;
  receiver_bank_code: string;
  receiver_address: string;
  status?: string;
  reason?: string;
}

export interface Banks {
  Code: string;
  Name: string;
}
