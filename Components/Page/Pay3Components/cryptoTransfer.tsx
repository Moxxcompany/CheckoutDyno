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
import UnderPayment from "@/Components/UI/UnderPayment/Index";
import OverPayment from "@/Components/UI/OverPayment/Index";

import LTCicon from "../../../assets/Icons/coins/LTC.png";
import BCHicon from "../../../assets/Icons/coins/BCH.png";
import DOGEicon from "../../../assets/Icons/coins/DOGE.png";
import TRXicon from "../../../assets/Icons/coins/TRX.png";

// Payment status types
type PaymentStatusType = 
  | "waiting"      // No payment detected yet
  | "pending"      // Payment detected, awaiting confirmation
  | "confirmed"    // Payment confirmed successfully
  | "underpaid"    // Partial payment received
  | "overpaid"     // More than expected was paid
  | "expired";     // Payment window expired

interface PartialPaymentData {
  paidAmount: number;
  expectedAmount: number;
  remainingAmount: number;
  currency: string;
  txId?: string;
  graceMinutes?: number;
  address?: string;
  paidAmountUsd?: number;
  expectedAmountUsd?: number;
  remainingAmountUsd?: number;
  baseCurrency?: string;
}

interface OverpaymentData {
  paidAmount: number;
  expectedAmount: number;
  excessAmount: number;
  currency: string;
  txId?: string;
  paidAmountUsd?: number;
  expectedAmountUsd?: number;
  excessAmountUsd?: number;
  baseCurrency?: string;
}

interface CryptoTransferProps {
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  walletState: walletState;
  feePayer?: string;
}

