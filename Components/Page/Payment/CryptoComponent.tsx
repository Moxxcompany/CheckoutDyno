import {
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
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
  CommonApiRes,
  CommonDetails,
  currencyData,
} from "@/utils/types/paymentTypes";

import FormManager from "../Common/FormManager";
import * as yup from "yup";
import TextBox from "@/Components/UI/TextBox";
import Dropdown from "@/Components/UI/Dropdown";
import { paymentTypes } from "@/utils/enums";
import { CopyAllRounded, NorthEastRounded } from "@mui/icons-material";

const initialValue = {
  network: "MTN",
  mobile: "",
};

const currencyList = [
  "BTC",
  "ETH",
  "BNB",
  "ADA",
  "SOL",
  "XRP",
  "DOGE",
  "USDT",
  "LTC",
];

interface CryptoDetails {
  qr_code: string;
  address: string;
  hash: string;
}

const CyrptoComponent = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const walletState = useSelector((state: rootReducer) => state.walletReducer);
  const [loading, setLoading] = useState(true);

  const [currencyRates, setCurrencyRates] = useState<currencyData[]>();
  const [selectedCurrency, setSelectedCurrency] = useState<currencyData>();
  const [checkVerify, setCheckVerify] = useState(false);
  const [cryptoDetails, setCryptoDetails] = useState<CryptoDetails>({
    qr_code:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAATdSURBVO3BQY4cSRIEQdNA/f/Lun30UwCJ9GqSOyaCP1K15KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYtOqhadVC06qVr0yUtAfpOaCcikZgLyTWpugDyhZgLym9S8cVK16KRq0UnVok+WqdkE5JvUTEAmNTdAnlDzhppNQDadVC06qVp0UrXoky8D8oSaJ9RMQJ4AMql5Q80EZAJyo+YJIE+o+aaTqkUnVYtOqhZ98o8DcqNmAjKpuQFyo2YCMqn5LzmpWnRSteikatEn/zg1T6h5Q80E5AbIpOb/2UnVopOqRSdViz75MjV/EpBJzQ2QSc0E5A0gk5o31PxNTqoWnVQtOqla9MkyIL8JyKTmCSCTmgnIpGYCMqmZgExqJiCTmhsgf7OTqkUnVYtOqhbhj/zDgExqboBMap4A8k1q/mUnVYtOqhadVC365CUgk5oJyI2aCcgTaiYgk5ongExqnlAzAXkDyKTmBsikZgJyo+aNk6pFJ1WLTqoW4Y8sAnKjZgIyqXkCyBNqboA8oeYGyBtqJiA3aiYgk5pvOqladFK16KRqEf7IC0AmNTdAJjU3QCY1N0AmNROQSc0EZFJzA+RGzQ2QSc0bQJ5Qs+mkatFJ1aKTqkX4I38QkBs1E5BNar4JyKTmBsgTap4AMqnZdFK16KRq0UnVIvyRF4A8oeYJIJOa3wTkCTU3QG7UvAHkRs03nVQtOqladFK16JNlam6ATGomIJOaCciNmgnIpGYCMqnZBGRS8wSQSc0mIJOaN06qFp1ULTqpWoQ/8gKQGzVPALlRMwF5Q80EZFKzCciNmgnIpGYCsknNGydVi06qFp1ULfrkJTUTkBsgN2reUDMBuQEyqZmA3Ki5ATKpeULNBOQJNb/ppGrRSdWik6pF+CN/MSCTmjeATGpugDyhZgIyqZmA3Ki5ATKpmYBMar7ppGrRSdWik6pFnywDMqmZgDyhZgLyhJobIJOaGzU3QN5QMwGZ1ExqJiBPAJnUvHFSteikatFJ1aJPXgIyqZmATGomIJOaCcgTaiYgTwC5ATKpeUPNBOQJIJOaCciNmk0nVYtOqhadVC3CH/mDgExq3gAyqXkCyCY1N0AmNROQb1Kz6aRq0UnVopOqRZ8sAzKpmYBMam6ATGpu1ExAJjVvqJmA3ACZ1NwAeUPNE0AmNW+cVC06qVp0UrXok2VqbtQ8oeYGyCY1b6h5Q80TQCYgk5rfdFK16KRq0UnVok9eAvKb1Dyh5gbIpGYCMqn5TUAmNZvUbDqpWnRSteikatEny9RsAvIGkBs1E5AbIL9JzRNq/qSTqkUnVYtOqhZ98mVAnlDzhJoJyKRmAjIBmdTcALkBcqPmBsgmIDdqNp1ULTqpWnRSteiTfxyQSc0E5EbNBGRSc6NmAnIDZFIzAZnUTEDeUDMBmdS8cVK16KRq0UnVok/+Y9RMQG6ATGomIJOaCcgTap5QMwH5k06qFp1ULTqpWvTJl6n5JjUTkE1qbtTcqJmATEAmNW+ouQEyqdl0UrXopGrRSdWiT5YB+U1AbtRMQG7U3AC5UTMB+U1AJjW/6aRq0UnVopOqRfgjVUtOqhadVC06qVp0UrXopGrRSdWik6pFJ1WLTqoWnVQtOqladFK16KRq0UnVopOqRf8DrEVOIaD9/IUAAAAASUVORK5CYII=",
    hash: "any",
    address: "1AgYvJWb3h6eAaJdsHaZrEewAXzr5z3fYu",
  });
  const [loading2, setLoading2] = useState(false);

  useEffect(() => {
    if (walletState.amount && walletState.currency) {
      getCurrencyRate();
    }
  }, [walletState.amount]);

  const getCurrencyRate = async () => {
    try {
      const {
        data: { data },
      } = await axiosBaseApi.post("pay/getCurrencyRates", {
        source: walletState.currency,
        amount: walletState.amount,
        currencyList,
        fixedDecimal: false,
      });
      setCurrencyRates(data);
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

  const handleSubmit = async (values: any) => {
    try {
      const finalPayload = {
        currency: selectedCurrency?.currency,
        amount: selectedCurrency?.amount,
        paymentType: paymentTypes.CRYPTO,
      };
      const res = createEncryption(JSON.stringify(finalPayload));
      setCheckVerify(true);
      setLoading2(true);
      const {
        data: { data },
      }: { data: CommonApiRes } = await axiosBaseApi.post("pay/addPayment", {
        data: res,
      });
      if (data.redirect) {
        window.location.replace(data.redirect);
      } else {
        setCryptoDetails(data);
        setLoading2(false);
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

  const handleVerify = async () => {
    try {
      const {
        data: { data },
      } = await axiosBaseApi.post("pay/verifyPayment", {
        uniqueRef: cryptoDetails?.hash,
      });
      const redirectUri = generateRedirectUrl(data);
      window.location.replace(redirectUri);
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

  return (
    <Box
      sx={{
        maxWidth: "450px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {loading ? (
        <>
          <Typography>Please wait</Typography>
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
        </>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              p: 3,
              mt: 2,
              minWidth: 500,
              width: "100%",
              // background: theme.palette.secondary.main + "11",
              // border: "1px solid #a2a2a2",
              borderRadius: "5px",
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
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography className="topText">Amount</Typography>
                <Typography className="mainText">
                  {selectedCurrency &&
                  selectedCurrency.currency !== walletState.currency ? (
                    <>
                      {selectedCurrency.currency +
                        " " +
                        getCurrencySymbol(
                          selectedCurrency.currency,
                          selectedCurrency.amount
                        )}
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
                    </>
                  ) : (
                    <>
                      {walletState.currency +
                        " " +
                        getCurrencySymbol(
                          walletState.currency,
                          walletState.amount
                        )}
                    </>
                  )}
                </Typography>
              </Box>
              <Box>
                <Typography className="topText" textAlign={"right"}>
                  Transfer Rate
                </Typography>
                <Typography fontSize={14} fontWeight={600}>
                  ({" "}
                  {walletState.currency +
                    " " +
                    getCurrencySymbol(walletState.currency, 1)}
                  {" = "}
                  {selectedCurrency &&
                    selectedCurrency.currency +
                      " " +
                      getCurrencySymbol(
                        selectedCurrency.currency,
                        selectedCurrency.transferRate
                      )}
                  )
                </Typography>
              </Box>
            </Box>

            <Collapse in={!checkVerify}>
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  width: "100%",
                  "& form": {
                    width: "100%",
                  },
                }}
              >
                <>
                  <Dropdown
                    menuItems={currencyList.map((x) => {
                      return { label: x, value: x };
                    })}
                    fullWidth
                    label="currency"
                    getValue={(value: any) => {
                      if (currencyRates) {
                        const currentIndex = currencyRates?.findIndex(
                          (x) => x.currency === value
                        );
                        setSelectedCurrency(currencyRates[currentIndex]);
                      }
                    }}
                    defaultValue={selectedCurrency?.currency}
                  />

                  <Box sx={{ mt: 3, textAlign: "right" }}>
                    <Button
                      variant="rounded"
                      type="submit"
                      disabled={checkVerify}
                      onClick={handleSubmit}
                    >
                      Pay
                    </Button>
                  </Box>
                </>
              </Box>
            </Collapse>

            <Collapse in={checkVerify}>
              {loading2 ? (
                <>
                  <Typography textAlign={"center"}>Please wait</Typography>
                  <Box
                    sx={{
                      height: "275px",
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LoadingIcon size={75} />
                  </Box>
                </>
              ) : (
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        "& img": {
                          maxHeight: "350px",
                          minHeight: "250px",
                          width: "auto",
                        },
                      }}
                    >
                      <img src={cryptoDetails?.qr_code} />
                    </Box>
                    <Box sx={{ width: "100%" }}>
                      <TextBox
                        value={cryptoDetails.address}
                        fullWidth
                        label={"address"}
                        InputProps={{
                          endAdornment: (
                            <IconButton
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  cryptoDetails.address
                                );
                                alert("copied");
                              }}
                            >
                              <CopyAllRounded />
                            </IconButton>
                          ),
                        }}
                      />
                    </Box>
                    <Typography textAlign={"center"}>
                      Scan the QR Code above on your Crypto app or Copy the
                      above address to complete the payment
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <Button
                      variant="rounded"
                      sx={{ mt: 3 }}
                      onClick={handleVerify}
                    >
                      I have completed this payment
                    </Button>
                  </Box>
                </Box>
              )}
            </Collapse>
          </Box>
        </>
      )}
    </Box>
  );
};

export default CyrptoComponent;
