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
  currencyData,
  transferDetails,
} from "@/utils/types/paymentTypes";

import {
  AccountBalanceRounded,
  ArrowBack,
  ArrowDropDown,
  ArrowDropUp,
  ContentCopy,
  CreditCardRounded,
  CurrencyBitcoinRounded,
  ErrorOutline,
  FlagCircleOutlined,
  WalletRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Select,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
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
import Header from "./header";
import ProgressBar from "@/Components/UI/ProgressBar";
import Image from "next/image";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import AssuredWorkloadIcon from "@mui/icons-material/AssuredWorkload";
import Footer from "@/Components/UI/Footer";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FloatingChatButton from "@/Components/UI/ChatButton";

import FileCopyIcon from "@mui/icons-material/FileCopy";
import BankTransferCompo from "./bankTransferCompo";
import CryptoTransfer from "./cryptoTransfer";
import TransferExpectedCard from "@/Components/UI/TransferExpectedCard/Index";
import CopyIcon from "@/assets/Icons/CopyIcon";
import UnderPayment from "@/Components/UI/UnderPayment/Index";
import OverPayment from "@/Components/UI/OverPayment/Index";

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

const currencyOptions = [
  {
    code: "USD",
    label: "United States Dollar (USD)",
    icon: <FlagCircleOutlined sx={{ fontSize: 18 }} />,
    currency: 'USD'
  },
  {
    code: "EUR",
    label: "Euro (EUR)",
    icon: <FlagCircleOutlined sx={{ fontSize: 18 }} />,
    currency: 'EUR'
  },
  {
    code: "NGN",
    label: "Nigerian Naira (NGN)",
    icon: <FlagCircleOutlined sx={{ fontSize: 18 }} />,
    currency: 'NGN'
  },
];

const Payment = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const dispatch = useDispatch();
  const [paymentType, setPaymentType] = useState(paymentTypes.CARD);
  const [payLoading, setPayloading] = useState(false);
  const [paymentMode, setPaymentMode] = useState("payment");
  const [allowedModes, setAllowedModes] = useState<any[]>([]);
  const [accountDetails, setAccountDetails] = useState<CommonDetails>();
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [currencyRates, setCurrencyRates] = useState<currencyData>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [tokenData, setTokenData] = useState({ email: "" });
  const [walletState, setWalletState] = useState<walletState>({
    amount: 0,
    currency: "USD",
  });
  const [transferMethod, setTransferMethod] = useState("");
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

  const getCurrencyRate = async (selectedCurrency: string) => {
    try {
      const {
        data: { data },
      } = await axiosBaseApi.post("/pay/getCurrencyRates", {
        source: walletState?.currency,
        amount: walletState?.amount,
        currencyList: [selectedCurrency],
        fixedDecimal: false,
      });
      setCurrencyRates(data[0])
      setSelectedCurrency(selectedCurrency);
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

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (anchorEl) {
      setAnchorEl(null); // Close if already open
    } else {
      setAnchorEl(event.currentTarget); // Open
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (event: React.MouseEvent, code: string) => {
    getCurrencyRate(code)
    handleClose();
  };


  const isOpen = Boolean(anchorEl);

  return (
    <Box>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Box
        sx={{
          height: "calc(100vh - 86px)",
          overflowY: "auto",
        }}
      >
        <ProgressBar activeStep={activeStep} />

        {activeStep === 0 ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            bgcolor="#F8FAFC"
            px={2}
            minHeight={"calc(100vh - 340px)"}
          >
            <Paper
              elevation={3}
              sx={{
                borderRadius: 4,
                p: 4,
                width: "100%",
                maxWidth: 500,
                marginTop: 10,
                textAlign: "center",
                margin: 0,
                border: "1px solid #E7EAFD",
                boxShadow: "0px 45px 64px 0px #0D03230F",
              }}
            >
              <Box display="flex" justifyContent="center" mb={2}>
                <Image src="/logo2.png" alt="Logo" width={69} height={77} />
              </Box>

              <Typography variant="h6" fontWeight={500} fontSize={25} gutterBottom fontFamily="Space Grotesk">
                Your order is almost complete!
              </Typography>

              <Typography variant="body2" color="#000" mb={3} fontFamily="Space Grotesk">
                Choose a payment method below to finalize your transaction:
              </Typography>

              <Box
                alignItems="center"
                border="1px solid #E2E8F0"
                borderRadius={2}
                px={2}
                mb={2}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  py={2}
                >
                  <Typography variant="subtitle2" fontWeight={400} fontSize={25} sx={{
                    fontSize: {
                      xs: '12px',  // for small screens
                      sm: '18px',
                      md: '20px',  // default
                    }
                  }}>
                    To Pay:
                  </Typography>
                  <Box
                    display="flex"
                    alignItems="center"
                    border={1}
                    borderRadius={"6px"}
                    padding={1}
                    gap={1}
                    sx={{
                      cursor: "pointer",
                      borderColor: "transparent",
                      "&:hover": {
                        borderColor: "#737373", // or any hover color
                      },
                    }}
                    onClick={handleClick}
                  >
                    {currencyOptions.find((c) => c.code === currencyRates?.currency)?.icon || currencyOptions.find((c) => c.code === walletState?.currency)?.icon}
                    <Typography fontWeight={400} fontFamily="Space Grotesk" fontSize={25} sx={{
                      fontSize: {
                        xs: '12px',  // for small screens
                        sm: '18px',
                        md: '20px',  // default
                      }
                    }}>
                      {currencyRates?.amount ?? walletState?.amount} {currencyRates?.currency ?? walletState?.currency}
                    </Typography>
                    {isOpen ? (
                      <ArrowDropUp fontSize="small" />
                    ) : (
                      <ArrowDropDown fontSize="small" />
                    )}

                    <Menu
                      anchorEl={anchorEl}
                      open={isOpen}
                      onClose={handleClose}
                      PaperProps={{
                        sx: {
                          border: "1px solid #737373",
                          borderRadius: "10px",
                        },
                      }}
                    >
                      {currencyOptions.map((currency) => (
                        <MenuItem
                          key={currency.code}
                          onClick={(e) => handleSelect(e, currency.code)}
                          sx={{
                            px: {
                              xs: 1.5,
                              sm: 2,
                              md: 2.5,
                            },
                            py: {
                              xs: 1,
                              sm: 1.2,
                              md: 1.5,
                            },
                          }}
                        >
                          <Box display="flex" alignItems="center" gap={1}>
                            {currency.icon}
                            <Typography sx={{
                              fontSize: {
                                xs: '14px',  // for small screens
                                sm: '18px',
                                md: '20px',  // default
                              }
                            }}>
                              {currency.label}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box display="flex" gap={2} mb={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AssuredWorkloadIcon />}
                    onClick={() => {
                      setActiveStep(1);
                      setTransferMethod("bank");
                    }}
                    sx={{
                      borderColor: "#4F46E5",
                      color: "#4F46E5",
                      textTransform: "none",
                      fontFamily: "Space Grotesk",
                      borderRadius: 30,

                      // Responsive padding
                      py: {
                        xs: 1.2,  // ~10px
                        sm: 1.5,
                        md: 2     // default
                      },

                      // Responsive font size
                      fontSize: {
                        xs: '14px',
                        sm: '16px',
                        md: '18px'
                      },

                      // Optional: Responsive minHeight for better visual spacing
                      minHeight: {
                        xs: 40,
                        sm: 48,
                        md: 56
                      },

                      "&:hover": {
                        backgroundColor: "#EEF2FF",
                        borderColor: "#4F46E5",
                      },
                    }}
                  >
                    {isSmallScreen ? 'Bank' : 'Bank Transfer'}


                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<CurrencyBitcoinIcon />}
                    onClick={() => {
                      setActiveStep(1);
                      setTransferMethod("crypto");
                    }}
                    sx={{
                      borderColor: "#10B981",
                      color: "#10B981",
                      textTransform: "none",
                      borderRadius: 30,
                      fontFamily: "Space Grotesk",

                      // Responsive vertical padding
                      py: {
                        xs: 1.2,  // ~10px
                        sm: 1.5,
                        md: 2
                      },

                      // Responsive font size
                      fontSize: {
                        xs: '14px',
                        sm: '16px',
                        md: '18px'
                      },

                      // Optional: consistent height across devices
                      minHeight: {
                        xs: 40,
                        sm: 48,
                        md: 56
                      },

                      "&:hover": {
                        backgroundColor: "#ECFDF5",
                        borderColor: "#10B981",
                      },
                    }}
                  >
                    {isSmallScreen ? 'Crypto' : 'Cryptocurrency'}
                  </Button>

                </Box>
              </Box>

              <Box
                display="flex"
                justifyContent="space-between"
                // alignItems='center'
                mt={3}
              >
                {/* Left text */}
                <Typography
                  variant="caption"
                  color="#515151"
                  fontWeight={400}
                  fontSize={12}
                  sx={{ textAlign: "left" }}
                >
                  If you need to continue later, save your {"\n"} Transaction
                  ID:
                </Typography>

                {/* Right part: ID and copy icon */}
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography
                    variant="caption"
                    fontWeight={400}
                    fontSize={12}

                    color="#515151"
                  >
                    #ABC123456
                  </Typography>

                  <IconButton
                    size="small"
                    sx={{
                      bgcolor: "#EEF2FF",
                      p: 0.5,
                      borderRadius: 2,
                      "&:hover": { bgcolor: "#E0E7FF" },
                    }}
                  >
                    <CopyIcon />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          </Box>
          // <UnderPayment/>
          // <OverPayment/>
        ) : activeStep === 1 ? (
          transferMethod === "bank" ? (
            <BankTransferCompo
              activeStep={activeStep}
              setActiveStep={setActiveStep}
            />
          ) : (
            <CryptoTransfer activeStep={activeStep} setActiveStep={setActiveStep} walletState={walletState} />
          )
        ) : activeStep === 2 ? (
          <TransferExpectedCard isTrue={false} type={transferMethod} />
        ) : null}

        <Box sx={{ width: "100%" }}>
          <Footer />
        </Box>
      </Box>

      <FloatingChatButton />
    </Box>
  );
};

export default paymentAuth(Payment);
// export default Payment;
