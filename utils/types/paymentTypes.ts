import { Focused } from "react-credit-cards-2";

export interface successRes {
  id: number;
  txRef: string;
  orderRef: string;
  flwRef: string;
  redirectUrl: string;
  device_fingerprint: string;
  settlement_token: any;
  cycle: string;
  amount: number;
  charged_amount: number;
  appfee: number;
  merchantfee: number;
  merchantbearsfee: number;
  chargeResponseCode: string;
  raveRef: string;
  chargeResponseMessage: string;
  authModelUsed: string;
  currency: string;
  IP: string;
  narration: string;
  status: string;
  modalauditid: string;
  vbvrespmessage: string;
  authurl: string;
  vbvrespcode: string;
  acctvalrespmsg: any;
  acctvalrespcode: string;
  paymentType: string;
  paymentPlan: any;
  paymentPage: any;
  paymentId: string;
  fraud_status: string;
  charge_type: string;
  is_live: number;
  retry_attempt: any;
  getpaidBatchId: any;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  customerId: number;
  AccountId: number;
  customer: ICustomer;
  chargeToken: IChargeToken;
  airtime_flag: boolean;
}

export interface ICustomer {
  id: number;
  phone: any;
  fullName: string;
  customertoken: any;
  email: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  AccountId: number;
}

export interface IChargeToken {
  user_token: string;
  embed_token: string;
}

export interface cardType {
  number: string;
  expiry: string;
  cvc: string;
  name: string;
  focus: Focused;
}

export interface CardApiRes {
  data: {
    mode: "redirect" | "pin" | "avs_noauth" | "otp";
    redirect: string;
    fields: string[];
    hash: string;
    status: string;
    id: number;
  };
}

export interface BankTransferApiRes {
  data: {
    mode: "banktransfer";
    transfer_account: string;
    transfer_bank: string;
    transfer_note: string;
    transfer_amount: string;
    account_expiration: number;
    hash: string;
  };
}

export interface CommonApiRes {
  data: {
    hash: string;
    redirect: string;
    qr_image: string;
    qr_code: string;
    address: string;
  };
}

export interface USSDApiRes {
  data: {
    note: string;
    hash: string;
    payment_code: string;
  };
}

export interface CommonDetails {
  hash: string;
  redirect: string;
  qr_image: string;
}

export interface transferDetails {
  transfer_account: string;
  transfer_bank: string;
  transfer_note: string;
  transfer_amount: string;
  account_expiration: number;
  hash: string;
}

export interface currencyData {
  currency: string;
  amount: string | number;
  transferRate?: string;
  total_amount?: string | number;
  total_amount_source?: string | number;  // Total amount in source currency (USD) including fees
  total_amount_usd?: string | number;     // Total amount in USD
  base_amount?: string | number;          // Original amount without fees
  base_amount_usd?: string | number;      // Original amount in USD
  fee_payer?: string;
  processing_fee?: number;                // Processing fee for the currency
  fees?: {
    fixed_fee_usd?: number;
    transaction_fee_usd?: number;
    buffer_fee_usd?: number;
    network_fee_usd?: number;
    total_fees_usd?: number;
  };
}

export interface walletState {
  currency: string;
  amount: number;
}

export interface commonPayload {
  walletState: walletState;
}
