import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const Loading = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="50vh"
      width="100%"
      bgcolor="#F9FAFB"
      minHeight={'calc(100vh - 340px)'}
    >
      <CircularProgress size={48} thickness={4} color="primary" />
      <Typography
        variant="subtitle1"
        color="text.secondary"
        mt={2}
        fontFamily="Space Grotesk"
      >
        Please wait, we&apos;re loading your data...
      </Typography>
    </Box>
  );
};

export default Loading;
