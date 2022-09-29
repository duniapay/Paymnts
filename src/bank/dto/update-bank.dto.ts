import { PartialType } from '@nestjs/mapped-types';
import { BankTransferDTO } from './create-bank.dto';

export class UpdateBankTransferDto extends PartialType(BankTransferDTO) {}
