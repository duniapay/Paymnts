import { SupportedOperatorEnum } from '@fiatconnect/fiatconnect-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Matches, MaxLength, Min, MinLength, ValidateIf } from 'class-validator';
import { Unique } from 'typeorm/decorator/Unique';

export class TransferDTO {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Mobile Money Operator',
    example: 'ORANGE',
  })
  operator: SupportedOperatorEnum;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Country',
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
    description: 'Partner Id',
    example: 'BF0128774',
  })
  partner_id: string;

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
    description: 'Receiver phonenumber. \nHas to match a regular expression: /^\\+[1-9]\\d{1,11}$/',
    example: '+22678822709',
  })
  receiver_phone_number: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Receiver City',
    example: 'Ouagadougou',
  })
  city: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(45)
  @ApiProperty({
    description: 'Sending reason',
    example: 'School fees',
  })
  sending_reason: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(45)
  @ApiProperty({
    description: 'Recipient lastname',
    example: 'bill',
  })
  receiver_last_name: string;

  @ValidateIf((o) => o.amount >= 25000)
  @IsNotEmpty()
  kycId?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(45)
  @ApiProperty({
    description: 'Recipient firstname',
    example: 'dakio',
  })
  receiver_first_name: string;
}

export class MomoTransferDTO extends TransferDTO {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Transaction amount',
    example: '1000',
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class MomoCollectionDTO extends TransferDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'OTP From USSD',
    example: '321456',
  })
  otp: string;
  @IsNotEmpty()
  @ApiProperty({
    description: 'Transaction amount',
    example: '1000',
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
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

export class WalletTransfer extends TransferDTO {}
