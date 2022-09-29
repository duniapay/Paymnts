import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddressDto {
  @IsNotEmpty()
  @IsString()
  address1: string;
  @IsOptional()
  @IsString()
  address2?: string;
  @IsNotEmpty()
  @IsString()
  isoCountryCode: string;
  @IsNotEmpty()
  @IsString()
  city: string;
  @IsNotEmpty()
  @IsString()
  postalCode?: string;
}
