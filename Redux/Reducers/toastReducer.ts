import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AlertColor } from "@mui/material";

interface ToastState {
  open: boolean;
  message: string;
  severity: AlertColor | "";
  loading: boolean;
}

const initialState: ToastState = {
  open: false,
  message: "",
  severity: "",
  loading: false,
};

interface ShowToastPayload {
  message: string;
  severity: AlertColor;
  loading?: boolean;
}

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<ShowToastPayload>) => {
      state.open = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity;
      state.loading = action.payload.loading ?? false;
    },
    hideToast: (state) => {
      state.open = false;
      state.message = "";
      state.severity = "";
      state.loading = false;
    },
  },
});

// Export actions for modern usage
export const { showToast, hideToast } = toastSlice.actions;

// Legacy action types for backward compatibility
export const TOAST_SHOW = "toast/showToast";
export const TOAST_HIDE = "toast/hideToast";

export default toastSlice.reducer;
