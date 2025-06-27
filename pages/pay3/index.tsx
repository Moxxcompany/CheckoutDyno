import axiosBaseApi from '@/axiosConfig'

import paymentAuth from '@/Components/Page/Common/HOC/paymentAuth'
import BankAccountComponent from '@/Components/Page/Payment/BankAccountComponent'
import BankTransferComponent from '@/Components/Page/Payment/BankTransferComponent'

import CardComponent from '@/Components/Page/Payment/CardComponent'
import GooglePayComponent from '@/Components/Page/Payment/GooglePayComponent'
import MobileMoneyComponent from '@/Components/Page/Payment/MobileMoneyComponent'
import QRCodeComponent from '@/Components/Page/Payment/QRCodeComponent'
import USSDComponent from '@/Components/Page/Payment/USSDComponent'
import { createEncryption } from '@/helpers'
import useTokenData from '@/hooks/useTokenData'
import { paymentTypes } from '@/utils/enums'
import { rootReducer } from '@/utils/types'
import {
  CommonApiRes,
  CommonDetails,
  transferDetails
} from '@/utils/types/paymentTypes'

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
  WalletRounded
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
  useTheme
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import 'react-credit-cards-2/dist/es/styles-compiled.css'
import { useDispatch, useSelector } from 'react-redux'
import CyrptoComponent from '../../Components/Page/Payment/CryptoComponent'
import BrandLogo from '@/Components/BrandLogo'
import { walletState } from '../../utils/types/paymentTypes'
import Loading from '@/Components/UI/Loading'
import { useRouter } from 'next/router'
import { TOAST_SHOW } from '@/Redux/Actions/ToastAction'
import jwt from 'jsonwebtoken'
import WalletComponent from '@/Components/Page/Payment/WalletComponent'
import Header from './header'
import ProgressBar from '@/Components/UI/ProgressBar'
import Image from 'next/image'
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin'
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload'
import Footer from '@/Components/UI/Footer'

import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import FloatingChatButton from '@/Components/UI/ChatButton'

import FileCopyIcon from '@mui/icons-material/FileCopy'
import BankTransferCompo from './bankTransferCompo'

const paymentMethods = [
  {
    label: 'Bank Transfer (NGN)',
    value: paymentTypes.BANK_TRANSFER,
    icon: <AccountBalanceRounded />
  },
  {
    label: 'Crypto',
    value: paymentTypes.CRYPTO,
    icon: <CurrencyBitcoinRounded />
  }
]

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

