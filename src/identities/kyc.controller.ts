import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KycService } from './kyc.service';
import { CreateKycDto } from './dto/create-kyc.dto';
import { UpdateKycDto } from './dto/update-kyc.dto';

@Controller('account/:accountId')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post('kyc/')
  create(@Body() createKycDto: CreateKycDto) {
    return this.kycService.create(createKycDto);
  }

  @Get('kyc/')
  findAll() {
    return this.kycService.findAll();
  }

  @Get('kyc/:id')
  findOne(@Param('id') id: string) {
    return this.kycService.findOne(+id);
  }

  @Patch('kyc/:id')
  update(@Param('id') id: string, @Body() updateKycDto: UpdateKycDto) {
    return this.kycService.update(+id, updateKycDto);
  }

  @Delete('kyc/:id')
  remove(@Param('id') id: string) {
    return this.kycService.remove(+id);
  }
}
