import React from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import CopyIcon from "@/assets/Icons/CopyIcon";
import OverPaymentIcon from "@/assets/Icons/OverPaymentIcon";
import DoneIcon from "@mui/icons-material/Done";

interface OverPaymentProps {
  paidAmount: number;
  expectedAmount: number;
  excessAmount: number;
  currency: string;
  onGoToWebsite: () => void;
  transactionId?: string;
  paidAmountUsd?: number;
  expectedAmountUsd?: number;
  excessAmountUsd?: number;
  baseCurrency?: string;
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

const OverPayment = ({
  paidAmount,
  expectedAmount,
  excessAmount,
  currency,
  onGoToWebsite,
  transactionId = "",
  paidAmountUsd,
  expectedAmountUsd,
  excessAmountUsd,
  baseCurrency = "USD",
}: OverPaymentProps) => {
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
            <OverPaymentIcon />
          </Box>

          <Typography
            variant="h6"
            fontWeight={500}
            fontSize={25}
            gutterBottom
            fontFamily="Space Grotesk"
          >
            Overpayment Received
          </Typography>

          <Typography
            variant="body2"
            color="#000"
            mb={3}
            fontFamily="Space Grotesk"
          >
            Thanks! You&apos;ve paid a bit extra.
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
              <Typography
                variant="subtitle2"
                fontWeight={400}
                fontSize={16}
                color="#515151"
                fontFamily="Space Grotesk"
                sx={{
                  fontSize: { xs: "12px", sm: "14px", md: "16px" },
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
                    fontSize: { xs: "12px", sm: "14px", md: "16px" },
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
            >
              <Typography
                variant="subtitle2"
                fontWeight={400}
                fontSize={16}
                color="#515151"
                fontFamily="Space Grotesk"
                sx={{
                  fontSize: { xs: "12px", sm: "14px", md: "16px" },
                }}
              >
                Total Due:
              </Typography>

              <Box textAlign="right">
                <Typography
                  variant="subtitle2"
                  fontWeight={400}
                  color="#515151"
                  fontSize={16}
                  fontFamily="Space Grotesk"
                  sx={{
                    fontSize: { xs: "12px", sm: "14px", md: "16px" },
                  }}
                >
                  {formatAmount(expectedAmount, currency)} {currency}
                </Typography>
                {expectedAmountUsd !== undefined && (
                  <Typography
                    variant="caption"
                    color="#737373"
                    fontFamily="Space Grotesk"
                    fontSize={12}
                  >
                    ≈ ${expectedAmountUsd.toFixed(2)} {baseCurrency}
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
                  fontSize: { xs: "14px", sm: "16px", md: "20px" },
                }}
              >
                Excess:
              </Typography>

              <Box textAlign="right">
                <Typography
                  variant="subtitle2"
                  fontWeight={500}
                  color="#000"
                  fontSize={20}
                  fontFamily="Space Grotesk"
                  sx={{
                    fontSize: { xs: "14px", sm: "16px", md: "20px" },
                  }}
                >
                  {formatAmount(excessAmount, currency)} {currency}
                </Typography>
                {excessAmountUsd !== undefined && (
                  <Typography
                    variant="caption"
                    color="#737373"
                    fontFamily="Space Grotesk"
                    fontSize={12}
                  >
                    ≈ ${excessAmountUsd.toFixed(2)} {baseCurrency}
                  </Typography>
                )}
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box
              mt={1}
              mb={2}
              borderRadius={2}
              display="flex"
              alignItems="center"
              bgcolor={"#F5F8FF"}
              gap={1}
              px={2}
              py={1}
            >
              <DoneIcon
                sx={{
                  fontSize: 17,
                  color: "#12B76A",
                }}
              />
              <Typography
                fontSize={14}
                color={"#515151"}
                fontFamily="Space Grotesk"
                textAlign="justify"
                fontWeight={500}
              >
                Excess amount will be refunded to your Wallet of the store you
                purchased from.
              </Typography>
            </Box>

            <Box display="flex" gap={2} mb={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={onGoToWebsite}
                sx={{
                  borderColor: "#4F46E5",
                  color: "#4F46E5",
                  textTransform: "none",
                  borderRadius: 30,
                  paddingTop: 2,
                  paddingBottom: 2,
                  "&:hover": {
                    backgroundColor: "#EEF2FF",
                    borderColor: "#4F46E5",
                  },
                }}
                endIcon={<span style={{ fontSize: "1.2rem" }}>→</span>}
              >
                Go to Website
              </Button>
            </Box>
          </Box>

          {transactionId && (
            <Box display="flex" justifyContent="space-between" mt={3}>
              <Typography
                variant="caption"
                color="#515151"
                fontWeight={400}
                fontSize={12}
                sx={{ textAlign: "left" }}
              >
                Transaction ID:
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
                  {transactionId.substring(0, 20)}...
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

export default OverPayment;
