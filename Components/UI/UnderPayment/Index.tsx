import React, { useState } from "react";
import {
  ArrowDropDown,
  ArrowDropUp,
  FlagCircleOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import AssuredWorkloadIcon from "@mui/icons-material/AssuredWorkload";
import CopyIcon from "@/assets/Icons/CopyIcon";
import UnderPaymentIcon from "@/assets/Icons/UnderPaymentIcon";

interface UnderPaymentProps {
  paidAmount: number;
  expectedAmount: number;
  remainingAmount: number;
  currency: string;
  onPayRemaining: (method: "bank" | "crypto") => void;
  transactionId?: string;
  paidAmountUsd?: number;
  expectedAmountUsd?: number;
  remainingAmountUsd?: number;
  baseCurrency?: string;
  graceMinutes?: number;
}

// Helper function to format amounts correctly for crypto vs fiat
const formatAmount = (amount: number, currency: string): string => {
  const cryptoCurrencies = [
    'BTC', 'ETH', 'LTC', 'DOGE', 'TRX', 'BCH', 
    'USDT', 'USDT-TRC20', 'USDT-ERC20', 'USDC', 'USDC-ERC20'
  ];
  
  const isCrypto = cryptoCurrencies.some(c => 
    currency.toUpperCase().includes(c)
  );
  
  if (isCrypto) {
    // For crypto: use up to 8 decimals, remove trailing zeros
    const formatted = amount.toFixed(8);
    // Remove trailing zeros but keep at least 2 decimal places
    return formatted.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
  }
  
  // For fiat: use 2 decimal places
  return amount.toFixed(2);
};

const UnderPayment = ({
  paidAmount,
  expectedAmount,
  remainingAmount,
  currency,
  onPayRemaining,
  transactionId = "",
  paidAmountUsd,
  expectedAmountUsd,
  remainingAmountUsd,
  baseCurrency = "USD",
  graceMinutes = 30,
}: UnderPaymentProps) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  
  // Calculate progress percentage
  const progressPercent = expectedAmount > 0 
    ? Math.min((paidAmount / expectedAmount) * 100, 100) 
    : 0;

  const handleCopyTransactionId = () => {
    if (transactionId) {
      navigator.clipboard.writeText(transactionId);
    }
  };

  return (
    <>
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
            <UnderPaymentIcon />
          </Box>

          <Typography
            variant="h6"
            fontWeight={500}
            fontSize={25}
            gutterBottom
            fontFamily="Space Grotesk"
          >
            Partial Payment Received
          </Typography>

          <Typography
            variant="body2"
            color="#000"
            mb={3}
            fontFamily="Space Grotesk"
          >
            Almost there! Please complete the payment.
          </Typography>

          {/* Progress Bar showing % paid */}
          <Box mb={3}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography
                variant="caption"
                color="#515151"
                fontFamily="Space Grotesk"
                fontWeight={500}
              >
                Payment Progress
              </Typography>
              <Typography
                variant="caption"
                color="#10B981"
                fontFamily="Space Grotesk"
                fontWeight={600}
              >
                {progressPercent.toFixed(1)}% Complete
              </Typography>
            </Box>
            <Box
              sx={{
                width: '100%',
                height: 10,
                bgcolor: '#E5E7EB',
                borderRadius: 5,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  bgcolor: '#10B981',
                  borderRadius: 5,
                  transition: 'width 0.5s ease-in-out',
                }}
              />
            </Box>
          </Box>

          {/* Grace Period Warning */}
          <Box 
            bgcolor="#FEF3C7" 
            borderRadius={2} 
            p={2} 
            mb={2}
            display="flex"
            alignItems="center"
            gap={1}
          >
            <Typography
              variant="body2"
              color="#92400E"
              fontFamily="Space Grotesk"
              fontWeight={500}
            >
              ⏰ Please complete payment within {graceMinutes} minutes to use the same address.
            </Typography>
          </Box>

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
              <Typography
                variant="subtitle2"
                fontWeight={400}
                fontSize={16}
                color="#515151"
                fontFamily="Space Grotesk"
                sx={{
                  fontSize: {
                    xs: "12px",
                    sm: "14px",
                    md: "16px",
                  },
                }}
              >
                Paid:
              </Typography>

              <Box textAlign="right">
                <Typography
                  variant="subtitle2"
                  fontWeight={400}
                  color="#515151"
                  fontSize={16}
                  fontFamily="Space Grotesk"
                  sx={{
                    fontSize: {
                      xs: "12px",
                      sm: "14px",
                      md: "16px",
                    },
                  }}
                >
                  {formatAmount(paidAmount, currency)} {currency}
                </Typography>
                {paidAmountUsd !== undefined && (
                  <Typography
                    variant="caption"
                    color="#737373"
                    fontFamily="Space Grotesk"
                    fontSize={12}
                  >
                    ≈ ${paidAmountUsd.toFixed(2)} {baseCurrency}
                  </Typography>
                )}
              </Box>
            </Box>

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              py={2}
            >
              <Typography
                variant="subtitle2"
                fontWeight={500}
                fontSize={20}
                color="#000"
                fontFamily="Space Grotesk"
                sx={{
                  fontSize: {
                    xs: "14px",
                    sm: "16px",
                    md: "20px",
                  },
                }}
              >
                To Pay:
              </Typography>

              <Box textAlign="right">
                <Typography
                  variant="subtitle2"
                  fontWeight={500}
                  color="#000"
                  fontSize={20}
                  fontFamily="Space Grotesk"
                  sx={{
                    fontSize: {
                      xs: "14px",
                      sm: "16px",
                      md: "20px",
                    },
                  }}
                >
                  {formatAmount(remainingAmount, currency)} {currency}
                </Typography>
                {remainingAmountUsd !== undefined && (
                  <Typography
                    variant="caption"
                    color="#737373"
                    fontFamily="Space Grotesk"
                    fontSize={12}
                  >
                    ≈ ${remainingAmountUsd.toFixed(2)} {baseCurrency}
                  </Typography>
                )}
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box display="flex" gap={2} mb={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AssuredWorkloadIcon />}
                onClick={() => onPayRemaining("bank")}
                sx={{
                  borderColor: "#4F46E5",
                  color: "#4F46E5",
                  textTransform: "none",
                  fontFamily: "Space Grotesk",
                  borderRadius: 30,
                  py: {
                    xs: 1.2,
                    sm: 1.5,
                    md: 2,
                  },
                  fontSize: {
                    xs: "14px",
                    sm: "16px",
                    md: "18px",
                  },
                  minHeight: {
                    xs: 40,
                    sm: 48,
                    md: 56,
                  },
                  "&:hover": {
                    backgroundColor: "#EEF2FF",
                    borderColor: "#4F46E5",
                  },
                }}
              >
                {isSmallScreen ? "Bank" : "Bank Transfer"}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<CurrencyBitcoinIcon />}
                onClick={() => onPayRemaining("crypto")}
                sx={{
                  borderColor: "#10B981",
                  color: "#10B981",
                  textTransform: "none",
                  borderRadius: 30,
                  fontFamily: "Space Grotesk",
                  py: {
                    xs: 1.2,
                    sm: 1.5,
                    md: 2,
                  },
                  fontSize: {
                    xs: "14px",
                    sm: "16px",
                    md: "18px",
                  },
                  minHeight: {
                    xs: 40,
                    sm: 48,
                    md: 56,
                  },
                  "&:hover": {
                    backgroundColor: "#ECFDF5",
                    borderColor: "#10B981",
                  },
                }}
              >
                {isSmallScreen ? "Crypto" : "Cryptocurrency"}
              </Button>
            </Box>
          </Box>

          {transactionId && (
            <Box
              display="flex"
              justifyContent="space-between"
              mt={3}
            >
              <Typography
                variant="caption"
                color="#515151"
                fontWeight={400}
                fontSize={12}
                sx={{ textAlign: "left" }}
              >
                If you need to continue later, save your {"\n"} Transaction ID:
              </Typography>

              <Box display="flex" alignItems="center" gap={1}>
                <Typography
                  variant="caption"
                  fontWeight={400}
                  fontSize={12}
                  color="#515151"
                  sx={{ 
                    maxWidth: 150, 
                    overflow: "hidden", 
                    textOverflow: "ellipsis" 
                  }}
                >
                  #{transactionId.substring(0, 20)}...
                </Typography>

                <IconButton
                  size="small"
                  onClick={handleCopyTransactionId}
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
          )}
        </Paper>
      </Box>
    </>
  );
};

export default UnderPayment;
