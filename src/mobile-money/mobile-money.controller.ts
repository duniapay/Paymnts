import { Controller, Get, Post, Body, Put, Param, UseGuards, HttpException } from '@nestjs/common';
import { MomoService } from './mobile-money.service';
import { IntouchAPIResponseInterface, MomoCollectionDTO, MomoTransferDTO } from './dto/create-mobile-money.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MobileMoneyTransactionEntity } from './entities/mobile-money.entity';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { UsersService } from '../users/users.service';

@Controller('mobile-money')
@ApiTags('Mobile-Money')
export class MobileMoneyController {
  constructor(private readonly mobileMoneyService: MomoService, private usersService: UsersService) {}
  @Post('collect')
  @ApiBearerAuth('jwt') // This is the one that needs to match the name in main.ts
  @UseGuards(JwtAuthGuard)
  @ApiBody({
    required: true,
    description: 'Collect funds from a verified mobile money account',
    type: MomoCollectionDTO,
  })
  @ApiResponse({ status: 403, description: 'Unsufficient Balance.' })
  @ApiResponse({
    status: 404,
    description: 'Transaction Failed',
  })
  async collect(@Body() momoCollectDTO: MomoCollectionDTO) {
    const balance = (await this.usersService.findOne({ id: momoCollectDTO.partner_id })).balance;

    // Fee: 2% + 50 XOF Flat
    const estimatedFees = Number(momoCollectDTO.amount) * 0.2 + 50;
    const totalToCharge = Number(momoCollectDTO.amount) + estimatedFees;

    if (balance > totalToCharge) return this.mobileMoneyService.create(momoCollectDTO);
    throw new HttpException('Unsufficient Balance.', 403);
  }

  @Post('transfer')
  @ApiBearerAuth('jwt') // This is the one that needs to match the name in main.ts
  @UseGuards(JwtAuthGuard)
  @ApiBody({
    required: true,
    description: 'Sends funds to a verified mobile money account',
    type: MomoTransferDTO,
  })
  @ApiResponse({ status: 403, description: 'Unsufficient Balance.' })
  @ApiResponse({
    status: 404,
    description: 'Transaction Failed',
  })
  async transfer(@Body() momoTransferDTO: MomoTransferDTO) {
    const balance = (await this.usersService.findOne({ id: momoTransferDTO.partner_id })).balance;
    // Fee: 1% + 50 XOF Flat
    const estimatedFees = Number(momoTransferDTO.amount) * 0.1;
    const totalToCharge = Number(momoTransferDTO.amount) + estimatedFees;

    if (balance > totalToCharge) return this.mobileMoneyService.create(momoTransferDTO);
    throw new HttpException('Unsufficient Balance.', 403);
  }

  @Get()
  @ApiBearerAuth('jwt') // This is the one that needs to match the name in main.ts
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Collection has been successfully fetched',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 404,
    description: 'A collection with given id does not exist.',
  })
  findOne(@Param('id') id: string): Promise<MobileMoneyTransactionEntity> {
    const resp = this.mobileMoneyService.findOne(id);
    return resp;
  }

  @Put('feed')
  @ApiBody({
    required: true,
    description: 'Updates a momo transfer',
  })
  @ApiResponse({
    status: 200,
    description: 'A Payment has been successfully updated',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 404,
    description: 'A payment with given id does not exist.',
  })
  update(@Body() updateMobileMoneyDto: IntouchAPIResponseInterface): Promise<any> {
    return this.mobileMoneyService.update(updateMobileMoneyDto);
  }
}
