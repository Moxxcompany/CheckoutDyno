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
}

const OverPayment = ({
  paidAmount,
  expectedAmount,
  excessAmount,
  currency,
  onGoToWebsite,
  transactionId = "ABC123456",
}: OverPaymentProps) => {
  const handleCopyTransactionId = () => {
    navigator.clipboard.writeText(transactionId);
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
                  fontSize: {
                    xs: "12px",
                    sm: "14px",
                    md: "16px",
                  },
                }}
              >
                Paid:
              </Typography>

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
                {paidAmount.toFixed(2)} {currency}
              </Typography>
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
                  fontSize: {
                    xs: "12px",
                    sm: "14px",
                    md: "16px",
                  },
                }}
              >
                Total Due:
              </Typography>

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
                {expectedAmount.toFixed(2)} {currency}
              </Typography>
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
                Excess:
              </Typography>

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
                {excessAmount.toFixed(2)} {currency}
              </Typography>
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
              >
                #{transactionId}
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
        </Paper>
      </Box>
    </>
  );
};

export default OverPayment;
