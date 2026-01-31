import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";

const paymentAuth = (WrappedComponent: any) => {
  const AuthChecker = (props: any) => {
    const router = useRouter();
    const [payment, setPayment] = useState(false);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
      if (router.query.d) {
        setPayment(true);
      }
      setChecked(true);
    }, [router.query]);

    if (!checked) {
      return null;
    }

    if (!payment) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #101EF7 0%, #4B50E6 50%, #7C5CF0 100%)',
            fontFamily: 'Space Grotesk, sans-serif',
            padding: '2rem',
            textAlign: 'center'
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            DynoPay Checkout
          </Typography>
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: { xs: '1rem', sm: '1.25rem' },
              mb: 4,
              maxWidth: '500px'
            }}
          >
            Please use a valid payment link to proceed with checkout.
          </Typography>
          <Button
            href="/"
            variant="contained"
            sx={{
              backgroundColor: 'white',
              color: '#444CE7',
              borderRadius: '30px',
              px: 4,
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem',
              '&:hover': {
                backgroundColor: '#f5f5f5'
              }
            }}
          >
            Go to Homepage
          </Button>
        </Box>
      );
    }

    return <WrappedComponent {...props} />;
  };
  return AuthChecker;
};

export default paymentAuth;
