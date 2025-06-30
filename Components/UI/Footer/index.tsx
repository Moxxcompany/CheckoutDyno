'use client'

import { Box, Typography, IconButton } from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import SendIcon from '@mui/icons-material/Send'
import ShareIcon from '@/assets/Icons/ShareIcon'
import MailIcon from '@/assets/Icons/MailIcon'
import XIcon from '@mui/icons-material/X'
import InstagramIcon from '@mui/icons-material/Instagram'
export default function Footer () {
  return (
    <Box component='footer' width='100%'>
      {/* Icon Row */}
      <Box
        display='flex'
        justifyContent='center'
        gap={2}
        bgcolor='#F8FAFC'
        py={2}
      >
        <IconButton>
          <XIcon sx={{ color: '#444CE7' }} />
        </IconButton>
        <IconButton>
          <InstagramIcon sx={{ color: '#444CE7' }} />
        </IconButton>
      </Box>

      {/* Footer Bar */}
      <Box bgcolor='#2D3282' py={1} textAlign='center' sx={{ width: '100%' }}>
        <Typography
          variant='caption'
          color='#fff'
          fontSize={14}
          fontFamily='Space Grotesk'
        >
          Terms Of Service | AML Policy
        </Typography>
      </Box>
    </Box>
  )
}
