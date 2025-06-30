import React, { useEffect, useState } from 'react'
import {
  AccountBalanceWallet,
  ArrowBack,
  AttachMoney,
  Bolt,
  CurrencyBitcoin,
  CurrencyExchange,
  CurrencyLira,
  Diamond,
  Paid,
  ContentCopy
} from '@mui/icons-material'
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
  ListItemText
} from '@mui/material'
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import QRCode from 'react-qr-code'
import CopyIcon from '@/assets/Icons/CopyIcon'
import ClockIcon from '@/assets/Icons/ClockIcon'
import axiosBaseApi from '@/axiosConfig'
import { currencyData, walletState } from '@/utils/types/paymentTypes'
import { TOAST_SHOW } from '@/Redux/Actions/ToastAction'
import { useDispatch } from 'react-redux'

interface CryptoTransferProps {
  activeStep: number
  setActiveStep: React.Dispatch<React.SetStateAction<number>>
  walletState: walletState
}

const cryptoOptions = [
  { value: 'USDT', label: 'USDT (TRC-20, ERC-20)', icon: <AttachMoney />, currency: "USDT-TRC20" },
  { value: 'BTC', label: 'Bitcoin (BTC)', icon: <CurrencyBitcoin />, currency: "BTC" },
  { value: 'ETH', label: 'Ethereum (ETH)', icon: <CurrencyExchange />, currency: "ETH" },
  { value: 'BNB', label: 'BNB', icon: <Diamond />, currency: "BNB" },
  { value: 'LTC', label: 'Litecoin (LTC)', icon: <Paid />, currency: "LTC" },
  { value: 'DOGE', label: 'Dogecoin (DOGE)', icon: <CurrencyLira />, currency: "DOGE" },
  { value: 'BCH', label: 'Bitcoin Cash (BCH)', icon: <AccountBalanceWallet />, currency: "BCH" },
  { value: 'TRX', label: 'Tron (TRX)', icon: <Bolt />, currency: "TRX" }
]

