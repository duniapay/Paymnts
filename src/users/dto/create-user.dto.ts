import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class RegisterDTO {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'email',
    example: 'email@gmail.com',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'firstname',
    example: 'Toudarim',
  })
  firstname: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'lastname',
    example: 'Ouedraogo',
  })
  lastname: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\+[1-9]\d{1,11}$/)
  @ApiProperty({
    description: 'Business phonenumber. \nHas to match a regular expression: /^\\+[1-9]\\d{1,11}$/',
    example: '+22678822709',
  })
  mobile: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'business name',
    example: 'MarsBet',
  })
  business_name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'country name',
    example: 'Burkina Faso',
  })
  country: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'currency',
    example: 'XOF',
  })
  currency: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'password',
    example: 'Yennenga123@&',
  })
  @MinLength(8)
  password: string;
}

export class LoginDTO {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'email',
    example: 'email@gmail.com',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'password',
    example: 'Yennenga123@&',
  })
  password: string;
}
