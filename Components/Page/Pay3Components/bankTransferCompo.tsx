import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Paper,
  Tooltip,
  Typography
} from '@mui/material'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import { ArrowBack } from '@mui/icons-material'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import CopyIcon from '@/assets/Icons/CopyIcon'
import {
  BankTransferApiRes,
  currencyData,
  transferDetails,
} from '@/utils/types/paymentTypes'
import axiosBaseApi from '@/axiosConfig'
import { useDispatch } from 'react-redux'
import { TOAST_SHOW } from '@/Redux/Actions/ToastAction'
import { paymentTypes } from '@/utils/enums'
import { createEncryption, generateRedirectUrl } from '@/helpers'
import Loading from '@/Components/UI/Loading/Index'
import ClockIcon from '@/assets/Icons/ClockIcon'
import Warning from '@/assets/Icons/Warning'

interface BankTransferCompoProps {
  activeStep: number
  setActiveStep: React.Dispatch<React.SetStateAction<number>>
  walletState: any
  setIsSuccess: any
}

const BankTransferCompo = ({
  activeStep,
  setActiveStep,
  walletState,
  setIsSuccess
}: BankTransferCompoProps) => {
  const [currencyRates, setCurrencyRates] = useState<currencyData[]>()
  const [selectedCurrency, setSelectedCurrency] = useState<currencyData>()
  const [transferDetails, setTransferDetails] = useState<transferDetails>()
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 minutes in seconds

  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  const currencyList = ['EUR', 'GBP', 'NGN']

  const handleCopy = () => {
    const account = transferDetails?.transfer_account

    if (account) {
      navigator.clipboard.writeText(account)
    } else {
      dispatch({
        type: TOAST_SHOW,
        payload: {
          message: 'No account number to copy.',
          severity: 'warning'
        }
      })
    }
  }

  useEffect(() => {
    if (walletState?.amount && walletState?.currency) {
      getCurrencyRate()
    }
  }, [walletState?.amount])

  const getCurrencyRate = async () => {
    try {
      const {
        data: { data }
      } = await axiosBaseApi.post('pay/getCurrencyRates', {
        source: walletState?.currency,
        amount: walletState?.amount,
        currencyList: ['NGN']
      })

      // const {
      //   data: { data }
      // } = await axiosBaseApi.post('pay/getCurrencyRates', {
      //   source: walletState.currency,
      //   amount: walletState.amount,
      //   currencyList: ['NGN']
      // })

      setCurrencyRates(data)
      setSelectedCurrency(data?.[0])
      initiateBankTransfer(data?.[0])
      setLoading(false)
    } catch (e: any) {
      const message = e?.response?.data?.message ?? e?.message
      dispatch({
        type: TOAST_SHOW,
        payload: {
          message: message,
          severity: 'error'
        }
      })
    }
  }

  const initiateBankTransfer = async (dataCount: {
    currency: string
    amount: number
  }) => {
    try {
      const finalPayload = {
        paymentType: paymentTypes.BANK_TRANSFER,
        currency: dataCount?.currency,
        amount: dataCount?.amount
      }

      const res = createEncryption(JSON.stringify(finalPayload))

      const {
        data: { data }
      }: { data: BankTransferApiRes } = await axiosBaseApi.post(
        'pay/addPayment',
        {
          data: res
        }
      )

      setTransferDetails(data)
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error.message ??
        'Something went wrong'
      dispatch({
        type: TOAST_SHOW,
        payload: {
          message,
          severity: 'error'
        }
      })
      console.error('initiateBankTransfer error:', error)
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const handleSubmit = async () => {
    try {
      const {
        data: { data }
      } = await axiosBaseApi.post('pay/verifyPayment', {
        uniqueRef: transferDetails?.hash
      })

      if (data?.success) {
        setIsSuccess(true)
        const redirectUri = generateRedirectUrl(data)
        window.location.replace(redirectUri)
      } else {
        setIsSuccess(false)
        // In case API call is 200 but payment failed
        dispatch({
          type: TOAST_SHOW,
          payload: {
            message: 'Payment not verified.',
            severity: 'error'
          }
        })
      }
    } catch (e: any) {
      setIsSuccess(false)
      const message = e.response?.data?.message ?? e.message
      dispatch({
        type: TOAST_SHOW,
        payload: {
          message: message,
          severity: 'error'
        }
      })
    }
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
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
              margin: 0,
              border: '1px solid #E7EAFD',
              boxShadow: '0px 45px 64px 0px #0D03230F'
            }}
          >
            {/* Back Button */}
            <IconButton
              onClick={() => setActiveStep(activeStep - 1)}
              sx={{
                backgroundColor: '#f5f7ff', // light blue tint
                color: '#444CE7', // arrow color
                borderRadius: '50%',
                padding: '10px',
                '&:hover': {
                  backgroundColor: '#ebefff' // slightly darker on hover
                }
              }}
            >
              <ArrowBack sx={{ color: '#444CE7' }} />
            </IconButton>

            {/* Title */}
            <Typography
              variant='h6'
              fontWeight='medium'
              mt={2}
              display='flex'
              alignItems='center'
              gap={1}
              fontFamily='Space Grotesk'
              fontSize={'27px'}
            >
              <AccountBalanceIcon sx={{ color: '#444CE7' }} /> NGN Bank Transfer
            </Typography>

            {/* Bank Details */}
            <Box mt={3}>
              <Typography
                variant='subtitle2'
                fontWeight='300'
                fontFamily='Space Grotesk'
              >
                Bank Name:
              </Typography>
              <Typography
                color='#2D3282'
                fontWeight='bold'
                display='flex'
                alignItems='center'
                gap={1}
                fontFamily='Space Grotesk'
              >
                {transferDetails?.transfer_bank}
                <AccountBalanceIcon />
              </Typography>

              <Typography
                variant='subtitle2'
                mt={2}
                fontWeight='300'
                fontFamily='Space Grotesk'
              >
                Account Number:
              </Typography>
              <Box display='flex' alignItems='center' gap={1} mb={'4px'}>
                <Typography
                  color='#2D3282'
                  fontWeight='600'
                  fontFamily='Space Grotesk'
                >
                  {transferDetails?.transfer_account}
                </Typography>
                <Tooltip title='Copy'>
                  <IconButton
                    onClick={handleCopy}
                    size='small'
                    sx={{
                      fontSize: '12px',
                      color: '#444CE7',
                      bgcolor: '#E7EAFD',
                      borderRadius: '6px',
                      fontFamily: 'Space Grotesk',
                      gap: '4px'
                    }}
                  >
                    <CopyIcon />
                    Copy
                  </IconButton>
                </Tooltip>
              </Box>
              <Box display='flex' alignItems='center'  gap={0.5}>
                <Warning  />
                <Typography
                  variant='caption'
                  color='#515151'
                  fontFamily='Space Grotesk'
                  
                >
                  This account number is unique for each transaction.
                </Typography>
              </Box>

              <Typography
                variant='subtitle2'
                mt={2}
                fontWeight='300'
                fontFamily='Space Grotesk'
              >
                Recipient:
              </Typography>
              <Typography
                fontWeight='600'
                color='#2D3282'
                fontSize={'18px'}
                fontFamily='Space Grotesk'
              >
                Dynopay Payments Ltd.
              </Typography>
            </Box>

            {/* Alert Box */}
            <Box
              mt={1}
              borderRadius={2}
              display='flex'
              alignItems='center'
              bgcolor={'#F5F8FF'}
              gap={1}
              px={2}
              py={1}
            >
              <WarningAmberIcon color='error' fontSize='small' />
              <Typography
                fontSize={14}
                color={'#515151'}
                fontFamily='Space Grotesk'
              >
                Secure bank transfer with automatic confirmation. No need to
                notify us!
              </Typography>
            </Box>

            {/* Payment Card */}
            <Card
              sx={{
                mt: 2,
                borderRadius: 2,
                border: '1px solid #d5d5d5',
                boxShadow: 'none'
              }}
            >
              <CardContent>
                <Box display={'flex'} justifyContent={'space-between'}>
                  <Typography
                    variant='body2'
                    fontSize={'20px'}
                    fontFamily='Space Grotesk'
                  >
                    To Pay:
                  </Typography>
                  <Box textAlign={'end'}>
                    <Typography
                      variant='h6'
                      fontWeight='bold'
                      color='primary'
                      fontFamily='Space Grotesk'
                    >
                      {transferDetails?.transfer_amount}{' '}
                      {selectedCurrency?.currency}
                    </Typography>

                    <Typography
                      variant='caption'
                      color='#515151'
                      fontFamily='Space Grotesk'
                    >
                      ={' '}
                      {Number(
                        walletState?.amount ?? walletState?.amount
                      ).toFixed(2)}{' '}
                      {walletState?.currency}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box
                  display='flex'
                  alignItems='center'
                  justifyContent='center'
                  gap={1}
                >
                  <ClockIcon />
                  <Typography
                    variant='body2'
                    fontWeight='normal'
                    fontSize='13px'
                    fontFamily='Space Grotesk'
                    color='#000'
                  >
                    Invoice expires in: {formatTime(timeLeft)}
                  </Typography>
                </Box>
                <Button
                  variant='contained'
                  onClick={() => {
                    handleSubmit()
                    setActiveStep(activeStep + 1)
                  }}
                  fullWidth
                  sx={{
                    mt: 1,
                    borderRadius: '99999px',
                    bgcolor: '#444CE7',
                    fontFamily: 'Space Grotesk',
                    boxShadow: 'none',
                    '&:hover': {
                      bgcolor: '#444CE7',
                      boxShadow: 'none'
                    }
                  }}
                >
                  I’ve made the payment
                </Button>
              </CardContent>
            </Card>
          </Paper>
        </Box>
      )}
    </>
  )
}

export default BankTransferCompo