const CryptoTransfer = ({ activeStep, setActiveStep, walletState }: CryptoTransferProps) => {
  const dispatch = useDispatch();
  const [selectedCrypto, setSelectedCrypto] = useState('')
  const [selectedNetwork, setSelectedNetwork] = useState('TRC-20')
  const [copied, setCopied] = useState(false)
  const [currencyRates, setCurrencyRates] = useState<currencyData[]>();
  const [selectedCurrency, setSelectedCurrency] = useState<currencyData>();
  const [loading, setLoading] = useState(true);

  const handleChange = (event: any) => {
    setSelectedCrypto(event.target.value)
  }

  const getSelectedOption = () => {
    return cryptoOptions.find(opt => opt.value === selectedCrypto)
  }

  const cryptoAddress = 'TNPJXWXJ6XJ6XJ6XJ6XJ6XJ6X'

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(cryptoAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (selectedCrypto !== '') {
  //       setActiveStep(activeStep + 1)
  //     }
  //   }, 100000)
  // }, [selectedCrypto])

  useEffect(() => {
    if (selectedCrypto) {
      getCurrencyRate();
    }
  }, [selectedCrypto]);

  const getCurrencyRate = async () => {
    try {
      const {
        data: { data },
      } = await axiosBaseApi.post("/pay/getCurrencyRates", {
        source: walletState?.currency,
        amount: walletState?.amount,
        currencyList: cryptoOptions.map((x) => x.currency),
        fixedDecimal: false,
      });
      console.log('Pay3 ==> Crypto component', data)
      setCurrencyRates(data);
      setSelectedCurrency(data[0]);
      setLoading(false);
    } catch (e: any) {
      const message = e.response.data.message ?? e.message;
      dispatch({
        type: TOAST_SHOW,
        payload: {
          message: message,
          severity: "error",
        },
      });
    }
  };

  return (
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
          maxWidth: 450,
          marginTop: 10,
          margin: 0,
          border: '1px solid #E7EAFD',
          boxShadow: '0px 45px 64px 0px #0D03230F'
        }}
      >
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
          fontSize={'27px'}
          fontFamily='Space Grotesk'
        >
          <CurrencyBitcoinIcon sx={{ color: '#12B76A', fontSize: '28px' }} />{' '}
          Cryptocurrency
        </Typography>

        {/* Crypto Selection Dropdown (Always visible) */}
        <Box mt={3} mb={1}>
          <Typography
            variant='subtitle2'
            fontWeight='medium'
            fontFamily='Space Grotesk'
          >
            Preferred Crypto
          </Typography>
        </Box>

        <FormControl fullWidth>
          <Select
            labelId='crypto-select-label'
            id='crypto-select'
            value={selectedCrypto}
            displayEmpty
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-input': {
                borderRadius: '10px !important',
                borderColor: '#D9D9D9 !important',
                '& :focus-visible': {
                  outline: 'none !important'
                }
              },
              '& .MuiList-padding': {
                padding: '17px 20px !important'
              },
              '& fieldset': {
                borderRadius: '10px !important',
                borderColor: '#D9D9D9 !important',
                '& :focus-visible': {
                  outline: 'none !important'
                }
              }
            }}
            renderValue={selected => {
              if (!selected) {
                return (
                  <span
                    style={{
                      color: '#757575',
                      fontFamily: 'Space Grotesk'
                    }}
                  >
                    Select Crypto Type
                  </span>
                )
              }

              const option = getSelectedOption()
              return (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: '#1A1919',
                    fontWeight: 'medium'
                  }}
                >
                  {option?.icon}
                  {option?.label}
                </Box>
              )
            }}
          >
            {cryptoOptions.map(option => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{
                  '&:hover': {
                    backgroundColor: '#F5F8FF'
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#F5F8FF',
                    '&:hover': {
                      backgroundColor: '#F5F8FF'
                    }
                  }
                }}
              >
                <ListItemIcon>{option.icon}</ListItemIcon>
                <ListItemText>{option.label}</ListItemText>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Network Selection (Only for USDT) */}
        {selectedCrypto === 'USDT' && (
          <>
            <Box mt={2} mb={1}>
              <Typography
                variant='subtitle2'
                fontWeight='medium'
                fontFamily='Space Grotesk'
              >
                Preferred Network
              </Typography>
            </Box>
            <Box display='flex' gap={1} alignItems='center' mb={3}>
              <Typography
                border={
                  selectedNetwork === 'TRC-20'
                    ? '1px solid #86A4F9'
                    : '1px solid #E7EAFD'
                }
                padding={'5px 10px'}
                fontSize={'small'}
                bgcolor={selectedNetwork === 'TRC-20' ? '#E7EAFD' : '#F5F8FF'}
                borderRadius={'5px'}
                sx={{ cursor: 'pointer' }}
                onClick={() => setSelectedNetwork('TRC-20')}
                fontFamily='Space Grotesk'
              >
                TRC-20
              </Typography>
              <Typography
                border={
                  selectedNetwork === 'ERC-20'
                    ? '1px solid #86A4F9'
                    : '1px solid #E7EAFD'
                }
                padding={'5px 10px'}
                fontSize={'small'}
                bgcolor={selectedNetwork === 'ERC-20' ? '#E7EAFD' : '#F5F8FF'}
                borderRadius={'5px'}
                sx={{ cursor: 'pointer' }}
                onClick={() => setSelectedNetwork('ERC-20')}
                fontFamily='Space Grotesk'
              >
                ERC-20
              </Typography>
            </Box>
          </>
        )}

        {/* QR Code Section (Shown when any crypto is selected) */}
        {selectedCrypto && (
          <>
            <Typography
              variant='h6'
              fontWeight='medium'
              my={1}
              fontSize={'small'}
              fontFamily='Space Grotesk'
            >
              Send {selectedCrypto}{' '}
              {selectedCrypto === 'USDT' ? `(${selectedNetwork})` : ''} to This
              Address
            </Typography>

            <Box
              textAlign='center'
              border={'1px solid #A4BCFD'}
              padding={'20px'}
              borderRadius={'20px'}
              bgcolor={'#F5F8FF'}
            >
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'white',
                  borderRadius: '10px',
                  border: '1px solid #E7EAFD',
                  mb: 2
                }}
              >
                <QRCode value={cryptoAddress} />
              </Box>
              <Box
                display='flex'
                alignItems='center'
                justifyContent='space-between'
                border={'1px solid #E7EAFD'}
                padding={'10px'}
                borderRadius={'8px'}
                bgcolor={'#FFFFFF'}
              >
                <Typography
                  variant='body2'
                  sx={{ color: '#444CE7' }}
                  fontWeight={'400'}
                  fontSize={'11px'}
                  maxWidth={'88%'}
                  overflow={'hidden'}
                  textOverflow={'ellipsis'}
                  whiteSpace={'nowrap'}
                >
                  {cryptoAddress}
                </Typography>
                <IconButton
                  size='small'
                  sx={{
                    bgcolor: '#EEF2FF',
                    p: 0.5,
                    borderRadius: 2,
                    '&:hover': { bgcolor: '#E0E7FF' }
                  }}
                  onClick={handleCopyAddress}
                >
                  <CopyIcon />
                </IconButton>
              </Box>
              <Box display={'flex'} alignItems={'center'} gap={1}>
                <InfoOutlinedIcon fontSize={'small'} />
                <Typography
                  variant='h6'
                  fontWeight='400'
                  my={1}
                  color={'#1A1919'}
                  fontSize={'small'}
                  textAlign={'left'}
                  lineHeight={'18px'}
                  fontFamily='Space Grotesk'
                >
                  Send only {selectedCrypto} in{' '}
                  {selectedCrypto === 'USDT'
                    ? `(${selectedNetwork}) network`
                    : ''}{' '}
                  to this address, or your funds will be lost.
                </Typography>
              </Box>
            </Box>

            <Box
              mt={3}
              border={'1px solid #DFDFDF'}
              padding={'20px'}
              borderRadius={'10px'}
              bgcolor={'#FFFFFF'}
            >
              <Box display={'flex'} gap={2} justifyContent={'space-between'}>
                <Typography
                  variant='h6'
                  fontWeight='medium'
                  fontSize={'20px'}
                  sx={{
                    fontSize: {
                      xs: '16px', // for small screens
                      sm: '18px',
                      md: '20px' // default
                    }
                  }}
                  fontFamily='Space Grotesk'
                  whiteSpace={'nowrap'}
                >
                  To Pay:
                </Typography>
                <Box display={'flex'} alignItems={'start'} gap={1}>
                  <Box textAlign={'end'}>
                    <Typography
                      variant='body1'
                      fontSize={'25px'}
                      fontWeight={'medium'}
                      display={'flex'}
                      alignItems={'center'}
                      gap={1}
                      sx={{
                        fontSize: {
                          xs: '14px', // for small screens
                          sm: '18px',
                          md: '20px' // default
                        }
                      }}
                      fontFamily='Space Grotesk'
                      whiteSpace={'nowrap'}
                    >
                      35.00 {selectedCrypto}
                    </Typography>
                    <Typography
                      variant='body1'
                      color='#515151'
                      sx={{
                        fontSize: {
                          xs: '10px', // for small screens
                          sm: '12px',
                          md: '14px' // default
                        }
                      }}
                      fontFamily='Space Grotesk'
                      whiteSpace={'nowrap'}
                    >
                      =35.00 USD
                    </Typography>
                  </Box>
                  <IconButton
                    size='small'
                    sx={{
                      bgcolor: '#EEF2FF',
                      p: 0.5,
                      borderRadius: 2,
                      '&:hover': { bgcolor: '#E0E7FF' },
                      mt: 1
                    }}
                    onClick={handleCopyAddress}
                  >
                    <CopyIcon />
                  </IconButton>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />

              <Box display={'flex'} alignItems={'center'} justifyContent={"center"} gap={1}>
                <ClockIcon />
                <Typography
                  variant='body2'
                  fontWeight={'normal'}
                  fontSize={'13px'}
                  fontFamily='Space Grotesk'
                  color={'#000'}
                >
                  invoice expires in: 14:21
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  )
}

export default CryptoTransfer
