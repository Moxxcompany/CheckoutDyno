import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

import { useDispatch } from "react-redux";

import LoadingIcon from "@/assets/Icons/LoadingIcon";
import { CheckCircleOutlineRounded } from "@mui/icons-material";
import { IToastProps } from "@/utils/types";
import { TOAST_HIDE } from "@/Redux/Actions/ToastAction";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Toast = (props: IToastProps) => {
  const dispatch = useDispatch();
  const { open, severity, message, loading } = props;
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    dispatch({ type: TOAST_HIDE });
  };

  return (
    <Snackbar
      sx={{ zIndex: 99999 }}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={open}
      autoHideDuration={2500}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={loading ? "info" : severity}
        sx={{ width: "100%" }}
        iconMapping={{
          info: loading ? (
            <LoadingIcon size={20} fill="#fff" />
          ) : (
            <CheckCircleOutlineRounded />
          ),
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
