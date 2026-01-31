import axiosBaseApi from '@/axiosConfig'

import paymentAuth from '@/Components/Page/Common/HOC/paymentAuth'
import { createEncryption } from '@/helpers'
import { paymentTypes } from '@/utils/enums'
import {
  CommonApiRes,
  CommonDetails,
  currencyData
} from '@/utils/types/paymentTypes'
import {
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Skeleton,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  Snackbar
} from '@mui/material'
import React, { useEffect, useState, useCallback } from 'react'
import 'react-credit-cards-2/dist/es/styles-compiled.css'
import { useDispatch } from 'react-redux'
import { walletState } from '../../utils/types/paymentTypes'

import { useRouter } from 'next/router'
import { TOAST_SHOW } from '@/Redux/Actions/ToastAction'
import jwt from 'jsonwebtoken'
import ProgressBar from '@/Components/UI/ProgressBar'

import FloatingChatButton from '@/Components/UI/ChatButton'

import TransferExpectedCard from '@/Components/UI/TransferExpectedCard/Index'
import CopyIcon from '@/assets/Icons/CopyIcon'
import { Icon } from '@iconify/react'
import BitCoinGreenIcon from '@/assets/Icons/BitCoinGreenIcon'
import Logo from '@/assets/Icons/Logo'
import CryptoTransfer from '@/Components/Page/Pay3Components/cryptoTransfer'
import BankTransferCompo from '@/Components/Page/Pay3Components/bankTransferCompo'
import Pay3Layout from '@/Components/Layout/Pay3Layout'
import Image from 'next/image'
import USDIcon from '../../assets/Icons/flag/USD.png'
import EURIcon from '../../assets/Icons/flag/EUR.png'
import NGNIcon from '../../assets/Icons/flag/NGN.png'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetServerSideProps } from 'next'

// Types for enhanced checkout data
interface FeeInfo {
  processing_fee: number
  fee_payer: 'customer' | 'merchant'
}

interface TaxInfo {
  rate: number
  amount: number
  country: string
  type: string
}

interface ExpiryInfo {
  countdown: string
  expires_at: string
}

interface MerchantInfo {
  name: string
  company_logo: string | null
}

export const currencyOptions = [
  {
    code: 'USD',
    labelKey: 'currency.USD',
    icon: <Image src={USDIcon} alt='USD' width={20} height={20} />,
    currency: 'USD'
  },
  {
    code: 'EUR',
    labelKey: 'currency.EUR',
    icon: <Image src={EURIcon} alt='EUR' width={20} height={20} />,
    currency: 'EUR'
  },
  {
    code: 'NGN',
    labelKey: 'currency.NGN',
    icon: <Image src={NGNIcon} alt='NGN' width={20} height={20} />,
    currency: 'NGN'
  }
]

