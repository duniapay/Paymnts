import { FiatType, KycSchema, KycStatus, TransferStatus, TransferType, WebhookEventType } from '@fiatconnect/fiatconnect-types';

declare type TransferStatusResponse = {
  status: TransferStatus;
  transferType: TransferType;
  fiatType: FiatType;
  amount: number;
  fee?: number;
  txId: string;
  partner_id: string;
  meta?: any;
};

export declare type WebhookEventPayload = {
  [WebhookEventType.KycStatusEvent]: {
    kycSchema: KycSchema;
    kycStatus: KycStatus;
  };
  [WebhookEventType.TransferInStatusEvent]: TransferStatusResponse;
  [WebhookEventType.TransferOutStatusEvent]: TransferStatusResponse;
};

export declare type KYCWebhookRequestBody = {
  eventType: WebhookEventType.KycStatusEvent;
  provider: string;
  url: string;
  payload: WebhookEventPayload[WebhookEventType.KycStatusEvent];
};

export declare type TransferInWebhookRequestBody = {
  eventType: WebhookEventType.TransferInStatusEvent;
  provider: string;
  url: string;
  payload: WebhookEventPayload[WebhookEventType.TransferInStatusEvent];
};

export declare type TransferOutWebhookRequestBody = {
  eventType: WebhookEventType.TransferOutStatusEvent;
  provider: string;
  url: string;
  payload: WebhookEventPayload[WebhookEventType.TransferOutStatusEvent];
};
