import { PartialType } from '@nestjs/mapped-types';
import { MomoTransferDTO } from './create-mobile-money.dto';

export class UpdateMobileMoneyDto extends PartialType(MomoTransferDTO) {}
