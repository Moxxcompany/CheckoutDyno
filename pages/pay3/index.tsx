import axiosBaseApi from '@/axiosConfig'

import paymentAuth from '@/Components/Page/Common/HOC/paymentAuth'
import { createEncryption } from '@/helpers'
import useTokenData from '@/hooks/useTokenData'
import { paymentTypes } from '@/utils/enums'
import { rootReducer } from '@/utils/types'
import {
  CommonApiRes,
  CommonDetails,
  currencyData,
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
  useMediaQuery,
  useTheme
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import 'react-credit-cards-2/dist/es/styles-compiled.css'
import { useDispatch, useSelector } from 'react-redux'
import CyrptoComponent from '../../Components/Page/Payment/CryptoComponent'
import BrandLogo from '@/Components/BrandLogo'
import { walletState } from '../../utils/types/paymentTypes'

import { useRouter } from 'next/router'
import { TOAST_SHOW } from '@/Redux/Actions/ToastAction'
import jwt from 'jsonwebtoken'
import WalletComponent from '@/Components/Page/Payment/WalletComponent'
import ProgressBar from '@/Components/UI/ProgressBar'
import Image from 'next/image'
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin'
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload'
import Footer from '@/Components/UI/Footer'

import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import FloatingChatButton from '@/Components/UI/ChatButton'

import FileCopyIcon from '@mui/icons-material/FileCopy'
import TransferExpectedCard from '@/Components/UI/TransferExpectedCard/Index'
import CopyIcon from '@/assets/Icons/CopyIcon'
import UnderPayment from '@/Components/UI/UnderPayment/Index'
import OverPayment from '@/Components/UI/OverPayment/Index'
import { Icon } from '@iconify/react'
import BitCoinGreenIcon from '@/assets/Icons/BitCoinGreenIcon'
import Loading from '@/Components/UI/Loading/Index'
import Logo from '@/assets/Icons/Logo'
import CryptoTransfer from '@/Components/Page/Pay3Components/cryptoTransfer'
import BankTransferCompo from '@/Components/Page/Pay3Components/bankTransferCompo'
import Pay3Layout from './layout'

const currencyOptions = [
  {
    code: 'USD',
    label: 'United States Dollar (USD)',
    icon: <Icon icon='circle-flags:us-um' width={20} />,
    currency: 'USD'
  },
  {
    code: 'EUR',
    label: 'Euro (EUR)',
    icon: <Icon icon='circle-flags:european-union' width={20} />,
    currency: 'EUR'
  },
  {
    code: 'NGN',
    label: 'Nigerian Naira (NGN)',
    icon: <Icon icon='circle-flags:ng' width={20} />,
    currency: 'NGN'
  }
]

const Payment = () => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const router = useRouter()
  const dispatch = useDispatch()
  const [paymentType, setPaymentType] = useState(paymentTypes.CARD)
  const [payLoading, setPayloading] = useState(false)
  const [paymentMode, setPaymentMode] = useState('payment')
  const [allowedModes, setAllowedModes] = useState<any[]>([])
  const [accountDetails, setAccountDetails] = useState<CommonDetails>()
  const [selectedCurrency, setSelectedCurrency] = useState('USD')
  const [currencyRates, setCurrencyRates] = useState<currencyData>()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [activeStep, setActiveStep] = useState<number>(0)
  const [tokenData, setTokenData] = useState({ email: '' })
  const [walletState, setWalletState] = useState<walletState>({
    amount: 0,
    currency: 'USD'
  })
  const [transferMethod, setTransferMethod] = useState('')
  const [loading, setLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)

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
        amount: data.amount,
        currency: data.base_currency
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
      const message = e?.response?.data?.message ?? e.message
      dispatch({
        type: TOAST_SHOW,
        payload: {
          message: message,
          severity: 'error'
        }
      })
    }
  }

  const getCurrencyRate = async (selectedCurrency: string) => {
    try {
      const {
        data: { data }
      } = await axiosBaseApi.post('/pay/getCurrencyRates', {
        source: walletState?.currency,
        amount: walletState?.amount,
        currencyList: [selectedCurrency],
        fixedDecimal: false
      })
      setCurrencyRates(data[0])
      setSelectedCurrency(selectedCurrency)
      setLoading(false)
    } catch (e: any) {
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
    getCurrencyRate(code)
    handleClose()
  }

  const isOpen = Boolean(anchorEl)

  return (
    <Pay3Layout>
      <Box>
        <Box>
          <ProgressBar activeStep={activeStep} />

          {activeStep === 0 ? (
            <Box
              display='flex'
              alignItems='center'
              justifyContent='center'
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
                  <Logo />
                </Box>

                <Typography
                  fontWeight={500}
                  fontSize={25}
                  lineHeight='98%'
                  gutterBottom
                  fontFamily='Space Grotesk'
                >
                  Your order is almost complete!
                </Typography>

                <Typography
                  color='#000'
                  fontWeight={400}
                  fontSize={14}
                  lineHeight='18px'
                  mb={3}
                  fontFamily='Space Grotesk'
                >
                  <span>
                    Choose a payment method below to finalize
                    <br />
                    your transaction:
                  </span>
                </Typography>

                <Box
                  alignItems='center'
                  border='1px solid #DFDFDF'
                  borderRadius={'10px'}
                  px='21px'
                  py='18px'
                >
                  <Box
                    display='flex'
                    justifyContent='space-between'
                    alignItems='center'
                    mb={2}
                  >
                    <Typography
                      variant='subtitle2'
                      fontFamily='Space Grotesk'
                      fontWeight={500}
                      fontSize={20}
                    >
                      To Pay:
                    </Typography>

                    <Box
                      display='flex'
                      alignItems='center'
                      border={1}
                      borderRadius='6px'
                      padding={1}
                      gap={1}
                      sx={{
                        cursor: 'pointer',
                        borderColor: isOpen ? '#737373' : "transparent",
                        '&:hover': {
                          border: '1px solid #D9D9D9'
                        },
                        '&:active': {
                          border: '1px solid #737373'
                        }
                      }}
                      onClick={handleClick}
                    >
                      {currencyOptions?.find(
                        c => c.code === currencyRates?.currency
                      )?.icon ||
                        currencyOptions.find(
                          c => c.code === walletState?.currency
                        )?.icon}

                      <Typography
                        fontWeight={500}
                        fontFamily='Space Grotesk'
                        fontSize={25}
                      >
                        {Number(
                          currencyRates?.amount ?? walletState?.amount
                        ).toFixed(2)}{' '}
                        {currencyRates?.currency ?? walletState?.currency}
                      </Typography>

                      <Icon
                        icon={isOpen ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'}
                        width="17"
                        height="17"
                      />

                      <Menu
                        anchorEl={anchorEl}
                        open={isOpen}
                        onClose={handleClose}
                        PaperProps={{
                          sx: {
                            border: '1px solid #737373',
                            borderRadius: '10px',
                            // padding: '15px',
                            marginTop:'10px',
                            py: '4px',
                              px:'10px',
                          }
                        }}
                      >
                        {currencyOptions.map(currency => (
                          <MenuItem
                            key={currency.code}
                            onClick={e => handleSelect(e, currency.code)}
                            sx={{
                              padding:'10px',
                              borderRadius: '6px',
                              '&:hover': {
                                backgroundColor: '#F5F8FF'
                              },
                            }}
                          >
                            <Box display='flex' alignItems='center' gap={1}>
                              {currency.icon}
                              <Typography
                                sx={{
                                  fontSize: '14px',
                                  fontWeight:'500'
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

                  <Box display='flex' gap={2} mb={2}>
                    <Button
                      fullWidth
                      variant='outlined'
                      startIcon={<Icon icon='mingcute:bank-line' width='16' />}
                      onClick={() => {
                        setActiveStep(1)
                        setTransferMethod('bank')
                      }}
                      sx={{
                        borderColor: '#444CE7',
                        color: '#444CE7',
                        textTransform: 'none',
                        fontFamily: 'Space Grotesk',
                        fontWeight: '500',
                        borderRadius: 30,
                        py: {
                          xs: 1.2,
                        },
                        fontSize: '14px',
                        minHeight: 48,
                        '&:hover': {
                          backgroundColor: '#EEF2FF',
                          borderColor: '#444CE7'
                        }
                      }}
                    >
                      {isSmallScreen ? 'Bank' : 'Bank Transfer'}
                    </Button>

                    <Button
                      fullWidth
                      variant='outlined'
                      startIcon={<BitCoinGreenIcon width={8.25} />}
                      onClick={() => {
                        setActiveStep(1)
                        setTransferMethod('crypto')
                      }}
                      sx={{
                        borderColor: '#12B76A',
                        color: '#12B76A',
                        textTransform: 'none',
                        borderRadius: 30,
                        fontFamily: 'Space Grotesk',
                        py: {
                          xs: 1.2,
                        },
                        fontSize: '14px',
                        minHeight: 48,
                        '&:hover': {
                          backgroundColor: '#ECFDF5',
                          borderColor: '#12B76A'
                        }
                      }}
                    >
                      {isSmallScreen ? 'Crypto' : 'Cryptocurrency'}
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
                    If you need to continue later, save your {'\n'} Transaction
                    ID:
                  </Typography>

                  {/* Right part: ID and copy icon */}
                  <Box display='flex' alignItems='center' gap={1}>
                    <Typography
                      variant='caption'
                      fontWeight={500}
                      fontSize={12}
                      color='#515151'
                    >
                      #ABC123456
                    </Typography>
                    <Tooltip title='Copy'>
                      <IconButton
                        size='small'
                        sx={{
                          bgcolor: '#E7EAFD',
                          p: 0.5,
                          height: '24px',
                          width: '24px',
                          borderRadius: '5px',
                          '&:hover': { bgcolor: '#E0E7FF' }
                        }}
                      >
                        <CopyIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Paper>
            </Box>
          ) : // <UnderPayment/>
          // <OverPayment/>
          activeStep === 1 ? (
            transferMethod === 'bank' ? (
              <BankTransferCompo
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                walletState={walletState}
                setIsSuccess={setIsSuccess}
              />
            ) : (
              <CryptoTransfer
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                walletState={walletState}
              />
            )
          ) : activeStep === 2 ? (
            <TransferExpectedCard isTrue={isSuccess} type={'bank'} />
          ) : null}
        </Box>
        <FloatingChatButton />
      </Box>
    </Pay3Layout>
  )
}

export default paymentAuth(Payment)
// export default Payment;