const Payment = () => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const router = useRouter()
  const dispatch = useDispatch()
  const { t } = useTranslation('common')
  
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
  const [isBank, setIsBank] = useState()
  const [feePayer, setFeePayer] = useState<string>('')
  const [linkId, setLinkId] = useState<string>('')
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null)

  // Enhanced checkout state variables
  const [description, setDescription] = useState<string>('')
  const [orderReference, setOrderReference] = useState<string>('')
  const [feeInfo, setFeeInfo] = useState<FeeInfo | null>(null)
  const [taxInfo, setTaxInfo] = useState<TaxInfo | null>(null)
  const [expiryInfo, setExpiryInfo] = useState<ExpiryInfo | null>(null)
  const [merchantInfo, setMerchantInfo] = useState<MerchantInfo | null>(null)
  const [countdown, setCountdown] = useState<string>('')
  const [copySnackbar, setCopySnackbar] = useState(false)

  // Countdown timer effect
  useEffect(() => {
    if (!expiryInfo?.expires_at) return

    const updateCountdown = () => {
      const now = new Date().getTime()
      const expiry = new Date(expiryInfo.expires_at).getTime()
      const diff = expiry - now

      if (diff <= 0) {
        setCountdown('Expired')
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      const parts = []
      if (days > 0) parts.push(`${days}${t('checkout.days')}`)
      if (hours > 0 || days > 0) parts.push(`${hours}${t('checkout.hours')}`)
      if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}${t('checkout.minutes')}`)
      parts.push(`${seconds}${t('checkout.seconds')}`)

      setCountdown(parts.join(':'))
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [expiryInfo, t])

  useEffect(() => {
    if (
      paymentType === paymentTypes.GOOGLE_PAY ||
      paymentType === paymentTypes.APPLE_PAY
    ) {
      initiateGoogleApplyPayTransfer()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentType])

  useEffect(() => {
    if (router.query && router.query?.d) {
      getQueryData()
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        amount: Number(data.amount),
        currency: data.base_currency
      })
      setPaymentMode(data.payment_mode)
      if (data?.payment_mode === 'createLink') {
        setAllowedModes(data?.allowedModes?.split(','))
      }

      localStorage.setItem('token', data.token)
      const tempToken: any = jwt.decode(data.token)
      setTokenData(tempToken)
      setFeePayer(data.fee_payer || '')
      setLinkId(tempToken?.transaction_id || '')
      setRedirectUrl(data.redirect_url || null)

      // Capture enhanced checkout fields from backend
      setDescription(data.description || '')
      setOrderReference(data.order_reference || '')
      
      if (data.fee_info) {
        setFeeInfo({
          processing_fee: data.fee_info.processing_fee || 0,
          fee_payer: data.fee_info.fee_payer || data.fee_payer || 'merchant'
        })
      } else if (data.fee_payer) {
        setFeeInfo({
          processing_fee: 0,
          fee_payer: data.fee_payer
        })
      }
      
      if (data.tax_info) {
        setTaxInfo({
          rate: data.tax_info.rate || 0,
          amount: data.tax_info.amount || 0,
          country: data.tax_info.country || '',
          type: data.tax_info.type || 'VAT'
        })
      }
      
      if (data.expiry) {
        setExpiryInfo({
          countdown: data.expiry.countdown || '',
          expires_at: data.expiry.expires_at || ''
        })
      }
      
      if (data.merchant) {
        setMerchantInfo({
          name: data.merchant.name || data.merchant.company_name || '',
          company_logo: data.merchant.company_logo || null
        })
      }
      
      const amount = Number(data.amount)
      if (amount && data.base_currency) {
        try {
          const ratesResponse = await axiosBaseApi.post('/pay/getCurrencyRates', {
            source: data.base_currency,
            amount: amount,
            currencyList: [data.base_currency],
            fixedDecimal: false,
            fee_payer: data.fee_payer || undefined
          });
          console.log('Rates response:', ratesResponse?.data);
          if (ratesResponse?.data?.data && ratesResponse.data.data[0]) {
            setCurrencyRates(ratesResponse.data.data[0]);
            console.log('Set currencyRates to:', ratesResponse.data.data[0]);
          }
        } catch (rateError: any) {
          console.log('Failed to fetch initial rates:', rateError?.message);
        }
      }
      
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
        fixedDecimal: false,
        fee_payer: feePayer
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
      setAnchorEl(null)
    } else {
      setAnchorEl(event.currentTarget)
    }
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSelect = (event: React.MouseEvent, code: string) => {
    getCurrencyRate(code)
    handleClose()
  }

  const handleCopyInvoice = useCallback(() => {
    if (orderReference) {
      navigator.clipboard.writeText(orderReference)
      setCopySnackbar(true)
    }
  }, [orderReference])

  const handleCopyTransactionId = useCallback(() => {
    if (linkId) {
      navigator.clipboard.writeText(linkId)
      setCopySnackbar(true)
    }
  }, [linkId])

  // Calculate display values
  const subtotalAmount = walletState?.amount || 0
  const processingFee = feeInfo?.processing_fee || 0
  const taxAmount = taxInfo?.amount || 0
  const totalAmount = currencyRates?.total_amount_source ?? currencyRates?.amount ?? walletState?.amount
  const displayCurrency = currencyRates?.currency ?? walletState?.currency

  // Get context-aware title
  const getTitle = () => {
    if (description) return t('checkout.title')
    if (merchantInfo?.name) return t('checkout.titleComplete')
    return t('checkout.titleCheckout')
  }

  // Get subtitle with merchant name
  const getSubtitle = () => {
    if (merchantInfo?.name) {
      return t('checkout.subtitle', { merchant: merchantInfo.name })
    }
    return t('checkout.subtitleDefault')
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
                data-testid="checkout-card"
                sx={{
                  borderRadius: 4,
                  p: { xs: 2.5, sm: 4 },
                  width: '100%',
                  maxWidth: 500,
                  marginTop: 10,
                  textAlign: 'center',
                  margin: 0,
                  border: `1px solid ${isDark ? theme.palette.surface.border : '#E7EAFD'}`,
                  boxShadow: isDark 
                    ? '0px 45px 64px 0px rgba(0,0,0,0.3)' 
                    : '0px 45px 64px 0px #0D03230F',
                  backgroundColor: theme.palette.background.paper,
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Logo Section - Merchant logo or DynoPay */}
                <Box display='flex' justifyContent='center' mb={2}>
                  {merchantInfo?.company_logo ? (
                    <Box
                      component="img"
                      src={merchantInfo.company_logo}
                      alt={merchantInfo.name || 'Merchant'}
                      sx={{
                        maxHeight: 50,
                        maxWidth: 150,
                        objectFit: 'contain'
                      }}
                      onError={(e: any) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <Logo />
                  )}
                </Box>

                {/* Context-Aware Title */}
                <Typography
                  fontWeight={500}
                  fontSize={{ xs: 20, sm: 25 }}
                  lineHeight='98%'
                  gutterBottom
                  fontFamily='Space Grotesk'
                  color={theme.palette.text.primary}
                  data-testid="checkout-title"
                >
                  {getTitle()}
                </Typography>

                {/* Dynamic Subtitle with Merchant Name */}
                <Typography
                  color={isDark ? theme.palette.text.secondary : '#000'}
                  fontWeight={400}
                  fontSize={14}
                  lineHeight='18px'
                  mb={3}
                  fontFamily='Space Grotesk'
                  data-testid="checkout-subtitle"
                >
                  {getSubtitle()}
                </Typography>

                {/* Order Details Section */}
                {(description || orderReference) && (
                  <Box
                    sx={{
                      border: `1px solid ${isDark ? theme.palette.surface.border : '#E7EAFD'}`,
                      borderRadius: '10px',
                      p: 2,
                      mb: 2,
                      textAlign: 'left',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#FAFBFF'
                    }}
                    data-testid="order-details-section"
                  >
                    <Typography
                      fontWeight={600}
                      fontSize={11}
                      color={isDark ? theme.palette.text.secondary : '#666'}
                      fontFamily='Space Grotesk'
                      letterSpacing={0.5}
                      mb={1}
                    >
                      {t('checkout.orderDetails')}
                    </Typography>
                    
                    {description && (
                      <Typography
                        fontWeight={500}
                        fontSize={14}
                        color={theme.palette.text.primary}
                        fontFamily='Space Grotesk'
                        mb={orderReference ? 1.5 : 0}
                      >
                        {description}
                      </Typography>
                    )}
                    
                    {orderReference && (
                      <Box display='flex' alignItems='center' justifyContent='space-between'>
                        <Box>
                          <Typography
                            fontWeight={600}
                            fontSize={10}
                            color={isDark ? theme.palette.text.secondary : '#888'}
                            fontFamily='Space Grotesk'
                            letterSpacing={0.5}
                          >
                            {t('checkout.invoice')}
                          </Typography>
                          <Typography
                            fontWeight={500}
                            fontSize={13}
                            color={theme.palette.text.primary}
                            fontFamily='Space Grotesk'
                            data-testid="invoice-number"
                          >
                            {orderReference}
                          </Typography>
                        </Box>
                        <Tooltip title={t('checkout.copyInvoice')}>
                          <IconButton
                            size='small'
                            onClick={handleCopyInvoice}
                            data-testid="copy-invoice-btn"
                            sx={{
                              bgcolor: isDark ? '#2a2a4a' : '#E7EAFD',
                              p: 0.75,
                              borderRadius: '6px',
                              '&:hover': { bgcolor: isDark ? '#3a3a5a' : '#E0E7FF' }
                            }}
                          >
                            <CopyIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </Box>
                )}

                {/* Fee Breakdown Section */}
                <Box
                  alignItems='center'
                  border={`1px solid ${isDark ? theme.palette.surface.border : '#DFDFDF'}`}
                  borderRadius={'10px'}
                  px='21px'
                  py='18px'
                  sx={{ transition: 'border-color 0.3s ease' }}
                  data-testid="fee-breakdown-section"
                >
                  {/* Subtotal Row */}
                  {(feeInfo || taxInfo) && (
                    <>
                      <Box display='flex' justifyContent='space-between' alignItems='center' mb={1}>
                        <Typography
                          fontSize={14}
                          fontFamily='Space Grotesk'
                          color={isDark ? theme.palette.text.secondary : '#666'}
                        >
                          {t('checkout.subtotal')}
                        </Typography>
                        <Typography
                          fontSize={14}
                          fontFamily='Space Grotesk'
                          fontWeight={500}
                          color={theme.palette.text.primary}
                        >
                          {loading ? (
                            <Skeleton width={60} height={20} />
                          ) : (
                            `${subtotalAmount.toFixed(2)} ${walletState?.currency}`
                          )}
                        </Typography>
                      </Box>

                      {/* Processing Fee Row - Always show if fee exists */}
                      {feeInfo && feeInfo.processing_fee > 0 && (
                        <Box display='flex' justifyContent='space-between' alignItems='center' mb={1}>
                          <Box display='flex' alignItems='center' gap={0.5}>
                            <Typography
                              fontSize={14}
                              fontFamily='Space Grotesk'
                              color={isDark ? theme.palette.text.secondary : '#666'}
                            >
                              {t('checkout.processingFee')}
                            </Typography>
                            {feeInfo.fee_payer === 'merchant' && (
                              <Icon icon="mdi:check-circle" color="#12B76A" width={14} />
                            )}
                          </Box>
                          <Box display='flex' alignItems='center' gap={0.5}>
                            <Typography
                              fontSize={14}
                              fontFamily='Space Grotesk'
                              fontWeight={500}
                              color={theme.palette.text.primary}
                            >
                              {processingFee.toFixed(2)} {walletState?.currency}
                            </Typography>
                          </Box>
                        </Box>
                      )}

                      {/* Fee Payer Indicator */}
                      {feeInfo && feeInfo.processing_fee > 0 && (
                        <Box display='flex' alignItems='center' mb={1} gap={0.5}>
                          <Typography
                            fontSize={12}
                            fontFamily='Space Grotesk'
                            color={feeInfo.fee_payer === 'merchant' ? '#12B76A' : (isDark ? theme.palette.text.secondary : '#666')}
                          >
                            {feeInfo.fee_payer === 'merchant' 
                              ? t('checkout.processingFeesIncluded')
                              : t('checkout.customerPaysFee', { defaultValue: 'Customer pays processing fee' })
                            }
                          </Typography>
                        </Box>
                      )}

                      {/* Tax Row */}
                      {taxInfo && taxInfo.amount > 0 && (
                        <Box display='flex' justifyContent='space-between' alignItems='center' mb={1}>
                          <Typography
                            fontSize={14}
                            fontFamily='Space Grotesk'
                            color={isDark ? theme.palette.text.secondary : '#666'}
                          >
                            {taxInfo.country 
                              ? t('checkout.vatRate', { rate: taxInfo.rate, country: taxInfo.country })
                              : t('checkout.tax')
                            }
                          </Typography>
                          <Typography
                            fontSize={14}
                            fontFamily='Space Grotesk'
                            fontWeight={500}
                            color={theme.palette.text.primary}
                          >
                            {taxAmount.toFixed(2)} {walletState?.currency}
                          </Typography>
                        </Box>
                      )}

                      <Divider sx={{ my: 1.5, borderColor: isDark ? theme.palette.surface.border : undefined }} />
                    </>
                  )}

                  {/* Total Row */}
                  <Box
                    display='flex'
                    justifyContent='space-between'
                    alignItems='center'
                    mb={2}
                  >
                    <Typography
                      variant='subtitle2'
                      fontFamily='Space Grotesk'
                      fontWeight={600}
                      fontSize={{ xs: 14, sm: 18 }}
                      color={theme.palette.text.primary}
                    >
                      {t('checkout.total')}
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
                        borderColor: isOpen ? (isDark ? '#6C7BFF' : '#737373') : 'transparent',
                        '&:hover': {
                          border: `1px solid ${isDark ? '#4a4a6a' : '#D9D9D9'}`
                        },
                        '&:active': {
                          border: `1px solid ${isDark ? '#6C7BFF' : '#737373'}`
                        }
                      }}
                      onClick={handleClick}
                      data-testid="currency-selector"
                    >
                      {!loading ? (
                        <>
                          {currencyOptions?.find(
                            c => c.code === currencyRates?.currency
                          )?.icon ||
                            currencyOptions.find(
                              c => c.code === walletState?.currency
                            )?.icon}

                          <Typography
                            fontWeight={600}
                            fontFamily='Space Grotesk'
                            fontSize={{ xs: 14, sm: 20 }}
                            color={theme.palette.text.primary}
                            data-testid="total-amount"
                          >
                            {Number(totalAmount).toFixed(2)}{' '}
                            {displayCurrency}
                          </Typography>
                          <Icon
                            icon={
                              isOpen
                                ? 'solar:alt-arrow-up-linear'
                                : 'solar:alt-arrow-down-linear'
                            }
                            width='17'
                            height='17'
                            color={theme.palette.text.primary}
                          />
                        </>
                      ) : (
                        <Skeleton
                          variant='rectangular'
                          width={154}
                          height={24}
                          animation='wave'
                          sx={{ 
                            borderRadius: '6px', 
                            background: isDark ? '#2a2a4a' : '#F5F8FF' 
                          }}
                        />
                      )}

                      <Menu
                        anchorEl={anchorEl}
                        open={isOpen}
                        onClose={handleClose}
                        PaperProps={{
                          sx: {
                            border: `1px solid ${isDark ? '#4a4a6a' : '#737373'}`,
                            borderRadius: '10px',
                            marginTop: '10px',
                            py: '4px',
                            px: '10px',
                            backgroundColor: theme.palette.background.paper,
                          }
                        }}
                      >
                        {currencyOptions.map(currency => (
                          <MenuItem
                            key={currency.code}
                            onClick={e => handleSelect(e, currency.code)}
                            sx={{
                              px: {
                                xs: 1.5,
                                sm: 2,
                                md: 2.5
                              },
                              py: {
                                xs: 1,
                                sm: 1.2,
                                md: 1.5
                              },
                              borderRadius: '6px',
                              '&:hover': {
                                backgroundColor: isDark ? '#2a2a4a' : '#F5F8FF'
                              }
                            }}
                          >
                            <Box display='flex' alignItems='center' gap={1}>
                              {currency.icon}
                              <Typography
                                color={theme.palette.text.primary}
                                sx={{
                                  fontSize: {
                                    xs: '14px',
                                    sm: '18px',
                                    md: '14px'
                                  },
                                  fontWeight: '500'
                                }}
                              >
                                {t(currency.labelKey)}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Menu>
                    </Box>
                  </Box>

                  <Divider sx={{ 
                    mb: 2, 
                    borderColor: isDark ? theme.palette.surface.border : undefined 
                  }} />

                  <Box display='flex' gap={2}>
                    <Button
                      fullWidth
                      variant='outlined'
                      startIcon={<BitCoinGreenIcon width={8.25} />}
                      onClick={() => {
                        setActiveStep(1)
                        setTransferMethod('crypto')
                      }}
                      data-testid="crypto-payment-btn"
                      sx={{
                        borderColor: '#12B76A',
                        color: '#12B76A',
                        textTransform: 'none',
                        borderRadius: 30,
                        fontFamily: 'Space Grotesk',
                        fontWeight: '500',
                        py: {
                          xs: 1.5,
                          sm: 2
                        },
                        fontSize: '16px',
                        minHeight: 56,
                        '&:hover': {
                          backgroundColor: isDark ? 'rgba(18, 183, 106, 0.1)' : '#ECFDF5',
                          borderColor: '#12B76A'
                        }
                      }}
                    >
                      {t('checkout.cryptocurrency')}
                    </Button>
                  </Box>
                </Box>

                {/* Expiry Countdown */}
                {countdown && countdown !== 'Expired' && (
                  <Box 
                    display='flex' 
                    alignItems='center' 
                    justifyContent='center' 
                    gap={1} 
                    mt={2}
                    data-testid="expiry-countdown"
                  >
                    <Icon icon="mdi:clock-outline" width={16} color={isDark ? theme.palette.text.secondary : '#666'} />
                    <Typography
                      fontSize={13}
                      fontFamily='Space Grotesk'
                      color={isDark ? theme.palette.text.secondary : '#666'}
                    >
                      {t('checkout.expiresIn')} <strong>{countdown}</strong>
                    </Typography>
                  </Box>
                )}

                {/* Transaction ID & Security Badge */}
                <Box mt={2}>
                  {/* Security Badge */}
                  <Box 
                    display='flex' 
                    alignItems='center' 
                    justifyContent='center' 
                    gap={0.5} 
                    data-testid="security-badge"
                  >
                    <Icon icon="mdi:lock" width={14} color={isDark ? '#6C7BFF' : '#444CE7'} />
                    <Typography
                      fontSize={12}
                      fontFamily='Space Grotesk'
                      color={isDark ? '#6C7BFF' : '#444CE7'}
                      fontWeight={500}
                    >
                      {t('checkout.securePayment')}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          ) : activeStep === 1 ? (
            transferMethod === 'bank' ? (
              <BankTransferCompo
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                walletState={walletState}
                setIsSuccess={setIsSuccess}
                setIsBank={setIsBank}
                redirectUrl={redirectUrl}
              />
            ) : (
              <CryptoTransfer
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                walletState={walletState}
                feePayer={feePayer}
                redirectUrl={redirectUrl}
              />
            )
          ) : activeStep === 2 ? (
            <TransferExpectedCard
              isTrue={isSuccess}
              dataUrl={isBank || ''}
              type={'bank'}
              redirectUrl={redirectUrl}
              transactionId={linkId}
              merchantName={merchantInfo?.name}
              amount={`${Number(totalAmount).toFixed(2)} ${displayCurrency}`}
              email={tokenData?.email}
            />
          ) : null}
        </Box>
        <FloatingChatButton />

        {/* Copy Success Snackbar */}
        <Snackbar
          open={copySnackbar}
          autoHideDuration={2000}
          onClose={() => setCopySnackbar(false)}
          message={t('checkout.copied')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Box>
    </Pay3Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  }
}

export default paymentAuth(Payment)
