import { SupportedOperatorEnum } from '@fiatconnect/fiatconnect-types';

export enum IntouchProvider {
  ORANGE = 'ORANGE',
  MOOV = 'MOOV',
  TELECEL = 'TELECEL',
  MTN = 'MTN',
}

export const PARTNER_ID = 'BF1163';

export const PARTNER_ID_CI = 'CI324114';

export const INTOUCH_SERVICE = {
  [SupportedOperatorEnum.ORANGE]: {
    CASHIN: 'BF_PAIEMENTMARCHAND_OM',
    CASHOUT: 'BF_CASHIN_OM',
    AIRTIME: 'BF_AIRTIME_ORANGE',
  },
  [SupportedOperatorEnum.MOOV]: {
    CASHIN: 'BF_PAIEMENTMARCHAND_MOBICASH',
    CASHOUT: 'BF_CASHIN_MOBICASH',
    AIRTIME: 'BF_AIRTIME_TELMOB',
  },
};

export const INTOUCH_SERVICE_CI = {
  [SupportedOperatorEnum.ORANGE]: {
    CASHIN: 'PAIEMENTMARCHANDOMPAYCI',
    CASHOUT: 'CASHINOMCIPART',
    AIRTIME: 'AIRTIMEORANGECI',
  },
  [SupportedOperatorEnum.MTN]: {
    CASHIN: 'PAIEMENTMARCHAND_MTN_CI',
    CASHOUT: 'CASHINMTNPART',
    AIRTIME: 'AIRTIMEMTN',
  },
  [SupportedOperatorEnum.MOOV]: {
    CASHIN: 'PAIEMENTMARCHAND_MOOV_CI',
    CASHOUT: 'CASHINMOOVPART',
    AIRTIME: 'AIRTIMEMOOV',
  },
};
