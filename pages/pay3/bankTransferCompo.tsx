import React from 'react'
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
import { ArrowBack, ContentCopy, ErrorOutline } from '@mui/icons-material'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import CopyIcon from '@/assets/Icons/CopyIcon'

interface BankTransferCompoProps {
  activeStep: number
  setActiveStep: React.Dispatch<React.SetStateAction<number>>
}
const BankTransferCompo = ({
  activeStep,
  setActiveStep
}: BankTransferCompoProps) => {
  const handleCopy = () => {
    navigator.clipboard.writeText('1234567890')
  }
  return (
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
        <IconButton onClick={() => setActiveStep(activeStep - 1)} sx={{
          backgroundColor: '#f5f7ff', // light blue tint
          color: '#444CE7',           // arrow color
          borderRadius: '50%',
          padding: '10px',
          '&:hover': {
            backgroundColor: '#ebefff', // slightly darker on hover
          },
        }}>
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
          fontFamily="Space Grotesk"
          fontSize={'27px'}
        >
          <AccountBalanceIcon sx={{ color: '#444CE7' }} /> NGN Bank Transfer
        </Typography>

        {/* Bank Details */}
        <Box mt={3}>
          <Typography variant='subtitle2' fontWeight='300' fontFamily="Space Grotesk"
          >
            Bank Name:
          </Typography>
          <Typography
            color='#2D3282'
            fontWeight='bold'
            display='flex'
            alignItems='center'
            gap={1}
            fontFamily="Space Grotesk"

          >
            First Bank Nigeria
            <AccountBalanceIcon />
          </Typography>

          <Typography variant='subtitle2' mt={2} fontWeight='300' fontFamily="Space Grotesk">
            Account Number:
          </Typography>
          <Box display='flex' alignItems='center' gap={1} mb={'4px'}>
            <Typography color='#2D3282' fontWeight='600' fontFamily="Space Grotesk"
            >
              1234567890
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
                  fontFamily: "Space Grotesk"
                }}
              >
                <CopyIcon />

                Copy
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant='caption' color='#515151' fontFamily="Space Grotesk">
            ⓘ This account number is unique for each transaction.
          </Typography>

          <Typography variant='subtitle2' mt={2} fontWeight='300' fontFamily="Space Grotesk">
            Recipient:
          </Typography>
          <Typography fontWeight='600' color='#2D3282' fontSize={'18px'} fontFamily="Space Grotesk">
            Dynopay Payments Ltd.
          </Typography>
        </Box>

        {/* Alert Box */}
        <Box mt={1} borderRadius={2} display='flex' alignItems='center' bgcolor={"#F5F8FF"} gap={1} px={2} py={1}>
          <WarningAmberIcon color='error' fontSize='small' />
          <Typography fontSize={14} color={'#515151'} fontFamily="Space Grotesk">
            Secure bank transfer with automatic confirmation. No need to notify
            us!
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
              <Typography variant='body2' fontSize={'20px'} fontFamily="Space Grotesk">
                To Pay:
              </Typography>
              <Box textAlign={'end'}>
                <Typography variant='h6' fontWeight='bold' color='primary' fontFamily="Space Grotesk">
                  ₦ 200,000 NGN
                </Typography>
                <Typography variant='caption' color='#515151' fontFamily="Space Grotesk">
                  = 129.00 USD
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography gutterBottom textAlign={'center'} fontSize={'13px'} fontFamily="Space Grotesk">
              🕒 Invoice expires in: 29:59
            </Typography>
            <Button
              variant='contained'
              onClick={() => setActiveStep(activeStep + 1)}
              fullWidth
              sx={{
                mt: 1,
                borderRadius: '99999px',
                bgcolor: '#444CE7',
                fontFamily: "Space Grotesk",

                '&:hover': { bgcolor: '#444CE7' }
              }}
            >
              I’ve made the payment
            </Button>
          </CardContent>
        </Card>
      </Paper>
    </Box>
  )
}

export default BankTransferCompo
