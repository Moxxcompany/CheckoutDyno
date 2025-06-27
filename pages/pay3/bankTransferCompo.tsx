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
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const BankTransferCompo = () => {
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
        <IconButton>
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
        >
          <AccountBalanceIcon sx={{ color: '#444CE7' }} /> NGN Bank Transfer
        </Typography>

        {/* Bank Details */}
        <Box mt={3}>
          <Typography variant='subtitle2' fontWeight='300'>
            Bank Name:
          </Typography>
          <Typography
            color='#2D3282'
            fontWeight='bold'
            display='flex'
            alignItems='center'
            gap={1}
          >
            First Bank Nigeria
            <AccountBalanceIcon />
          </Typography>

          <Typography variant='subtitle2' mt={2} fontWeight='300'>
            Account Number:
          </Typography>
          <Box display='flex' alignItems='center' gap={1} mb={'4px'}>
            <Typography color='#2D3282' fontWeight='600'>
              1234567890
            </Typography>
            <Tooltip title='Copy'>
              <IconButton onClick={handleCopy} size='small' sx={{fontSize:'12px', color:'#2D3282', bgcolor:'#E7EAFD', borderRadius:'6px'}}>
                <FileCopyIcon sx={{ color: '#2D3282', mr:1, fontSize:'12px' }} />
                Copy
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant='caption' color='#515151'>
            ⓘ This account number is unique for each transaction.
          </Typography>

          <Typography variant='subtitle2' mt={2} fontWeight='300'>
            Recipient:
          </Typography>
          <Typography fontWeight='600' color='#2D3282' fontSize={'18px'}>
            Dynopay Payments Ltd.
          </Typography>
        </Box>

        {/* Alert Box */}
        <Box mt={3} borderRadius={2} display='flex' alignItems='center' gap={1}>
          <WarningAmberIcon color='error' fontSize='small' />
          <Typography fontSize={14} color={'#515151'}>
            Secure bank transfer with automatic confirmation. No need to notify
            us!
          </Typography>
        </Box>

        {/* Payment Card */}
        <Card
          sx={{
            mt: 3,
            borderRadius: 2,
            border: '1px solid #d5d5d5',
            boxShadow: 'none'
          }}
        >
          <CardContent>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Typography variant='body2' fontSize={'20px'}>
                To Pay:
              </Typography>
              <Box textAlign={'end'}>
                <Typography variant='h6' fontWeight='bold' color='primary'>
                  ₦ 200,000 NGN
                </Typography>
                <Typography variant='caption' color='#515151'>
                  = 129.00 USD
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography gutterBottom textAlign={'center'} fontSize={'13px'}>
              🕒 Invoice expires in: 29:59
            </Typography>
            <Button
              variant='contained'
              fullWidth
              sx={{
                mt: 1,
                borderRadius: '99999px',
                bgcolor: '#444CE7',
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
