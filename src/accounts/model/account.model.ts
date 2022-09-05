import {
  FiatAccountSchema,
  FiatAccountType,
  SupportedOperatorEnum,
} from '@fiatconnect/fiatconnect-types';
import { BaseModel } from '../../domain/model/base.model';

export class AccountModel extends BaseModel {
  operator?: SupportedOperatorEnum;
  institutionName: string;
  accountName: string;
  mobile?: string;
  country: string;
  accountNumber?: string;
  owner: string;
  fiatAccountType: FiatAccountType;
  fiatAccountSchema: FiatAccountSchema;
}
