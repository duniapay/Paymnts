import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionEventDto } from './create-payment-event.dto';

export class UpdateTransactionEventDto extends PartialType(CreateTransactionEventDto) {}