const Payment = () => {
  const theme = useTheme()

  const router = useRouter()
  const dispatch = useDispatch()
  const [paymentType, setPaymentType] = useState(paymentTypes.CARD)
  const [payLoading, setPayloading] = useState(false)
  const [paymentMode, setPaymentMode] = useState('payment')
  const [allowedModes, setAllowedModes] = useState<any[]>([])
  const [accountDetails, setAccountDetails] = useState<CommonDetails>()
  const [selectedCurrency, setSelectedCurrency] = useState('USD')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const [tokenData, setTokenData] = useState({ email: '' })
  const [walletState, setWalletState] = useState<walletState>({
    amount: 0,
    currency: 'USD'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (
      paymentType === paymentTypes.GOOGLE_PAY ||
      paymentType === paymentTypes.APPLE_PAY
    ) {
      initiateGoogleApplyPayTransfer()
    }
  }, [paymentType])

  useEffect(() => {
    if (router.query && router.query?.d) {
      getQueryData()
    } else {
      setLoading(false)
    }
  }, [router.query])

  const getQueryData = async () => {
    try {
      const query_data = router.query.d
      const {
        data: { data }
      }: { data: any } = await axiosBaseApi.post('pay/getData', {
        data: query_data
      })
      setWalletState({
        amount: 20,
        currency: 'USD'
      })
      setPaymentMode(data.payment_mode)
      if (data?.payment_mode === 'createLink') {
        setAllowedModes(data?.allowedModes?.split(','))
      }

      localStorage.setItem('token', data.token)
      const tempToken: any = jwt.decode(data.token)
      setTokenData(tempToken)
      setLoading(false)
    } catch (e: any) {
      setLoading(false)
      const message = e.response.data.message ?? e.message
      dispatch({
        type: TOAST_SHOW,
        payload: {
          message: message,
          severity: 'error'
        }
      })
    }
  }

  const initiateGoogleApplyPayTransfer = async () => {
    const finalPayload = {
      paymentType,
      currency: walletState.currency,
      amount: walletState.amount
    }
    setPayloading(true)
    const res = createEncryption(JSON.stringify(finalPayload))

    const {
      data: { data }
    }: { data: CommonApiRes } = await axiosBaseApi.post('pay/addPayment', {
      data: res
    })
    setPayloading(false)
    setAccountDetails(data)
  }

  const [darkMode, setDarkMode] = useState(false)
  const [activeStep, setActiveStep] = useState<number>(0)

  const toggleDarkMode = () => setDarkMode(!darkMode)

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

  const isOpen = Boolean(anchorEl)

  const basePriceUSD = 129.0
  const selected = currencyOptions.find(c => c.code === selectedCurrency)
  const convertedPrice = (basePriceUSD * (selected?.rate || 1)).toFixed(2)

  return (
    <Box sx={{ height: '100vh' }}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Box
        sx={{
          height: 'calc(100vh - 197px)',
          overflowY: 'auto',
        }}
      >
        <ProgressBar activeStep={activeStep} />

        {activeStep === 0 ? (
          <Box
            display='flex'
            alignItems='center'
            justifyContent='center'
            bgcolor='#F8FAFC'
            px={2}
            // marginTop="50px"
          >
            <Paper
              elevation={3}
              sx={{
                borderRadius: 4,
                p: 4,
                width: '100%',
                maxWidth: 450,
                marginTop: 10,
                textAlign: 'center',
                margin: 0,
                border: '1px solid #E7EAFD',
                boxShadow: '0px 45px 64px 0px #0D03230F'
              }}
            >
              <Box display='flex' justifyContent='center' mb={2}>
                <Image src='/Logo2.png' alt='Logo' width={48} height={48} />
              </Box>

              <Typography variant='h6' fontWeight={600} gutterBottom>
                Your order is almost complete!
              </Typography>

              <Typography variant='body2' color='text.secondary' mb={3}>
                Choose a payment method below to finalize your transaction:
              </Typography>

              <Box
                alignItems='center'
                border='1px solid #E2E8F0'
                borderRadius={2}
                px={1}
                // py={1.5}
                mb={2}
              >
                <Box
                  display='flex'
                  justifyContent='space-between'
                  alignItems='center'
                  py={2}
                >
                  <Typography variant='subtitle2' fontWeight={500}>
                    To Pay:
                  </Typography>
                  <Box
                    display='flex'
                    alignItems='center'
                    border={1}
                    borderRadius={'6px'}
                    padding={1}
                    gap={1}
                    sx={{
                      cursor: 'pointer',
                      borderColor: 'transparent',
                      '&:hover': {
                        borderColor: '#737373' // or any hover color
                      }
                    }}
                    onClick={handleClick}
                  >
                    {selected?.icon}
                    <Typography fontWeight={600}>
                      {convertedPrice} {selected?.code}
                    </Typography>
                    {isOpen ? (
                      <ArrowDropUp fontSize='small' />
                    ) : (
                      <ArrowDropDown fontSize='small' />
                    )}

                    <Menu
                      anchorEl={anchorEl}
                      open={isOpen}
                      onClose={handleClose}
                      PaperProps={{
                        sx: {
                          border: '1px solid #737373',
                          borderRadius: '10px'
                        }
                      }}
                    >
                      {currencyOptions.map(currency => (
                        <MenuItem
                          key={currency.code}
                          onClick={e => handleSelect(e, currency.code)}
                        >
                          <Box display='flex' alignItems='center' gap={1}>
                            {currency.icon}
                            <Typography sx={{ fontSize: '14px' }}>
                              {currency.label}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box display='flex' gap={2} mb={2}>
                  <Button
                    fullWidth
                    variant='outlined'
                    startIcon={<AssuredWorkloadIcon />}
                    onClick={() => setActiveStep(1)}
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
                  >
                    Bank Transfer
                  </Button>

                  <Button
                    fullWidth
                    variant='outlined'
                    startIcon={<CurrencyBitcoinIcon />}
                    onClick={() => setActiveStep(1)}
                    sx={{
                      borderColor: '#10B981',
                      color: '#10B981',
                      textTransform: 'none',
                      borderRadius: 30,
                      paddingTop: 2,
                      paddingBottom: 2,
                      '&:hover': {
                        backgroundColor: '#ECFDF5',
                        borderColor: '#10B981'
                      }
                    }}
                  >
                    Cryptocurrency
                  </Button>
                </Box>
              </Box>

              {/* <Divider sx={{ mb: 2 }} /> */}

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
                  sx={{ textAlign: 'left' }}
                >
                  If you need to continue later, save your {'\n'} Transaction
                  ID:
                </Typography>

                {/* Right part: ID and copy icon */}
                <Box display='flex' alignItems='center' gap={1}>
                  <Typography
                    variant='caption'
                    fontWeight={600}
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
                    <FileCopyIcon fontSize='small' sx={{ color: '#4F46E5' }} />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          </Box>
        ) : activeStep === 1 ? (
          <BankTransferCompo />
        ) : null}

        <Box sx={{ position: 'absolute', bottom: 0, width: '100%' }}>
          <Footer />
        </Box>
      </Box>

      <FloatingChatButton />
    </Box>
  )
}

export default paymentAuth(Payment)
// export default Payment;
