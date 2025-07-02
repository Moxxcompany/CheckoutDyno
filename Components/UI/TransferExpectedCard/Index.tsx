import React from 'react'
import { Box, Typography, Button, Card, useTheme } from '@mui/material'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import DoneIcon from '@mui/icons-material/Done'

export default function TransferExpectedCard ({
  isTrue,
  type,
  dataUrl
}: {
  isTrue?: boolean
  type: string
  dataUrl: string
}) {
  const theme = useTheme()

  const btnGotoWeb = () => {
    if (dataUrl) {
      window.location.replace(dataUrl)
      // window.open(isUrl, '_blank', 'noopener,noreferrer')
    } else {
      console.log('No URL provided')
    }
  }

  return (
    <Box
      //   minHeight="100vh"
      display='flex'
      alignItems='center'
      justifyContent='center'
      bgcolor='#f6f8fc'
      px={2}
      minHeight={'calc(100vh - 340px)'}
    >
      <Card
        sx={{
          width: 400,
          borderRadius: '16px',
          boxShadow: '0 45px 65px rgba(13, 3, 35, 0.06)',
          overflow: 'hidden',
          textAlign: 'center'
        }}
      >
        {/* Top with radial gradient and icon */}

        {type === 'crypto' ? (
          <Box
            sx={{
              py: 3,
              background:
                'radial-gradient(circle at top center, #e8f9f1, #ffffff 70%)'
            }}
          >
            <DoneIcon
              sx={{
                fontSize: 48,
                color: '#12B76A'
              }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              py: 3,
              // background: isTrue
              //   ? 'radial-gradient(circle at top center, #e8f9f1, #ffffff 100%)'
              //   : 'radial-gradient(circle at top center, #fff7e0, #ffffff 100%)',
              position: 'relative'
              // background: 'radial-gradient(circle, rgba(251, 188, 5, 0.27) 0%, rgba(251, 188, 5, 0.0) 100%)',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                // top: '-198%',
                bottom: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '400px',
                height: '530px',
                background:
                  'radial-gradient(circle, rgba(251, 188, 5, 0.27) 0%, rgba(251, 188, 5, 0.0) 70%)',
                zIndex: 1
              }}
            ></Box>
            {isTrue ? (
              <DoneIcon
                sx={{
                  fontSize: 48,
                  color: '#12B76A'
                }}
              />
            ) : (
              <AccessTimeOutlinedIcon
                sx={{
                  fontSize: 50,
                  color: '#FBBC05'
                }}
              />
            )}
          </Box>
        )}

        {/* Content */}
        <Box px={4} pb={4}>
          <Typography
            variant='h6'
            fontWeight={600}
            color='#000'
            mb={1}
            fontFamily='Space Grotesk'
          >
            {type === 'crypto'
              ? 'Crypto Received'
              : isTrue
              ? 'Funds Received'
              : 'Transfer Expected'}
          </Typography>

          <Typography
            variant='body2'
            color='#000'
            mb={3}
            fontFamily='Space Grotesk'
          >
            {type === 'crypto'
              ? 'Your payment has been confirmed.'
              : isTrue
              ? 'Your payment has been confirmed.'
              : "If you've completed the transfer, no further action is needed. We'll confirm your payment as soon as it arrives."}
          </Typography>

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
              paddingX: 3,
              width: 'auto',
              minWidth: 'auto',
              '&:hover': {
                backgroundColor: '#EEF2FF',
                borderColor: '#4F46E5'
              }
            }}
            endIcon={<span style={{ fontSize: '1.2rem' }}>→</span>}
            onClick={() => btnGotoWeb()}
          >
            Go to Website
          </Button>
        </Box>
      </Card>
    </Box>
  )
}
