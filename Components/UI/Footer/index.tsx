'use client'

import { Box, IconButton } from '@mui/material'
import XIcon from '@mui/icons-material/X'
import Link from 'next/link'
import InstagramIcon from '@mui/icons-material/Instagram'
import { Icon } from '@iconify/react/dist/iconify.js'
export default function Footer () {
  return (
    <Box component='footer' width='100%' >
      {/* Icon Row */}
      <Box display='flex' justifyContent='center' py={2}>
        <IconButton>
          <InstagramIcon sx={{ color: '#2D3282' }} />
        </IconButton>
        <IconButton>
          <XIcon sx={{ color: '#2D3282' }} />
        </IconButton>
      </Box>

      {/* Footer Bar */}
      <Box
        bgcolor='#2D3282'
        py={1}
        textAlign='center'
        sx={{ width: '100%', color: '#fff', height: '46px' }}
      >
        <Link
          href={'/pay3/terms-of-service'}
          style={{
            color: '#fff',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '400'
          }}
        >
          Terms Of Service
        </Link>
        <span> | </span>
        <Link href={'/pay3/aml-policy'} style={{ color: '#fff', cursor: 'pointer',fontSize:'14px', fontWeight:"400" }}>
          AML Policy
        </Link>
      </Box>
    </Box>
  )
}
