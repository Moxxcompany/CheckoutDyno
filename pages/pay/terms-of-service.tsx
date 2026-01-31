import React from 'react';
import {
  Box,
  Typography,
  Container,
  useTheme,
} from '@mui/material';
import Pay3Layout from '@/Components/Layout/Pay3Layout';
import BackButton from '@/Components/Page/Pay3Components/backButton';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';

const TermsOfService = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { t } = useTranslation('common');
  
  const sectionKeys = [
    'overview',
    'eligibility', 
    'userAccount',
    'permittedUse',
    'paymentsFees',
    'riskDisclosure',
    'amlKyc',
    'suspension',
    'intellectualProperty',
    'disclaimer',
    'liability',
    'modifications',
    'governingLaw',
    'contact'
  ];

  return (
    <Pay3Layout>
      <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 } }}>
        <BackButton onClick={() => history.back()} />

        <Box sx={{ mt: '26px' }}>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ 
              color: isDark ? theme.palette.secondary.main : '#2D3282', 
              fontFamily: 'Space Grotesk', 
              fontSize: { xs: '36px', sm: '50px' } 
            }}
          >
            {t('terms.title')}
          </Typography>
          <Typography 
            variant="body2" 
            color={isDark ? theme.palette.text.secondary : '#707070'} 
            sx={{ mt: '12px' }}
          >
            {t('terms.lastUpdated')} January 11, 2025
          </Typography>
        </Box>

        <Box sx={{ mt: '12px' }}>
          <Typography 
            variant="body1" 
            mb={2} 
            sx={{ fontFamily: 'Space Grotesk', color: theme.palette.text.primary }}
          >
            {t('terms.intro')}
          </Typography>

          {sectionKeys.map((key) => (
            <Box key={key} sx={{ mt: '24px' }}>
              <Typography
                variant="subtitle1"
                fontWeight={500}
                sx={{ mb: '12px', fontFamily: 'Space Grotesk', color: theme.palette.text.primary }}
              >
                {t(`terms.sections.${key}.title`)}
              </Typography>
              <Typography
                variant="body2"
                sx={{ 
                  whiteSpace: 'pre-line', 
                  fontSize: "16px", 
                  lineHeight: 1.6, 
                  fontFamily: 'Space Grotesk', 
                  color: theme.palette.text.primary 
                }}
              >
                {t(`terms.sections.${key}.content`)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Pay3Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale, req }) => {
  // Check if user has manually selected a language
  const cookies = req.headers.cookie || '';
  const hasManualLocaleChoice = cookies.includes('NEXT_LOCALE=');
  
  if (hasManualLocaleChoice) {
    return {
      props: {
        ...(await serverSideTranslations(locale ?? 'en', ['common'])),
      },
    };
  }

  if (locale && locale !== 'en') {
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
      },
    };
  }

  try {
    const { detectGeoLocale, getClientIp } = await import('@/utils/geoLocale');
    const clientIp = getClientIp(req);
    const geoData = await detectGeoLocale(clientIp);
    
    if (geoData.locale !== 'en' && geoData.locale !== locale) {
      return {
        redirect: {
          destination: `/${geoData.locale}/pay/terms-of-service`,
          permanent: false,
        },
      };
    }
  } catch (error) {
    console.error('Geo-locale detection failed:', error);
  }

  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  };
}

export default TermsOfService;
