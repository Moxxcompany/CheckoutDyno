'use client';

import { Box, Typography, IconButton } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';

export default function Footer() {
  return (
       <Box component="footer" width="100%">
      {/* Icon Row */}
      <Box
        display="flex"
        justifyContent="center"
        gap={2}
        bgcolor="#F8FAFC"
        py={2}
      >
        <IconButton>
          <SendIcon sx={{ color: '#444CE7' }} />
        </IconButton>
        <IconButton>
          <EmailIcon sx={{ color: '#444CE7' }} />
        </IconButton>
      </Box>

      {/* Footer Bar */}
      <Box bgcolor="#2D3282" py={1} textAlign="center" sx={{width:'100%'}}>
        <Typography variant="caption" color="#fff">
          Terms Of Service | AML Policy
        </Typography>
      </Box>
    </Box>
  );
}
