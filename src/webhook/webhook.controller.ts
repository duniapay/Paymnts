import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { ApiTags, ApiBearerAuth, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/strategy/jwt-auth.guard';

@Controller('webhook')
@ApiTags('Webhook')
@ApiBearerAuth('jwt') // This is the one that needs to match the name in main.ts
@UseGuards(JwtAuthGuard)
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  @ApiBody({
    required: true,
    description: 'Add webhook url',
    type: CreateWebhookDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiResponse({ status: 403, description: 'Failed' })
  @ApiResponse({
    status: 404,
    description: 'Operation Failed',
  })
  create(@Body() createWebhookDto: CreateWebhookDto) {
    return this.webhookService.create(createWebhookDto);
  }

  @Get()
  @ApiResponse({ status: 403, description: 'Operation Failed' })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  findAll() {
    return this.webhookService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiResponse({ status: 403, description: 'Operation Failed' })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  findOne(@Param('id') id: string) {
    return this.webhookService.findOne(+id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiBody({
    required: true,
    description: 'Update webhook url',
    type: UpdateWebhookDto,
  })
  @ApiResponse({ status: 403, description: 'Operation Failed' })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  update(@Param('id') id: string, @Body() updateWebhookDto: UpdateWebhookDto) {
    return this.webhookService.update(+id, updateWebhookDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiResponse({ status: 403, description: 'Operation Failed' })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  remove(@Param('id') id: string) {
    return this.webhookService.remove(+id);
  }
}
