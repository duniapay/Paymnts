import { KycSchema, KycStatus } from '@fiatconnect/fiatconnect-types';
import { IsOptional, IsNotEmpty } from 'class-validator';
import { BaseDTO } from '../../domain/dto/basedto.interface';

export class CreateKycDto extends BaseDTO {
  @IsOptional()
  kycRequired: boolean;
  @IsNotEmpty()
  kycSchemaName?: KycSchema;
  @IsOptional()
  status?: KycStatus;
  @IsNotEmpty()
  firstName: string;
  @IsOptional()
  middleName?: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  lastName: string;
  @IsNotEmpty()
  dateOfBirth: {
    day: string;
    month: string;
    year: string;
  };
  @IsNotEmpty()
  address: {
    address1: string;
    address2?: string;
    isoCountryCode: string;
    isoRegionCode: string;
    city: string;
    postalCode?: string;
  };
  @IsNotEmpty()
  phoneNumber: string;
  @IsNotEmpty()
  selfieDocument: string;
  @IsNotEmpty()
  identificationDocument: string;
}
