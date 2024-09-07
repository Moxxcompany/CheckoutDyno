import { AlertColor } from "@mui/material";

export interface ReducerAction {
  payload: any;
  type: string;
  crudType: string;
}

export interface rootReducer {
  userReducer: userReducer;
  toastReducer: toastReducer;
  companyReducer: companyReducer;
  walletReducer: walletReducer;
  apiReducer: apiReducer;
}

export interface userReducer {
  email: string;
  name: string;
  loading: boolean;
  mobile: string;
  user_id: number;
  photo: string;
  telegram_id: string;
}

export interface companyReducer {
  companyList: ICompany[];
  loading: boolean;
}

export interface apiReducer {
  apiList: IApi[];
  loading: boolean;
}

export interface walletReducer {
  walletList: IWallet[];
  loading: boolean;
  amount: number;
  currency: string;
  paymentData: {
    mode: "avs_noauth" | "pin" | "otp" | "";
    fields: string[];
    uniqueRef: string;
  };
}

export interface ICompany {
  company_id: number;
  user_id: number;
  company_name: string;
  mobile: string;
  photo: string;
  email: string;
  website: string;
}

export interface IApi {
  api_id: number;
  company_id: number;
  company_name: string;
  user_id: number;
  base_currency: string;
  apiKey: string;
}

export interface IWallet {
  id: string;
  user_id: number;
  amount: number;
  wallet_type: string;
  wallet_address: string;
  wallet_account_id: string;
  createdAt: string;
  updatedAt: string;
  currency_type: string;
}

export interface menuItem {
  value: any;
  label: any;
  disable?: boolean;
}

export interface toastReducer {
  open: boolean;
  severity: AlertColor;
  message: string;
  hide?: boolean;
  loading?: boolean;
}

export interface LayoutProps {
  children: JSX.Element | JSX.Element[];
  pageName: string;
  component?: any;
}

export interface TokenData {
  user_id: number;
  name: string;
  email: string;
  photo: string;
  mobile: string;
  telegram_id: string;
}

export interface IconProps {
  fill?: string;
  size?: number;
}

export interface pageProps {
  setPageName: Function;
  setComponent: Function;
}

export interface IToastProps {
  open?: boolean;
  severity?: AlertColor;
  message?: string;
  hide?: boolean;
  loading?: boolean;
}

// success types
