import axiosBaseApi from "@/axiosConfig";

import paymentAuth from "@/Components/Page/Common/HOC/paymentAuth";
import BankAccountComponent from "@/Components/Page/Payment/BankAccountComponent";
import BankTransferComponent from "@/Components/Page/Payment/BankTransferComponent";

import CardComponent from "@/Components/Page/Payment/CardComponent";
import GooglePayComponent from "@/Components/Page/Payment/GooglePayComponent";
import MobileMoneyComponent from "@/Components/Page/Payment/MobileMoneyComponent";
import QRCodeComponent from "@/Components/Page/Payment/QRCodeComponent";
import USSDComponent from "@/Components/Page/Payment/USSDComponent";
import { createEncryption } from "@/helpers";
import useTokenData from "@/hooks/useTokenData";
import { paymentTypes } from "@/utils/enums";
import { rootReducer } from "@/utils/types";
import {
  CommonApiRes,
  CommonDetails,
  transferDetails,
} from "@/utils/types/paymentTypes";

import {
  AccountBalanceRounded,
  CreditCardRounded,
  CurrencyBitcoinRounded,
  WalletRounded,
} from "@mui/icons-material";
import { Box, Divider, Grid, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import { useDispatch, useSelector } from "react-redux";
import CyrptoComponent from "../../Components/Page/Payment/CryptoComponent";
import BrandLogo from "@/Components/BrandLogo";
import { walletState } from "../../utils/types/paymentTypes";
import Loading from "@/Components/UI/Loading";
import { useRouter } from "next/router";
import { TOAST_SHOW } from "@/Redux/Actions/ToastAction";
import jwt from "jsonwebtoken";
import WalletComponent from "@/Components/Page/Payment/WalletComponent";

const paymentMethods = [
  {
    label: "Bank Transfer (NGN)",
    value: paymentTypes.BANK_TRANSFER,
    icon: <AccountBalanceRounded />,
  },
  {
    label: "Crypto",
    value: paymentTypes.CRYPTO,
    icon: <CurrencyBitcoinRounded />,
  },
];

const Payment = () => {
  const theme = useTheme();

  const router = useRouter();
  const dispatch = useDispatch();
  const [paymentType, setPaymentType] = useState(paymentTypes.CARD);
  const [payLoading, setPayloading] = useState(false);
  const [paymentMode, setPaymentMode] = useState("payment");
  const [allowedModes, setAllowedModes] = useState<any[]>([]);
  const [accountDetails, setAccountDetails] = useState<CommonDetails>();

  const [tokenData, setTokenData] = useState({ email: "" });
  const [walletState, setWalletState] = useState<walletState>({
    amount: 0,
    currency: "USD",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (
      paymentType === paymentTypes.GOOGLE_PAY ||
      paymentType === paymentTypes.APPLE_PAY
    ) {
      initiateGoogleApplyPayTransfer();
    }
  }, [paymentType]);

  useEffect(() => {
    if (router.query && router.query?.d) {
      getQueryData();
    } else {
      setLoading(false);
    }
  }, [router.query]);

  const getQueryData = async () => {
    try {
      const query_data = router.query.d;
      const {
        data: { data },
      }: { data: any } = await axiosBaseApi.post("pay/getData", {
        data: query_data,
      });
      setWalletState({
   amount: data.amount,
        currency: data.base_currency,
      });
      setPaymentMode(data.payment_mode);
      if (data?.payment_mode === "createLink") {
        setAllowedModes(data?.allowedModes?.split(","));
      }

      localStorage.setItem("token", data.token);
      const tempToken: any = jwt.decode(data.token);
      setTokenData(tempToken);
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      const message = e?.response?.data?.message ?? e.message;
      dispatch({
        type: TOAST_SHOW,
        payload: {
          message: message,
          severity: "error",
        },
      });
    }
  };

  const initiateGoogleApplyPayTransfer = async () => {
    const finalPayload = {
      paymentType,
      currency: walletState.currency,
      amount: walletState.amount,
    };
    setPayloading(true);
    const res = createEncryption(JSON.stringify(finalPayload));

    const {
      data: { data },
    }: { data: CommonApiRes } = await axiosBaseApi.post("pay/addPayment", {
      data: res,
    });
    setPayloading(false);
    setAccountDetails(data);
  };

  return (
    <Box sx={{ height: "100vh" }}>
      {/* {loading ? (
        <>
          <Loading />
        </>
      ) : ( */}
        <>
          {walletState.amount != 0 ? (
            <Grid container sx={{ height: "100vh" }} alignItems={"center"}>
              <Grid
                item
                md={3}
                sx={{
                  background: theme.palette.primary.main,
                  height: "inherit",
                }}
              >
                {/* <Box sx={{ textAlign: "center" }}>
            <BrandLogo />
          </Box> */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    boxShadow: "0 0 5px #121212",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                      color: "#fff",
                      gap: 2,
                      maxHeight: "500px",
                      overflow: "scroll",
                      "& .paymentBox": {
                        display: "flex",
                        gap: 1,
                        p: 3,
                        px: 5,
                        width: "100%",
                        cursor: "pointer",
                        "&.activeBox": {
                          background: "#fff",
                          color: "text.primary",
                        },
                      },
                    }}
                  >
                    {paymentMode === "createLink" && allowedModes.length > 0 ? (
                      <>
                        {paymentMethods.map((x, i) => (
                          <>
                            {allowedModes.indexOf(x.value) === -1 ? (
                              <></>
                            ) : (
                              <Box
                                className={`paymentBox ${
                                  paymentType === x.value && "activeBox"
                                }`}
                                key={x.value}
                                onClick={() => setPaymentType(x.value)}
                              >
                                {x.icon}
                                <Typography>{x.label}</Typography>
                              </Box>
                            )}
                          </>
                        ))}
                      </>
                    ) : (
                      paymentMethods.map((x, i) => (
                        <>
                          {x.value === paymentTypes.WALLET &&
                          paymentMode === "addFund" ? (
                            <></>
                          ) : (
                            <Box
                              className={`paymentBox ${
                                paymentType === x.value && "activeBox"
                              }`}
                              key={x.value}
                              onClick={() => setPaymentType(x.value)}
                            >
                              {x.icon}
                              <Typography>{x.label}</Typography>
                            </Box>
                          )}
                        </>
                      ))
                    )}
                  </Box>
                </Box>
              </Grid>
              <Grid
                item
                md={8}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    maxWidth: "750px",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <BrandLogo redirect={false} />
                      <Typography>Standard Payment</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 500, fontSize: 24 }}>
                        {walletState.currency === "NGN" ? "₦" : "$"}
                        {walletState.amount}
                      </Typography>
                      <Typography sx={{ fontSize: 16 }}>
                        {tokenData?.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider flexItem sx={{ my: 2 }} />
                  {paymentType === paymentTypes.WALLET &&
                    paymentMode === "createPayment" && (
                      <WalletComponent walletState={walletState} />
                    )}
                  {paymentType === paymentTypes.CARD && (
                    <CardComponent walletState={walletState} />
                  )}
                  {paymentType === paymentTypes.BANK_TRANSFER && (
                    <BankTransferComponent walletState={walletState} />
                  )}
                  {paymentType === paymentTypes.BANK_ACCOUNT && (
                    <BankAccountComponent walletState={walletState} />
                  )}
                  {(paymentType === paymentTypes.GOOGLE_PAY ||
                    paymentType === paymentTypes.APPLE_PAY) && (
                    <GooglePayComponent
                      accountDetails={accountDetails}
                      walletState={walletState}
                      payLoading={payLoading}
                    />
                  )}
                  {paymentType === paymentTypes.USSD && (
                    <USSDComponent walletState={walletState} />
                  )}
                  {paymentType === paymentTypes.MOBILE_MONEY && (
                    <MobileMoneyComponent walletState={walletState} />
                  )}
                  {paymentType === paymentTypes.QR_CODE && (
                    <QRCodeComponent walletState={walletState} />
                  )}
                  {paymentType === paymentTypes.CRYPTO && (
                    <CyrptoComponent walletState={walletState} />
                  )}
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Box>Please check your link or the payment link is expired!</Box>
          )}
        </>
      {/* )} */}
    </Box>
  );
};

export default paymentAuth(Payment);
// export default Payment;
