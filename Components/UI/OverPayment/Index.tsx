import React, { useState } from 'react'
import {
  ArrowDropDown,
  ArrowDropUp,
  FlagCircleOutlined
} from '@mui/icons-material'
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
  useTheme
} from '@mui/material'
import Image from 'next/image'
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin'
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload'
import CopyIcon from '@/assets/Icons/CopyIcon'
import UnderPaymentIcon from '@/assets/Icons/UnderPaymentIcon'
import OverPaymentIcon from '@/assets/Icons/OverPaymentIcon'
import DoneIcon from '@mui/icons-material/Done'

const OverPayment = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const theme = useTheme()

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (anchorEl) {
      setAnchorEl(null) // Close if already open
    } else {
      setAnchorEl(event.currentTarget) // Open
    }
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSelect = (event: React.MouseEvent, code: string) => {
    setSelectedCurrency(code)
    handleClose()
  }

  const currencyOptions = [
    {
      code: 'USD',
      label: 'United States Dollar (USD)',
      icon: <FlagCircleOutlined sx={{ fontSize: 18 }} />,
      rate: 1 // Base currency
    },
    {
      code: 'EUR',
      label: 'Euro (EUR)',
      icon: <FlagCircleOutlined sx={{ fontSize: 18 }} />,
      rate: 0.93
    },
    {
      code: 'NGN',
      label: 'Nigerian Naira (NGN)',
      icon: <FlagCircleOutlined sx={{ fontSize: 18 }} />,
      rate: 1600
    }
  ]

  const isOpen = Boolean(anchorEl)

  const basePriceUSD = 129.0
  const selected = currencyOptions.find(c => c.code === selectedCurrency)
  const convertedPrice = (basePriceUSD * (selected?.rate || 1)).toFixed(2)
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='center'
        bgcolor='#F8FAFC'
        px={2}
        minHeight={'calc(100vh - 340px)'}
      >
        <Paper
          elevation={3}
          sx={{
            borderRadius: 4,
            p: 4,
            width: '100%',
            maxWidth: 500,
            marginTop: 10,
            textAlign: 'center',
            margin: 0,
            border: '1px solid #E7EAFD',
            boxShadow: '0px 45px 64px 0px #0D03230F'
          }}
        >
          <Box display='flex' justifyContent='center' mb={2}>
            <OverPaymentIcon />
          </Box>

          <Typography
            variant='h6'
            fontWeight={500}
            fontSize={25}
            gutterBottom
            fontFamily='Space Grotesk'
          >
            Overpayment Received
          </Typography>

          <Typography
            variant='body2'
            color='#000'
            mb={3}
            fontFamily='Space Grotesk'
          >
            Thanks! You&apos;ve paid a bit extra.
          </Typography>

          <Box
            alignItems='center'
            border='1px solid #E2E8F0'
            borderRadius={2}
            px={2}
            mb={2}
          >
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              py={2}
            >
              <Typography
                variant='subtitle2'
                fontWeight={400}
                fontSize={16}
                color='#515151'
                fontFamily='Space Grotesk'
                sx={{
                  fontSize: {
                    xs: '12px', // for small screens
                    sm: '14px',
                    md: '16px' // default
                  }
                }}
              >
                Paid:
              </Typography>

              <Typography
                variant='subtitle2'
                fontWeight={400}
                color='#515151'
                fontSize={16}
                fontFamily='Space Grotesk'
                sx={{
                  fontSize: {
                    xs: '12px', // for small screens
                    sm: '14px',
                    md: '16px' // default
                  }
                }}
              >
                136.00 USD
              </Typography>
            </Box>

            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              //   py={2}
            >
              <Typography
                variant='subtitle2'
                fontWeight={400}
                fontSize={16}
                color='#515151'
                fontFamily='Space Grotesk'
                sx={{
                  fontSize: {
                    xs: '12px', // for small screens
                    sm: '14px',
                    md: '16px' // default
                  }
                }}
              >
                Total Due:
              </Typography>

              <Typography
                variant='subtitle2'
                fontWeight={400}
                color='#515151'
                fontSize={16}
                fontFamily='Space Grotesk'
                sx={{
                  fontSize: {
                    xs: '12px', // for small screens
                    sm: '14px',
                    md: '16px' // default
                  }
                }}
              >
                129.00 USD
              </Typography>
            </Box>

            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              py={2}
            >
              <Typography
                variant='subtitle2'
                fontWeight={500}
                fontSize={20}
                color='#000'
                fontFamily='Space Grotesk'
                sx={{
                  fontSize: {
                    xs: '14px', // for small screens
                    sm: '16px',
                    md: '20px' // default
                  }
                }}
              >
                Excess:
              </Typography>

              <Typography
                variant='subtitle2'
                fontWeight={500}
                color='#000'
                fontSize={20}
                fontFamily='Space Grotesk'
                sx={{
                  fontSize: {
                    xs: '14px', // for small screens
                    sm: '16px',
                    md: '20px' // default
                  }
                }}
              >
                07.00 USD
              </Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box
              mt={1}
              mb={2}
              borderRadius={2}
              display='flex'
              alignItems='center'
              bgcolor={'#F5F8FF'}
              gap={1}
              px={2}
              py={1}
            >
              <DoneIcon
                sx={{
                  fontSize: 17,
                  color: '#12B76A'
                }}
              />
              <Typography
                fontSize={14}
                color={'#515151'}
                fontFamily='Space Grotesk'
                textAlign='justify'
                fontWeight={500}
              >
                Excess amount will be refunded to your Wallet of the store you
                purchased from.
              </Typography>
            </Box>

            <Box display='flex' gap={2} mb={2}>
              <Button
                fullWidth
                variant='outlined'
                sx={{
                  borderColor: '#4F46E5',
                  color: '#4F46E5',
                  textTransform: 'none',
                  borderRadius: 30,
                  paddingTop: 2,
                  paddingBottom: 2,
                  '&:hover': {
                    backgroundColor: '#EEF2FF',
                    borderColor: '#4F46E5'
                  }
                }}
                endIcon={<span style={{ fontSize: '1.2rem' }}>→</span>}
              >
                Go to Website
              </Button>
            </Box>
          </Box>

          <Box
            display='flex'
            justifyContent='space-between'
            // alignItems='center'
            mt={3}
          >
            {/* Left text */}
            <Typography
              variant='caption'
              color='#515151'
              fontWeight={400}
              fontSize={12}
              sx={{ textAlign: 'left' }}
            >
              If you need to continue later, save your {'\n'} Transaction ID:
            </Typography>

            {/* Right part: ID and copy icon */}
            <Box display='flex' alignItems='center' gap={1}>
              <Typography
                variant='caption'
                fontWeight={400}
                fontSize={12}
                color='#515151'
              >
                #ABC123456
              </Typography>

              <IconButton
                size='small'
                sx={{
                  bgcolor: '#EEF2FF',
                  p: 0.5,
                  borderRadius: 2,
                  '&:hover': { bgcolor: '#E0E7FF' }
                }}
              >
                <CopyIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  )
}

export default OverPayment
