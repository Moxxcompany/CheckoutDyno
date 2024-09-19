import { Box, Button, Divider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import { useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { rootReducer } from "@/utils/types";
import {
  createEncryption,
  generateRedirectUrl,
  getCurrencySymbol,
  getTime,
} from "@/helpers";
import LoadingIcon from "@/assets/Icons/LoadingIcon";
import axiosBaseApi from "@/axiosConfig";
import { useRouter } from "next/router";
import { TOAST_SHOW } from "@/Redux/Actions/ToastAction";
import {
  BankTransferApiRes,
  commonPayload,
  currencyData,
  transferDetails,
  walletState,
} from "@/utils/types/paymentTypes";
import { paymentTypes } from "@/utils/enums";

const WalletComponent = ({ walletState }: commonPayload) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState<currencyData>();
  const [balance, setBalance] = useState<currencyData>();
  const [transferDetails, setTransferDetails] = useState<transferDetails>();

  useEffect(() => {
    if (walletState.amount && walletState.currency) {
      getBalance();
    }
  }, [walletState.amount]);

  const getBalance = async () => {
    try {
      const {
        data: { data },
      } = await axiosBaseApi.get("pay/getBalance");
      setBalance(data);
      if (walletState.currency === data.currency) {
        setSelectedCurrency({
          currency: walletState.currency,
          amount: walletState.amount.toString(),
          transferRate: "1",
        });

        setLoading(false);
      } else {
        getCurrencyRate(data.currency);
      }
    } catch (e: any) {
      const message = e.response.data.message ?? e.message;
      dispatch({
        type: TOAST_SHOW,
        payload: {
          message: message,
          severity: "error",
        },
      });
    }
  };

  const getCurrencyRate = async (currency: string) => {
    try {
      const {
        data: { data },
      } = await axiosBaseApi.post("pay/getCurrencyRates", {
        source: walletState.currency,
        amount: walletState.amount,
        currencyList: [currency],
      });

      setSelectedCurrency(data[0]);
      setLoading(false);
    } catch (e: any) {
      const message = e.response.data.message ?? e.message;
      dispatch({
        type: TOAST_SHOW,
        payload: {
          message: message,
          severity: "error",
        },
      });
    }
  };

  const handleSubmit = async () => {
    const finalPayload = {
      paymentType: paymentTypes.WALLET,
      currency: selectedCurrency?.currency,
      amount: selectedCurrency?.amount,
    };
    const res = createEncryption(JSON.stringify(finalPayload));

    const {
      data: { data },
    }: { data: BankTransferApiRes } = await axiosBaseApi.post(
      "pay/addPayment",
      {
        data: res,
      }
    );
    const redirectUri = generateRedirectUrl(data);
    window.location.replace(redirectUri);
  };

  return (
    <Box
      sx={{
        maxWidth: "500px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 5,
      }}
    >
      <Typography fontSize={22} fontWeight={500} textAlign={"center"}>
        Use your Wallet Balance to proceed with the payment.
      </Typography>
      {loading ? (
        <Box
          sx={{
            height: "375px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LoadingIcon size={75} />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              p: 3,
              mt: 2,

              gap: 2,
              "& .topText": {
                color: "text.disabled",
                fontSize: 12,
                textTransform: "uppercase",
              },
              "& .mainText": {
                fontWeight: 600,
                fontSize: 22,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                flexDirection: "column",
              }}
            >
              {selectedCurrency?.currency !== walletState.currency && (
                <Box>
                  <Typography className="topText" textAlign={"center"}>
                    Transfer Rate
                  </Typography>
                  <Typography fontSize={14} fontWeight={600}>
                    ({" "}
                    {walletState.currency +
                      " " +
                      getCurrencySymbol(walletState.currency, 1)}
                    {" = "}
                    {selectedCurrency &&
                      " " +
                        getCurrencySymbol(
                          selectedCurrency.currency,
                          selectedCurrency.transferRate
                        )}
                    )
                  </Typography>
                </Box>
              )}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  minWidth: "550px",
                }}
              >
                <Typography
                  sx={{
                    color: "text.disabled",
                    fontSize: 16,
                  }}
                >
                  Amount
                </Typography>
                <Typography className="mainText">
                  {selectedCurrency?.currency + " " + selectedCurrency?.amount}
                  {selectedCurrency?.currency !== walletState.currency && (
                    <Typography
                      component={"span"}
                      ml={1}
                      fontSize={14}
                      color="text.disabled"
                    >
                      (
                      {walletState.currency +
                        " " +
                        getCurrencySymbol(
                          walletState.currency,
                          walletState.amount
                        )}
                      )
                    </Typography>
                  )}
                </Typography>
              </Box>
              <Divider flexItem />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  minWidth: "550px",
                }}
              >
                <Typography
                  sx={{
                    color: "text.disabled",
                    fontSize: 16,
                  }}
                >
                  Balance
                </Typography>
                <Typography className="mainText">
                  {balance?.currency + " " + balance?.amount}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Button
            variant="rounded"
            sx={{ mt: 3 }}
            disabled={
              Number(balance?.amount) < Number(selectedCurrency?.amount)
            }
            onClick={handleSubmit}
          >
            Proceed with payment
          </Button>
        </>
      )}
    </Box>
  );
};

export default WalletComponent;
