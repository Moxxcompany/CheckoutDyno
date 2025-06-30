import React, { useState } from "react";
import {
  ArrowDropDown,
  ArrowDropUp,
  FlagCircleOutlined,
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
import Image from "next/image";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import AssuredWorkloadIcon from "@mui/icons-material/AssuredWorkload";
import CopyIcon from "@/assets/Icons/CopyIcon";
import UnderPaymentIcon from "@/assets/Icons/UnderPaymentIcon";

const UnderPayment = () => {
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();

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
    setSelectedCurrency(code);
    handleClose();
  };

  const currencyOptions = [
    {
      code: "USD",
      label: "United States Dollar (USD)",
      icon: <FlagCircleOutlined sx={{ fontSize: 18 }} />,
      rate: 1, // Base currency
    },
    {
      code: "EUR",
      label: "Euro (EUR)",
      icon: <FlagCircleOutlined sx={{ fontSize: 18 }} />,
      rate: 0.93,
    },
    {
      code: "NGN",
      label: "Nigerian Naira (NGN)",
      icon: <FlagCircleOutlined sx={{ fontSize: 18 }} />,
      rate: 1600,
    },
  ];

  const isOpen = Boolean(anchorEl);

  const basePriceUSD = 129.0;
  const selected = currencyOptions.find((c) => c.code === selectedCurrency);
  const convertedPrice = (basePriceUSD * (selected?.rate || 1)).toFixed(2);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
                    xs: "12px", // for small screens
                    sm: "14px",
                    md: "16px", // default
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
                    xs: "12px", // for small screens
                    sm: "14px",
                    md: "16px", // default
                  },
                }}
              >
                120.00 USD
              </Typography>
            </Box>

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              // py={2}
            >
              <Typography
                variant="subtitle2"
                fontWeight={400}
                fontSize={25}
                color="#000"
                fontFamily="Space Grotesk"
                sx={{
                  fontSize: {
                    xs: "12px", // for small screens
                    sm: "18px",
                    md: "20px", // default
                  },
                }}
              >
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
                {selected?.icon}
                <Typography
                  fontWeight={400}
                  fontFamily="Space Grotesk"
                  fontSize={25}
                color="#000"

                  sx={{
                    fontSize: {
                      xs: "12px", // for small screens
                      sm: "18px",
                      md: "20px", // default
                    },
                  }}
                >
                  {convertedPrice} {selected?.code}
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
                        <Typography
                          sx={{
                            fontSize: {
                              xs: "14px", // for small screens
                              sm: "18px",
                              md: "20px", // default
                            },
                          }}
                        >
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
                  // setActiveStep(1);
                  // setTransferMethod("bank");
                }}
                sx={{
                  borderColor: "#4F46E5",
                  color: "#4F46E5",
                  textTransform: "none",
                  fontFamily: "Space Grotesk",
                  borderRadius: 30,

                  // Responsive padding
                  py: {
                    xs: 1.2, // ~10px
                    sm: 1.5,
                    md: 2, // default
                  },

                  // Responsive font size
                  fontSize: {
                    xs: "14px",
                    sm: "16px",
                    md: "18px",
                  },

                  // Optional: Responsive minHeight for better visual spacing
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
                onClick={() => {
                  // setActiveStep(1);
                  // setTransferMethod("crypto");
                }}
                sx={{
                  borderColor: "#10B981",
                  color: "#10B981",
                  textTransform: "none",
                  borderRadius: 30,
                  fontFamily: "Space Grotesk",

                  // Responsive vertical padding
                  py: {
                    xs: 1.2, // ~10px
                    sm: 1.5,
                    md: 2,
                  },

                  // Responsive font size
                  fontSize: {
                    xs: "14px",
                    sm: "16px",
                    md: "18px",
                  },

                  // Optional: consistent height across devices
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
              If you need to continue later, save your {"\n"} Transaction ID:
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
    </>
  );
};

export default UnderPayment;
