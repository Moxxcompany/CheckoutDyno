import { AlertColor } from "@mui/material";

export interface ReducerAction {
  payload: any;
  type: string;
  crudType: string;
}

export interface rootReducer {
  toastReducer: toastReducer;
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
