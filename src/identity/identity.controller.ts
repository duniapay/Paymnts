import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { CreateIdentityDto } from './dto/create-identity.dto';
import { UpdateIdentityDto } from './dto/update-identity.dto';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';
import { UsersService } from '../users/users.service';

@Controller('kyc')
@ApiTags('kyc')
// @ApiBearerAuth('jwt') // This is the one that needs to match the name in main.ts
// @UseGuards(JwtAuthGuard)
export class IdentityController {
  constructor(private readonly identityService: IdentityService, private usersService: UsersService) {}

  @Post()
  @ApiBody({
    required: true,
    description: 'Request KYC Verification for a user',
    type: CreateIdentityDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiResponse({ status: 403, description: 'Unsufficient Balance.' })
  @ApiResponse({
    status: 404,
    description: 'Operation Failed',
  })
  async create(@Body() createIdentityDto: CreateIdentityDto) {
    const balance = (await this.usersService.findOne({ id: createIdentityDto.partner_id })).balance;
    // Fee: 850 XOF Flat
    const estimatedFees = 850;
    if (balance > estimatedFees) {
      const results = Promise.all([
        await this.usersService.charge(createIdentityDto.partner_id, estimatedFees),
        await this.identityService.create(createIdentityDto),
      ]);
      return results[1];
    }
    throw new HttpException('Unsufficient Balance.', 403);
  }

  @Get()
  @ApiResponse({ status: 403, description: 'Unsufficient Balance.' })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  findAll() {
    return this.identityService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 403, description: 'Unsufficient Balance.' })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  findOne(@Param('id') id: string) {
    return this.identityService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 403, description: 'Unsufficient Balance.' })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  update(@Param('id') id: string, @Body() updateIdentityDto: UpdateIdentityDto) {
    return this.identityService.update(id, updateIdentityDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 403, description: 'Unsufficient Balance.' })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  remove(@Param('id') id: string) {
    return this.identityService.remove(id);
  }
}