// Cache duration for rate prefetching
const RATE_CACHE_DURATION_MS = 30000; // 30 seconds

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
  feePayer,
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
  const [timeLeft, setTimeLeft] = useState(30 * 60); // Default 30 minutes, will be updated from backend

  const [isUrl, setIsUrl] = useState<string | null>("");

  const [isNetwork, setIsNetwork] = useState("");

  const [isStart, setIsStart] = useState(false);

  // New state for payment status handling
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusType>("waiting");
  const [partialPaymentData, setPartialPaymentData] = useState<PartialPaymentData | null>(null);
  const [overpaymentData, setOverpaymentData] = useState<OverpaymentData | null>(null);

  // Polling trigger to restart polling after underpayment
  const [pollingTrigger, setPollingTrigger] = useState(0);
  
  // Copy feedback state
  const [showCopyToast, setShowCopyToast] = useState(false);
  
  // Merchant settings (should come from backend)
  const [merchantSettings, setMerchantSettings] = useState({
    overpaymentThresholdUsd: 5,
    gracePeriodMinutes: 30,
  });

  // State for configured currencies
  const [availableCryptos, setAvailableCryptos] = useState<string[]>([]);
  const [availableUSDTNetworks, setAvailableUSDTNetworks] = useState<('TRC20' | 'ERC20')[]>([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);
  const [skipSelection, setSkipSelection] = useState(false);
  const [currencyError, setCurrencyError] = useState<string | null>(null);

  // Rate caching state
  const [prefetchedRates, setPrefetchedRates] = useState<currencyData[] | null>(null);
  const [ratesFetchedAt, setRatesFetchedAt] = useState<number>(0);
  const [loadingStep, setLoadingStep] = useState<'rates' | 'payment' | null>(null);
  // Track which fee_payer value was used for cached rates
  const [cachedFeePayer, setCachedFeePayer] = useState<string>('');

  // Track if we're in partial payment completion mode
  const [isPartialPaymentMode, setIsPartialPaymentMode] = useState(false);
  const [remainingPaymentInfo, setRemainingPaymentInfo] = useState<{
    remainingAmount: number;
    remainingAmountUsd: number;
    currency: string;
  } | null>(null);

  // Fetch configured currencies on mount
  useEffect(() => {
    const fetchConfiguredCurrencies = async () => {
      try {
        setLoadingCurrencies(true);
        setCurrencyError(null);
        
        const response = await axiosBaseApi.get("/pay/configured-currencies");
        const data = response?.data?.data || response?.data;
        
        const configuredCurrencies: string[] = data?.configured_currencies || [];
        const shouldSkipSelection = data?.skip_selection || false;
        
        // Parse currencies - separate base currencies and USDT networks
        const baseCryptos: string[] = [];
        const usdtNetworks: ('TRC20' | 'ERC20')[] = [];
        
        configuredCurrencies.forEach((currency: string) => {
          if (currency.startsWith('USDT-')) {
            const network = currency.replace('USDT-', '') as 'TRC20' | 'ERC20';
            if (network === 'TRC20' || network === 'ERC20') {
              usdtNetworks.push(network);
              if (!baseCryptos.includes('USDT')) {
                baseCryptos.push('USDT');
              }
            }
          } else {
            baseCryptos.push(currency);
          }
        });
        
        setAvailableCryptos(baseCryptos);
        setAvailableUSDTNetworks(usdtNetworks);
        setSkipSelection(shouldSkipSelection);
        
        // Auto-select if skip_selection is true and only one option
        if (shouldSkipSelection && baseCryptos.length === 1) {
          const autoSelectedCrypto = baseCryptos[0];
          setSelectedCrypto(autoSelectedCrypto);
          setIsNetwork(autoSelectedCrypto);
          
          if (autoSelectedCrypto === 'USDT' && usdtNetworks.length === 1) {
            setSelectedNetwork(usdtNetworks[0]);
            getCurrencyRateAndSubmit('USDT', usdtNetworks[0]);
          } else if (autoSelectedCrypto !== 'USDT') {
            getCurrencyRateAndSubmit(autoSelectedCrypto);
          }
        }
      } catch (e: any) {
        const message = e?.response?.data?.message ?? e?.message ?? "Failed to load currencies";
        setCurrencyError(message);
        // Set defaults if API fails - show all currencies
        setAvailableCryptos(cryptoOptions.map(opt => opt.value));
        setAvailableUSDTNetworks(['TRC20', 'ERC20']);
      } finally {
        setLoadingCurrencies(false);
      }
    };
    
    fetchConfiguredCurrencies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Prefetch currency rates when component mounts
  useEffect(() => {
    const prefetchRates = async () => {
      if (!walletState?.amount || !walletState?.currency) return;
      
      console.log("Prefetching rates with feePayer:", feePayer);
      
      try {
        const rateResponse = await axiosBaseApi.post("/pay/getCurrencyRates", {
          source: walletState?.currency,
          amount: walletState?.amount,
          currencyList: cryptoOptions.map((x) => x.value),
          fixedDecimal: false,
          fee_payer: feePayer,
        });
        
        const rateData = rateResponse?.data?.data;
        console.log("Prefetch response:", rateData);
        if (rateData) {
          setPrefetchedRates(rateData);
          setRatesFetchedAt(Date.now());
          setCachedFeePayer(feePayer || '');  // Track fee_payer used for this cache
        }
      } catch (e) {
        // Silent fail for prefetch - will fetch again when needed
        console.log("Rate prefetch failed, will fetch on demand");
      }
    };
    
    prefetchRates();
  }, [walletState?.amount, walletState?.currency, feePayer]);

  // Filter crypto options based on available currencies
  const filteredCryptoOptions = cryptoOptions.filter(opt => 
    availableCryptos.includes(opt.value)
  );

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
    setShowCopyToast(true);
    dispatch({
      type: TOAST_SHOW,
      payload: {
        message: "Address copied to clipboard!",
        severity: "success",
      },
    });
    setTimeout(() => {
      setCopied(false);
      setShowCopyToast(false);
    }, 2000);
  };
  
  // Copy amount to clipboard
  const handleCopyAmount = () => {
    const amount = isPartialPaymentMode && remainingPaymentInfo
      ? remainingPaymentInfo.remainingAmount
      : (selectedCurrency?.total_amount || selectedCurrency?.amount || 0);
    navigator.clipboard.writeText(String(amount));
    dispatch({
      type: TOAST_SHOW,
      payload: {
        message: "Amount copied to clipboard!",
        severity: "success",
      },
    });
  };
  
  // Get polling interval based on chain (faster chains poll more frequently)
  const getPollingInterval = (crypto: string, network?: string): number => {
    // TRX and USDT-TRC20 are faster
    if (crypto === 'TRX' || (crypto === 'USDT' && network === 'TRC20')) {
      return 10000; // 10 seconds
    }
    // BTC is slower
    if (crypto === 'BTC') {
      return 30000; // 30 seconds
    }
    // ETH and ERC20 tokens
    if (crypto === 'ETH' || (crypto === 'USDT' && network === 'ERC20')) {
      return 15000; // 15 seconds
    }
    // Default for other chains
    return 15000; // 15 seconds
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

      let rateData: currencyData[] | null = null;
      
      // Check if we have fresh cached rates
      const isCacheValid = prefetchedRates && 
        (Date.now() - ratesFetchedAt) < RATE_CACHE_DURATION_MS &&
        cachedFeePayer === (feePayer || '');  // Invalidate cache if fee_payer changed
      
      if (isCacheValid) {
        console.log("Using cached rates");
        rateData = prefetchedRates;
      } else {
        // Fetch fresh rates
        setLoadingStep('rates');
        const rateResponse = await axiosBaseApi.post("/pay/getCurrencyRates", {
          source: walletState?.currency,
          amount: walletState?.amount,
          currencyList: cryptoOptions.map((x) => x.value),
          fixedDecimal: false,
          fee_payer: feePayer,
        });

        rateData = rateResponse?.data?.data;
        
        // Update cache
        if (rateData) {
          setPrefetchedRates(rateData);
          setRatesFetchedAt(Date.now());
          setCachedFeePayer(feePayer || '');  // Track fee_payer used for this cache
        }
      }

      const findRate = rateData?.find(
        (item: any) => item.currency === baseCurrency
      );

      console.log("findRate for", baseCurrency, ":", findRate);
      console.log("total_amount_source:", findRate?.total_amount_source);

      setCurrencyRates(rateData || undefined);
      setSelectedCurrency(findRate);
      setSelectedCrypto(cryptoValue);

      // Create payment
      setLoadingStep('payment');
      
      const finalPayload = {
        currency: displayCurrency, // e.g., "USDT-TRC20"
        amount: findRate?.total_amount || findRate?.amount, // use total_amount when customer pays fees
        paymentType: paymentTypes.CRYPTO,
      };

      console.log("finalPayload", finalPayload);

      const encrypted = createEncryption(JSON.stringify(finalPayload));
      const submitResponse = await axiosBaseApi.post("/pay/addPayment", {
        data: encrypted,
      });

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
      setLoadingStep(null);
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
    
    // Don't start polling if no address yet
    if (!cryptoDetails?.address) return;

    setIsReceived(false);
    setPaymentStatus("waiting");
    
    // Get appropriate polling interval based on chain
    const pollingIntervalMs = getPollingInterval(selectedCrypto, selectedNetwork);
    
    // Track if this is first poll to show "pending" toast only once
    let hasPendingToastShown = false;

    const pollInterval = setInterval(async () => {
      try {
        const response = await axiosBaseApi.post("/pay/verifyCryptoPayment", {
          address: cryptoDetails?.address,
        });
        const data = response?.data?.data;
        const status = data?.status as PaymentStatusType;
        const redirectUrl = data?.redirect;
        
        // Update merchant settings if provided by backend
        if (data?.merchant_settings) {
          setMerchantSettings(prev => ({
            ...prev,
            overpaymentThresholdUsd: data.merchant_settings.overpayment_threshold_usd ?? prev.overpaymentThresholdUsd,
            gracePeriodMinutes: data.merchant_settings.grace_period_minutes ?? prev.gracePeriodMinutes,
          }));
        }
        
        // Update timer from backend if provided
        if (data?.remaining_seconds !== undefined && data?.remaining_seconds > 0) {
          setTimeLeft(data.remaining_seconds);
        }

        setPaymentStatus(status);

        switch (status) {
          case "waiting":
            // No payment detected yet - keep waiting
            setIsStart(false);
            setIsReceived(false);
            break;

          case "pending":
            // Payment detected, awaiting blockchain confirmation
            setIsStart(true);
            setIsReceived(false);
            // Show user feedback that payment was detected (only once)
            if (!hasPendingToastShown) {
              hasPendingToastShown = true;
              dispatch({
                type: TOAST_SHOW,
                payload: {
                  message: "Payment detected! Waiting for blockchain confirmation...",
                  severity: "info",
                },
              });
            }
            // Don't clear interval - keep polling until confirmed/failed
            break;

          case "confirmed":
            // Payment confirmed successfully
            setIsStart(true);
            setIsReceived(true);
            setIsUrl(redirectUrl);
            setIsPartialPaymentMode(false);  // Reset partial payment mode
            setRemainingPaymentInfo(null);    // Clear remaining payment info
            clearInterval(pollInterval);
            break;

          case "underpaid":
            // Partial payment received
            setIsStart(true);
            setIsReceived(false);
            const graceMinutes = data?.grace_period_minutes || merchantSettings.gracePeriodMinutes;
            setPartialPaymentData({
              paidAmount: data?.paidAmount || 0,
              expectedAmount: data?.expectedAmount || 0,
              remainingAmount: data?.remainingAmount || 0,
              currency: data?.currency || walletState?.currency || "USD",
              txId: data?.txId || "",
              graceMinutes: graceMinutes,
              address: cryptoDetails?.address,
              paidAmountUsd: data?.paidAmountUsd || 0,
              expectedAmountUsd: data?.expectedAmountUsd || 0,
              remainingAmountUsd: data?.remainingAmountUsd || 0,
              baseCurrency: data?.baseCurrency || "USD",
            });
            clearInterval(pollInterval);
            break;

          case "overpaid":
            // More than expected was paid
            setIsStart(true);
            setIsReceived(true);
            
            // Only show overpayment screen if excess amount > threshold (from merchant settings)
            const excessUsd = data?.excessAmountUsd || 0;
            const overpaymentThreshold = data?.merchant_settings?.overpayment_threshold_usd ?? merchantSettings.overpaymentThresholdUsd;
            
            if (excessUsd > overpaymentThreshold) {
              // Significant overpayment - show overpayment screen
              setOverpaymentData({
                paidAmount: data?.paidAmount || 0,
                expectedAmount: data?.expectedAmount || 0,
                excessAmount: data?.excessAmount || 0,
                currency: data?.currency || walletState?.currency || "USD",
                txId: data?.txId || "",
                paidAmountUsd: data?.paidAmountUsd || 0,
                expectedAmountUsd: data?.expectedAmountUsd || 0,
                excessAmountUsd: data?.excessAmountUsd || 0,
                baseCurrency: data?.baseCurrency || "USD",
              });
            } else {
              // Minor overpayment (<= threshold) - treat as confirmed and redirect
              setIsUrl(redirectUrl);
              if (redirectUrl) {
                window.location.replace(redirectUrl);
              }
            }
            setIsUrl(redirectUrl);
            clearInterval(pollInterval);
            break;

          case "expired":
            // Payment window expired
            setIsStart(false);
            setIsReceived(false);
            clearInterval(pollInterval);
            dispatch({
              type: TOAST_SHOW,
              payload: {
                message: "Payment window has expired. Please try again.",
                severity: "error",
              },
            });
            break;

          default:
            // Unknown status - handle gracefully
            break;
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
    }, pollingIntervalMs);

    return () => clearInterval(pollInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCrypto, cryptoDetails?.address, dispatch, selectedNetwork, walletState?.currency, pollingTrigger]);

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

  // Handler for paying remaining amount in underpayment scenario
  const handlePayRemaining = (method: "bank" | "crypto") => {
    if (method === "crypto") {
      // IMPORTANT: Keep the same address for partial payment completion
      // Do NOT regenerate address or clear cryptoDetails
      
      if (partialPaymentData) {
        // Store remaining payment info for display
        setRemainingPaymentInfo({
          remainingAmount: partialPaymentData.remainingAmount,
          remainingAmountUsd: partialPaymentData.remainingAmountUsd || 0,
          currency: partialPaymentData.currency,
        });
        
        // Update selectedCurrency to show REMAINING amount
        setSelectedCurrency((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            currency: partialPaymentData.currency,
            amount: partialPaymentData.remainingAmount,
            total_amount: partialPaymentData.remainingAmount,
            total_amount_usd: partialPaymentData.remainingAmountUsd || 0,
            total_amount_source: partialPaymentData.remainingAmountUsd || 0,
          } as currencyData;
        });
        
        setIsPartialPaymentMode(true);
      }
      
      setPaymentStatus("waiting");
      setIsStart(false);  // Show "To Pay" card with remaining amount
      setIsReceived(false);
      setPartialPaymentData(null); // Clear to exit UnderPayment screen
      
      // FIX: Reset timer to grace period (from backend or default 30 minutes)
      const gracePeriodSeconds = (partialPaymentData?.graceMinutes || merchantSettings.gracePeriodMinutes) * 60;
      setTimeLeft(gracePeriodSeconds);
      
      // FIX: Increment polling trigger to restart polling
      setPollingTrigger(prev => prev + 1);
    } else {
      // Bank transfer - reset for different payment method
      setPaymentStatus("waiting");
      setPartialPaymentData(null);
      setIsPartialPaymentMode(false);
      setRemainingPaymentInfo(null);
      setActiveStep(1);
    }
  };

  // Handler for going to website after overpayment
  const handleOverpaymentGoToWebsite = () => {
    btnGotoWeb();
  };

  // Render UnderPayment component
  if (paymentStatus === "underpaid" && partialPaymentData) {
    return (
      <UnderPayment
        paidAmount={partialPaymentData.paidAmount}
        expectedAmount={partialPaymentData.expectedAmount}
        remainingAmount={partialPaymentData.remainingAmount}
        currency={partialPaymentData.currency}
        onPayRemaining={handlePayRemaining}
        transactionId={partialPaymentData.txId}
        paidAmountUsd={partialPaymentData.paidAmountUsd}
        expectedAmountUsd={partialPaymentData.expectedAmountUsd}
        remainingAmountUsd={partialPaymentData.remainingAmountUsd}
        baseCurrency={partialPaymentData.baseCurrency}
        graceMinutes={partialPaymentData.graceMinutes}
      />
    );
  }

  // Render OverPayment component
  if (paymentStatus === "overpaid" && overpaymentData) {
    return (
      <OverPayment
        paidAmount={overpaymentData.paidAmount}
        expectedAmount={overpaymentData.expectedAmount}
        excessAmount={overpaymentData.excessAmount}
        currency={overpaymentData.currency}
        onGoToWebsite={handleOverpaymentGoToWebsite}
        transactionId={overpaymentData.txId}
        paidAmountUsd={overpaymentData.paidAmountUsd}
        expectedAmountUsd={overpaymentData.expectedAmountUsd}
        excessAmountUsd={overpaymentData.excessAmountUsd}
        baseCurrency={overpaymentData.baseCurrency}
      />
    );
  }

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
          {loadingCurrencies ? (
            <Box 
              display="flex" 
              alignItems="center" 
              justifyContent="center" 
              py={2}
              border="1px solid #737373"
              borderRadius="10px"
            >
              <CircularProgress size={24} sx={{ color: "#444CE7" }} />
              <Typography ml={2} fontFamily="Space Grotesk" color="#515151">
                Loading currencies...
              </Typography>
            </Box>
          ) : currencyError && filteredCryptoOptions.length === 0 ? (
            <Box 
              display="flex" 
              alignItems="center" 
              justifyContent="center" 
              py={2}
              border="1px solid #ef4444"
              borderRadius="10px"
              bgcolor="#fef2f2"
            >
              <Typography fontFamily="Space Grotesk" color="#ef4444">
                No currencies configured. Please contact support.
              </Typography>
            </Box>
          ) : filteredCryptoOptions.length === 0 ? (
            <Box 
              display="flex" 
              alignItems="center" 
              justifyContent="center" 
              py={2}
              border="1px solid #f59e0b"
              borderRadius="10px"
              bgcolor="#fffbeb"
            >
              <Typography fontFamily="Space Grotesk" color="#b45309">
                No cryptocurrencies available for payment.
              </Typography>
            </Box>
          ) : (
          <Select
            labelId="crypto-select-label"
            id="crypto-select"
            value={selectedCrypto}
            displayEmpty
            onChange={handleChange}
            disabled={loadingCurrencies}
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
            {filteredCryptoOptions?.map((option) => (
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
          )}
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
          availableUSDTNetworks.length > 0 ? (
            <Box mt={"10px"} mb={3} display="flex" gap={1} alignItems="center">
              {availableUSDTNetworks.map((net) => (
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
                  onClick={() => handleNetworkChange(net)}
                  fontFamily="Space Grotesk"
                >
                  {net}
                </Typography>
              ))}
            </Box>
          ) : (
            <Box 
              mt={"10px"} 
              mb={3} 
              display="flex" 
              alignItems="center"
              py={1}
              px={2}
              border="1px solid #f59e0b"
              borderRadius="8px"
              bgcolor="#fffbeb"
            >
              <Typography fontFamily="Space Grotesk" color="#b45309" fontSize="small">
                No USDT networks configured. Please select another cryptocurrency.
              </Typography>
            </Box>
          )
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
                    <Box sx={{ padding: 2, textAlign: 'center' }}>
                      <CircularProgress />
                      <Typography 
                        variant="body2" 
                        sx={{ mt: 1, color: '#515151' }}
                        fontFamily="Space Grotesk"
                      >
                        {loadingStep === 'rates' 
                          ? 'Getting exchange rates...' 
                          : loadingStep === 'payment' 
                            ? 'Creating payment...' 
                            : 'Loading...'}
                      </Typography>
                    </Box>
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={cryptoDetails?.qr_code}
                      width={"100%"}
                      height={"100%"}
                      alt="Payment QR Code"
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
                  height={"auto"}
                  minHeight={"129px"}
                  sx={{ opacity: isStart ? 0.5 : 1 }}
                >
                  {/* Show "Remaining Balance" header if in partial payment mode */}
                  {isPartialPaymentMode && (
                    <Box 
                      bgcolor="#FEF3C7" 
                      borderRadius={1} 
                      px={1} 
                      py={0.5} 
                      mb={1}
                      display="inline-block"
                    >
                      <Typography
                        variant="caption"
                        color="#92400E"
                        fontFamily="Space Grotesk"
                        fontWeight={500}
                      >
                        Remaining Balance
                      </Typography>
                    </Box>
                  )}
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
                          whiteSpace="nowrap"
                          color="#1A1919"
                        >
                          {formatAmount(
                            isPartialPaymentMode && remainingPaymentInfo
                              ? remainingPaymentInfo.remainingAmount
                              : (selectedCurrency?.total_amount || selectedCurrency?.amount || 0),
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
                          ={Number(
                            isPartialPaymentMode && remainingPaymentInfo
                              ? remainingPaymentInfo.remainingAmountUsd
                              : (selectedCurrency?.total_amount_usd || selectedCurrency?.total_amount_source || walletState?.amount)
                          )?.toFixed(2)}{" "}
                          {walletState?.currency}
                        </Typography>
                      </Box>
                      <Tooltip title="Copy Amount">
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
                          onClick={handleCopyAmount}
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
                    sx={{
                      // Timer warning when < 5 minutes
                      ...(timeLeft < 5 * 60 && {
                        bgcolor: '#FEE2E2',
                        borderRadius: 1,
                        py: 0.5,
                        px: 1,
                        animation: timeLeft < 2 * 60 ? 'pulse 1.5s infinite' : 'none',
                        '@keyframes pulse': {
                          '0%, 100%': { opacity: 1 },
                          '50%': { opacity: 0.7 },
                        },
                      }),
                    }}
                  >
                    <ClockIcon />
                    <Typography
                      variant="body2"
                      fontWeight={timeLeft < 5 * 60 ? 600 : "normal"}
                      fontSize="13px"
                      fontFamily="Space Grotesk"
                      color={timeLeft < 5 * 60 ? "#DC2626" : "#000"}
                    >
                      invoice expires in: {formatTime(timeLeft)}
                      {timeLeft < 5 * 60 && timeLeft > 0 && " ⚠️"}
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
                        isPartialPaymentMode && remainingPaymentInfo
                          ? remainingPaymentInfo.remainingAmount
                          : (selectedCurrency?.total_amount || selectedCurrency?.amount || 0),
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
