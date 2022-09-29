import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { BankService } from './bank.service';
import { BankTransferDTO } from './dto/create-bank.dto';
import { UpdateBankTransferDto } from './dto/update-bank.dto';

@Controller('bank')
@ApiTags('Bank')
@UseGuards(JwtAuthGuard)
export class BankController {
  constructor(
    private readonly bankService: BankService,) {

    }

  @Post('transfer')
  @ApiBody({
    required: true,
    description: 'Send funds to a Bank account',
    type: BankTransferDTO,
  })
  @ApiResponse({ status: 403, description: 'Unsufficient Balance.' })
  @ApiResponse({
    status: 404,
    description: 'Transaction Failed',
  })
  disburse(@Body() bankTransferDTO: BankTransferDTO) {
    return this.bankService.create(bankTransferDTO);
  }

  @Get('/list')
  @ApiResponse({
    status: 200,
    description: 'Payments found',
    type: Array<BankTransferDTO>,
  })

  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll() {
    return this.bankService.findAll();
  }

  @Get('transfer/:id')
  @ApiResponse({
    status: 200,
    description: 'A Payment has been successfully fetched',
    type: BankTransferDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 404,
    description: 'A payment with given id does not exist.',
  })
  findOne(@Param('id') id: string) {
    return this.bankService.findOne(id);
  }

  @Patch('transfer/:id')
  @ApiBody({
    required: true,
    description: 'Updates a bank transfer',
    type: BankTransferDTO,
  })
  @ApiResponse({
    status: 200,
    description: 'A Payment has been successfully fetched',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 404,
    description: 'A payment with given id does not exist.',
  })
  update(@Param('id') id: string, @Body() updateBankDto: UpdateBankTransferDto) {
    return this.bankService.update(id, updateBankDto);
  }
}
