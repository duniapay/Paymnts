import { KycSchema, KycStatus } from '@fiatconnect/fiatconnect-types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsNotEmpty, IsEmail, IsString, Matches, IsUrl } from 'class-validator';
import { AddressDto } from './address.dto';

export class CreateIdentityDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'KycSchema',
    example: 'PersonalDataAndDocuments',
  })
  kycSchemaName?: KycSchema;
  @IsOptional()
  status?: KycStatus;
  @IsNotEmpty()
  @ApiProperty({
    description: 'firstname',
    example: 'Toudarim',
  })
  firstName: string;
  @IsOptional()
  middleName?: string;
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'Email',
    example: 'email@gmail.com',
  })
  email: string;
  @IsNotEmpty()
  @ApiProperty({
    description: 'lastname',
    example: 'Ouedraogo',
  })
  lastName: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'partner_id',
    example: 'partner_id_from_register',
  })
  partner_id: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Date Of Birth',
    example: '12-15-1992',
  })
  dateOfBirth: string;

  @IsNotEmpty()
  @Type(() => AddressDto)
  @ApiProperty({
    description: 'Address',
    example: {
      isoCountryCode: 'BFA',
      city: 'San Francisco',
      address1: '123 Main St',
      address2: 'San Francisco',
      postalCode: '77879',
    },
  })
  address: AddressDto;

  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{1,11}$/)
  @ApiProperty({
    description: 'Business phonenumber. \nHas to match a regular expression: /^\\+[1-9]\\d{1,11}$/',
    example: '+22678822709',
  })
  phoneNumber: string;
  @IsNotEmpty()
  @ApiProperty({
    description: 'Selfie url',
    example: 'shorturl.at/agHO3',
  })
  @IsUrl()
  selfieDocument: string;
  @IsNotEmpty()
  @ApiProperty({
    description: 'Identification Document image url',
    example: 'shorturl.at/agHO3',
  })
  @IsUrl()
  identificationDocument: string;
}
