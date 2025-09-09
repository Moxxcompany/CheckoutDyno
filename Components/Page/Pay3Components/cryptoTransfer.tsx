import React, { useEffect, useState } from "react";
import { ArrowBack } from "@mui/icons-material";
import {
  Box,
  FormControl,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Typography,
  Divider,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Tooltip,
  Button,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CopyIcon from "@/assets/Icons/CopyIcon";
import ClockIcon from "@/assets/Icons/ClockIcon";
import axiosBaseApi from "@/axiosConfig";
import { currencyData, walletState } from "@/utils/types/paymentTypes";
import { TOAST_SHOW } from "@/Redux/Actions/ToastAction";
import { useDispatch } from "react-redux";
import { paymentTypes } from "@/utils/enums";
import { createEncryption } from "@/helpers";
import { Icon } from "@iconify/react/dist/iconify.js";
import BitCoinGreenIcon from "@/assets/Icons/BitCoinGreenIcon";
import DoneIcon from "@mui/icons-material/Done";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import USDT from "@/assets/Icons/coins/USDT";
import BTC from "@/assets/Icons/coins/BTC";
import ETH from "@/assets/Icons/coins/ETH";
import BNB from "@/assets/Icons/coins/BNB";
import Image from "next/image";

import LTCicon from "../../../assets/Icons/coins/LTC.png";
import BCHicon from "../../../assets/Icons/coins/BCH.png";
import DOGEicon from "../../../assets/Icons/coins/DOGE.png";
import TRXicon from "../../../assets/Icons/coins/TRX.png";

interface CryptoTransferProps {
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  walletState: walletState;
}

const cryptoOptions = [
  {
    value: "USDT",
    label: "USDT (TRC-20, ERC-20)",
    icon: <USDT width={25} height={25} />,
  },
  {
    value: "BTC",
    label: "Bitcoin (BTC)",
    icon: <BTC width={25} height={25} />,
    currency: "BTC",
  },
  {
    value: "ETH",
    label: "Ethereum (ETH)",
    icon: <ETH width={25} height={25} />,
    currency: "ETH",
  },
  {
    value: "LTC",
    label: "Litecoin (LTC)",
    icon: <Image src={LTCicon} alt="USD" width={25} height={25} />,
    currency: "LTC",
  },
  {
    value: "DOGE",
    label: "Dogecoin (DOGE)",
    icon: <Image src={DOGEicon} alt="USD" width={25} height={25} />,
    currency: "DOGE",
  },
  {
    value: "BCH",
    label: "Bitcoin Cash (BCH)",
    icon: <Image src={BCHicon} alt="USD" width={25} height={25} />,
    currency: "BCH",
  },
  {
    value: "TRX",
    label: "Tron (TRX)",
    icon: <Image src={TRXicon} alt="USD" width={25} height={25} />,
    currency: "TRX",
  },
];

interface CryptoDetails {
  qr_code: string;
  address: string;
  hash: string;
}

const CryptoTransfer = ({
  activeStep,
  setActiveStep,
  walletState,
}: CryptoTransferProps) => {
  const dispatch = useDispatch();
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState<
    "" | "TRC20" | "ERC20"
  >("");

  const [copied, setCopied] = useState(false);
  const [currencyRates, setCurrencyRates] = useState<currencyData[]>();
  const [selectedCurrency, setSelectedCurrency] = useState<currencyData>();
  const [cryptoDetails, setCryptoDetails] = useState<CryptoDetails>({
    qr_code: "",
    hash: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const [isRecived, setIsReceived] = useState(false);
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 21);

  const [isUrl, setIsUrl] = useState<string | null>("");

  const [isNetwork, setIsNetwork] = useState("");

  const [isStart, setIsStart] = useState(false);

  const getSelectedOption = () =>
    cryptoOptions.find((opt) => opt.value === selectedCrypto);

  const getApiCurrency = () => {
    if (selectedCrypto === "USDT") return `USDT-${selectedNetwork}`;
    return (
      cryptoOptions.find((opt) => opt.value === selectedCrypto)?.currency || ""
    );
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(cryptoDetails?.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCurrencyRateAndSubmit = async (
    cryptoValue: string,
    network: "TRC20" | "ERC20" = "TRC20"
  ) => {
    try {
      setLoading(true);

      // This is what you display or send to backend
      const displayCurrency =
        cryptoValue === "USDT" ? `USDT-${network}` : cryptoValue;

      // This is the actual currency key used in rateData
      const baseCurrency =
        cryptoValue === "USDT"
          ? "USDT"
          : cryptoOptions.find((x) => x.value === cryptoValue)?.currency || "";

      console.log("displayCurrency:", displayCurrency);
      console.log("baseCurrency (lookup key):", baseCurrency);

      const rateResponse = await axiosBaseApi.post("/pay/getCurrencyRates", {
        source: walletState?.currency,
        amount: walletState?.amount,
        currencyList: cryptoOptions.map((x) => x.value),
        fixedDecimal: false,
      });

      const rateData = rateResponse?.data?.data;

      const findRate = rateData?.find(
        (item: any) => item.currency === baseCurrency
      );

      setCurrencyRates(rateData);
      setSelectedCurrency(findRate);
      setSelectedCrypto(cryptoValue);

      const finalPayload = {
        currency: displayCurrency, // e.g., "USDT-TRC20"
        amount: findRate?.amount, // from normalized key lookup
        paymentType: paymentTypes.CRYPTO,
      };

      console.log("finalPayload", finalPayload);

      const encrypted = createEncryption(JSON.stringify(finalPayload));
      const submitResponse = await axiosBaseApi.post("/pay/addPayment", {
        data: encrypted,
      });

      setTimeout(() => {
        setIsStart(true);
      }, 10000);

      const result = submitResponse?.data?.data;

      if (result?.redirect) {
        window.location.replace(result.redirect);
      } else {
        setCryptoDetails(result);
      }
    } catch (e: any) {
      const message = e?.response?.data?.message ?? e.message;
      dispatch({ type: TOAST_SHOW, payload: { message, severity: "error" } });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: any) => {
    const value = event.target.value;
    setIsNetwork(value);
    if (value === "USDT") {
      // setSelectedNetwork('TRC20')
      setSelectedCrypto("USDT");
      setIsStart(false);
      checkNetwork(value);
    } else {
      setSelectedNetwork("");
      setIsStart(false);
      getCurrencyRateAndSubmit(value, value === "USDT" ? "TRC20" : undefined);
    }
  };

  const checkNetwork = (value: any) => {
    if (selectedNetwork) {
      setIsStart(false);
      getCurrencyRateAndSubmit(value, value === "USDT" ? "TRC20" : undefined);
    }
  };

  const handleNetworkChange = (network: "TRC20" | "ERC20") => {
    setSelectedNetwork(network);
    setIsStart(false);
    getCurrencyRateAndSubmit("USDT", network);
  };

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, selectedCrypto]);

  const formatTime = (seconds: number) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  function formatAmount(amount: any, currency: string): string {
    const lowerCurrency = currency?.toLowerCase();

    const cryptoCurrencies = new Set(["btc", "eth", "usdc", "bnb", "matic"]);
    const fiatCurrencies = new Set(["usd", "eur", "inr", "usdt"]);

    if (cryptoCurrencies.has(lowerCurrency)) {
      return amount?.toFixed(6);
    }

    if (fiatCurrencies.has(lowerCurrency)) {
      return amount?.toFixed(2);
    }

    return amount?.toString();
  }

  useEffect(() => {
    // if (!selectedCrypto) return

    const isValidSelection =
      selectedCrypto &&
      (selectedCrypto !== "USDT" ||
        ["TRC20", "ERC20"].includes(selectedNetwork));

    if (!isValidSelection) return;

    setIsReceived(false);

    const pollInterval = setInterval(async () => {
      try {
        const {
          data: { data },
        } = await axiosBaseApi.post("/pay/verifyCryptoPayment", {
          address: cryptoDetails?.address,
        });

        if (data) {
          setIsReceived(true);
          clearInterval(pollInterval);
          setIsUrl(data);
          // window.location.replace(data)
        }
      } catch (e: any) {
        const message = e?.response?.data?.message ?? e?.message;
        // dispatch({
        //   type: TOAST_SHOW,
        //   payload: {
        //     message,
        //     severity: 'error'
        //   }
        // })
      }
    }, 15000);

    return () => clearInterval(pollInterval);
  }, [selectedCrypto, cryptoDetails?.address]);

  // const handleVerify = async () => {
  //   try {
  //     const {
  //       data: { data }
  //     } = await axiosBaseApi.post('/pay/verifyCryptoPayment', {
  //       address: cryptoDetails?.address
  //     })
  //     window.location.replace(data)
  //     console.log('data', data)
  //   } catch (e: any) {
  //     const message = e?.response?.data?.message ?? e?.message
  //     dispatch({
  //       type: TOAST_SHOW,
  //       payload: {
  //         message: message,
  //         severity: 'error'
  //       }
  //     })
  //   }
  // }

  const btnGotoWeb = () => {
    if (isUrl) {
      window.location.replace(isUrl);
      // window.open(isUrl, '_blank', 'noopener,noreferrer')
    } else {
      console.log("No URL provided");
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={2}
      minHeight="calc(100vh - 340px)"
    >
      <Paper
        elevation={3}
        sx={{
          borderRadius: 4,
          p: "34px",
          width: "100%",
          maxWidth: 450,
          marginTop: 0,
          border: "1px solid #E7EAFD",
          boxShadow: "0px 45px 64px 0px #0D03230F",
        }}
      >
        <IconButton
          onClick={() => setActiveStep(activeStep - 1)}
          sx={{
            backgroundColor: "#F5F8FF",
            color: "#444CE7",
            borderRadius: "50%",
            padding: "10px",
            "&:hover": { backgroundColor: "#ebefff" },
          }}
        >
          <ArrowBack sx={{ color: "#444CE7" }} />
        </IconButton>

        <Typography
          variant="h6"
          fontWeight="medium"
          mt={2}
          display="flex"
          alignItems="center"
          gap={1}
          fontSize="27px"
          fontFamily="Space Grotesk"
        >
          <BitCoinGreenIcon />
          Cryptocurrency
        </Typography>

        <Box mt={3} mb={1}>
          <Typography
            variant="subtitle2"
            fontWeight={500}
            fontFamily="Space Grotesk"
            color="#000"
          >
            Preferred Crypto
          </Typography>
        </Box>

        <FormControl fullWidth>
          <Select
            labelId="crypto-select-label"
            id="crypto-select"
            value={selectedCrypto}
            displayEmpty
            onChange={handleChange}
            IconComponent={KeyboardArrowDownIcon}
            sx={{
              "& .MuiOutlinedInput-input": {
                borderRadius: "10px !important",
                borderColor: "#737373 !important",
                "& :focus-visible": {
                  outline: "none !important",
                },
                py: "16.5px  !important",
              },
              "& .MuiList-padding": {
                padding: "17px 20px !important",
              },
              "& fieldset": {
                borderRadius: "10px !important",
                borderColor: "#737373 !important",
                "& :focus-visible": {
                  outline: "none !important",
                },
              },
              "& .MuiList-root": {
                padding: "15px",
              },
              "& .MuiMenu-paper": {
                padding: "15px",
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  py: "10px",
                  px: "20px",
                  backgroundColor: "#fff",
                  border: "1px solid #737373",
                  boxShadow: 3,
                  borderRadius: "10px",
                },
              },
            }}
            renderValue={(selected) => {
              if (!selected)
                return (
                  <span
                    style={{
                      color: "#1A1919",
                      fontWeight: 500,
                      fontFamily: "Space Grotesk",
                    }}
                  >
                    Select Crypto Type
                  </span>
                );
              const option = getSelectedOption();
              return (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "#1A1919",
                    fontWeight: "medium",
                    height: "24px",
                  }}
                >
                  {option?.icon}
                  {option?.label}
                </Box>
              );
            }}
          >
            {cryptoOptions?.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{
                  borderRadius: "8px",
                  "&:hover": { backgroundColor: "#F5F8FF" },
                  "&.Mui-selected": {
                    backgroundColor: "#F5F8FF",
                    "&:hover": { backgroundColor: "#F5F8FF" },
                  },
                  padding: "10px",
                }}
              >
                <ListItemIcon style={{ height: "26px", width: "25px" }}>
                  {option.icon}
                </ListItemIcon>
                <ListItemText style={{ height: "24px", width: "24px" }}>
                  {option.label}
                </ListItemText>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {isNetwork === "USDT" && (
          <Box mt={1}>
            <Typography
              variant="subtitle2"
              fontWeight={500}
              fontFamily="Space Grotesk"
              color="#000"
            >
              Preferred Network
            </Typography>
          </Box>
        )}

        {isNetwork === "USDT" && (
          <Box mt={"10px"} mb={3} display="flex" gap={1} alignItems="center">
            {["TRC20", "ERC20"].map((net) => (
              <Typography
                key={net}
                border={`1px solid ${
                  selectedNetwork === net ? "#86A4F9" : "#E7EAFD"
                }`}
                padding="5px 10px"
                fontSize="small"
                bgcolor={selectedNetwork === net ? "#E7EAFD" : "#F5F8FF"}
                borderRadius="5px"
                sx={{ cursor: "pointer" }}
                onClick={() => handleNetworkChange(net as "TRC20" | "ERC20")}
                fontFamily="Space Grotesk"
              >
                {net}
              </Typography>
            ))}
          </Box>
        )}

        {selectedCrypto &&
          (selectedCrypto !== "USDT" ||
            ["TRC20", "ERC20"].includes(selectedNetwork)) && (
            <>
              <Typography
                variant="h6"
                fontWeight="medium"
                my={1}
                fontSize="small"
                fontFamily="Space Grotesk"
              >
                Send {selectedCrypto}{" "}
                {selectedCrypto === "USDT" ? `(${selectedNetwork})` : ""} to
                This Address
              </Typography>
              <Box
                textAlign="center"
                border="1px solid #A4BCFD"
                padding="20px"
                borderRadius="20px"
                bgcolor="#F5F8FF"
              >
                <Box
                  sx={{
                    bgcolor: "white",
                    borderRadius: "10px",
                    border: "1px solid #E7EAFD",
                    mb: 2,
                  }}
                >
                  {loading ? (
                    <Box sx={{ padding: 2 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <img
                      src={cryptoDetails?.qr_code}
                      width={"100%"}
                      height={"100%"}
                    />
                  )}
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  border="1px solid #E7EAFD"
                  padding="10px"
                  borderRadius="8px"
                  bgcolor="#FFFFFF"
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "#444CE7" }}
                    fontWeight="400"
                    fontSize="11px"
                    maxWidth="88%"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                  >
                    {cryptoDetails?.address}
                  </Typography>
                  <Tooltip title="Copy">
                    <IconButton
                      size="small"
                      sx={{
                        bgcolor: "#E7EAFD",
                        p: 0.5,
                        height: "24px",
                        width: "24px",
                        borderRadius: "5px",
                        "&:hover": { bgcolor: "#E0E7FF" },
                      }}
                      onClick={handleCopyAddress}
                    >
                      <CopyIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <InfoOutlinedIcon fontSize="small" />
                  <Typography
                    variant="h6"
                    fontWeight="400"
                    mt={1}
                    color="#1A1919"
                    fontSize="small"
                    textAlign="left"
                    lineHeight="18px"
                    fontFamily="Space Grotesk"
                  >
                    Send only {selectedCrypto} in{" "}
                    {selectedCrypto === "USDT"
                      ? `(${selectedNetwork}) network`
                      : ""}{" "}
                    to this address, or your funds will be lost.
                  </Typography>
                </Box>
              </Box>

              {!isRecived && (
                <Box
                  mt={3}
                  border="1px solid #DFDFDF"
                  padding="18px 21px"
                  borderRadius="10px"
                  bgcolor="#FFFFFF"
                  height={"129px"}
                  sx={{ opacity: isStart ? 0.5 : 1 }}
                >
                  <Box display="flex" gap={2} justifyContent="space-between">
                    <Typography
                      variant="h6"
                      fontWeight={500}
                      fontSize="20px"
                      fontFamily="Space Grotesk"
                      whiteSpace="nowrap"
                      color="#1A1919"
                    >
                      To Pay:
                    </Typography>
                    <Box display="flex" alignItems="start" gap={1}>
                      <Box textAlign="end">
                        <Typography
                          variant="body1"
                          fontSize="25px"
                          fontWeight={500}
                          display="flex"
                          alignItems="center"
                          gap={1}
                          fontFamily="Space Grotesk"
                          // lineHeight='130%'
                          whiteSpace="nowrap"
                          color="#1A1919"
                        >
                          {formatAmount(
                            selectedCurrency?.amount || 0,
                            selectedCurrency?.currency || ""
                          )}{" "}
                          {selectedCurrency?.currency}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="#515151"
                          fontFamily="Space Grotesk"
                          whiteSpace="nowrap"
                          fontSize="14px"
                          fontWeight={500}
                        >
                          ={Number(walletState?.amount)?.toFixed(2)}{" "}
                          {walletState?.currency}
                        </Typography>
                      </Box>
                      <Tooltip title="Copy">
                        <IconButton
                          size="small"
                          sx={{
                            bgcolor: "#E7EAFD",
                            p: 0.5,
                            height: "24px",
                            width: "24px",
                            borderRadius: "5px",
                            "&:hover": { bgcolor: "#E0E7FF" },
                            mt: 1,
                          }}
                          onClick={handleCopyAddress}
                        >
                          <CopyIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Divider sx={{ my: "10px" }} />
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={1}
                  >
                    <ClockIcon />
                    <Typography
                      variant="body2"
                      fontWeight="normal"
                      fontSize="13px"
                      fontFamily="Space Grotesk"
                      color="#000"
                    >
                      invoice expires in: {formatTime(timeLeft)}
                    </Typography>
                  </Box>
                </Box>
              )}

              {isStart && (
                <Box
                  sx={{ mt: 2 }}
                  border={1}
                  borderColor={"#B5D3C6"}
                  borderRadius={"12px"}
                >
                  <Paper
                    // elevation={1}
                    sx={{
                      bgcolor: "#EBFFF6",
                      borderRadius: "12px",
                      p: 3,
                      textAlign: "center",
                      mx: "auto",
                    }}
                  >
                    <Typography
                      variant="h5"
                      fontWeight={600}
                      sx={{ color: isRecived ? "#13B76A" : "#7CAB96" }}
                      fontFamily="Space Grotesk"
                    >
                      {formatAmount(
                        selectedCurrency?.amount || 0,
                        selectedCurrency?.currency || ""
                      )}{" "}
                      {selectedCurrency?.currency}
                    </Typography>

                    {isRecived ? (
                      <>
                        <DoneIcon
                          sx={{
                            fontSize: 35,
                            color: "#13B76A",
                            my: "16px",
                          }}
                        />

                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          fontFamily="Space Grotesk"
                        >
                          Payment Confirmed!
                        </Typography>
                      </>
                    ) : (
                      <>
                        <CircularProgress
                          size={30}
                          sx={{ color: "#13B76A", my: "16px" }}
                        />

                        <Typography
                          variant="subtitle1"
                          fontWeight={500}
                          fontFamily="Space Grotesk"
                          fontSize={"15px"}
                        >
                          Payment detected, awaiting confirmation...
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#444" }}
                          fontSize={"12px"}
                          fontWeight={400}
                          fontFamily="Space Grotesk"
                        >
                          We detected your payment in the blockchain. <br />
                          Waiting for 1 confirmation...
                        </Typography>
                      </>
                    )}
                  </Paper>
                </Box>
              )}

              {isRecived && (
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{
                    borderColor: "#4F46E5",
                    color: "#4F46E5",
                    textTransform: "none",
                    marginTop: "15px",
                    borderRadius: 30,
                    paddingTop: 2,
                    paddingBottom: 2,
                    // paddingX: 3,
                    width: "100%",
                    minWidth: "auto",
                    "&:hover": {
                      backgroundColor: "#EEF2FF",
                      borderColor: "#4F46E5",
                    },
                  }}
                  endIcon={<span style={{ fontSize: "1.2rem" }}>→</span>}
                  onClick={() => btnGotoWeb()}
                >
                  Go to Website
                </Button>
              )}
            </>
          )}
      </Paper>
    </Box>
  );
};

export default CryptoTransfer;
