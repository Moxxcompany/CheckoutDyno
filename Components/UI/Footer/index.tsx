'use client'

import { Box, Typography, IconButton } from '@mui/material'
import XIcon from '@mui/icons-material/X'
import InstagramIcon from '@mui/icons-material/Instagram'
import Link from 'next/link'
export default function Footer() {
  return (
    <Box component='footer' width='100%'>
      {/* Icon Row */}
      <Box
        display='flex'
        justifyContent='center'
        // gap={1}
        bgcolor='#F8FAFC'
        py={2}
      >
          <IconButton>
          <InstagramIcon sx={{ color: '#2D3282' }} />
        </IconButton>
        <IconButton>
          <XIcon sx={{ color: '#2D3282' }} />
        </IconButton>
      
      </Box>

      {/* Footer Bar */}
      <Box bgcolor='#2D3282' py={1} textAlign='center' sx={{ width: '100%', color: '#fff' }}>
        <Link href={'pay3/terms-of-service'} style={{ color: '#fff',cursor:'pointer' }}>
          Terms Of Service
        </Link>
        <span> | </span>
        <Link href={'pay3/aml-policy'} style={{ color: '#fff',cursor:'pointer' }}>
          AML Policy
        </Link>
      </Box>
    </Box>
  )
}
