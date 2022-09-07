import { Controller } from '@nestjs/common';
import { Ctx, KafkaContext, MessagePattern, Payload } from '@nestjs/microservices';
import { PaymntsService } from './paymnts.service';

@Controller()
export class PaymntsController {
  constructor(private readonly paymntsService: PaymntsService) {}

  @MessagePattern('transaction.created')
  handleCreatedEvent(@Payload() message: any, @Ctx() context: KafkaContext) {
    return this.paymntsService.handleCreatedEvent(message, context);
  }

  @MessagePattern('transaction.completed')
  handleCompletedEvent(@Payload() message: any, @Ctx() context: KafkaContext) {
    return this.paymntsService.handleUpdatedEvent(message, context);
    return this.paymntsService.handleCreatedEvent(message, context);
  }

  @MessagePattern('transaction.updated')
  handleUpdatedEvent(@Payload() message: any, @Ctx() context: KafkaContext) {
    return this.paymntsService.handleUpdatedEvent(message, context);
  }
}
