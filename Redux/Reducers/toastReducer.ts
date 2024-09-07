import { TOAST_HIDE, TOAST_SHOW } from "../Actions/ToastAction";

const ToastInitialState = {
  open: false,
  message: "",
  severity: "",
  loading: false,
};

const toastReducer = (state = ToastInitialState, action: any) => {
  const { payload } = action;

  switch (action.type) {
    case TOAST_SHOW:
      return {
        open: true,
        message: payload.message,
        severity: payload.severity,
        loading: payload.loading ?? false,
      };

    case TOAST_HIDE:
      return { ...ToastInitialState };

    default:
      return state;
  }
};

export default toastReducer;
