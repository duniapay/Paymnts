import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateWebhookDto {
  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({
    description: 'Partner webhook url',
    example: 'https://somewhereontheinternet.com/webhook',
  })
  url: string;
}
