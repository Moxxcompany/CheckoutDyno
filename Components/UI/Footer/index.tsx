'use client'

import { Box, IconButton } from '@mui/material'
import XIcon from '@mui/icons-material/X'
import Link from 'next/link'
import { Icon } from '@iconify/react/dist/iconify.js'
export default function Footer() {
  return (
    <Box component='footer' width='100%' height='115px'>
      {/* Icon Row */}
      <Box
        display='flex'
        justifyContent='center'
        py={2}
      >
        <IconButton>
          <Icon icon="icon-park-outline:telegram" width="24" height="24" color='#444CE7' style={{color:"#444CE7"}}/>
        </IconButton>
        <IconButton>
          <Icon icon="ic:round-email" width="24" height="24" style={{color:"#444CE7"}} />
        </IconButton>

      </Box>

      {/* Footer Bar */}
      <Box bgcolor='#2D3282' py={1} textAlign='center' sx={{ width: '100%', color: '#fff', height: '46px' }}>
        <Link href={'pay3/terms-of-service'} style={{ color: '#fff', cursor: 'pointer',fontSize:'14px', fontWeight:"400" }}>
          Terms Of Service
        </Link>
        <span> | </span>
        <Link href={'pay3/aml-policy'} style={{ color: '#fff', cursor: 'pointer',fontSize:'14px', fontWeight:"400" }}>
          AML Policy
        </Link>
      </Box>
    </Box>
  )
}
