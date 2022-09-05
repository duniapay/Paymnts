import {
  SupportedOperatorEnum,
  FiatAccountType,
  FiatAccountSchema,
} from '@fiatconnect/fiatconnect-types';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { BaseDTO } from '../../domain/dto/basedto.interface';

export class CreateAccountDto extends BaseDTO {
  @IsOptional()
  operator?: SupportedOperatorEnum;
  @IsNotEmpty()
  institutionName: string;
  @IsNotEmpty()
  accountName: string;
  @IsNotEmpty()
  mobile?: string;
  @IsNotEmpty()
  country: string;
  @IsOptional()
  accountNumber?: string;
  @IsNotEmpty()
  ownerId: string;
  @IsNotEmpty()
  fiatAccountType: FiatAccountType;
  @IsNotEmpty()
  fiatAccountSchema: FiatAccountSchema;
}
