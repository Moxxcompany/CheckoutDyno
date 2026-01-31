import React from 'react';
import {
  Box,
  Typography,
  Container,
  List,
  ListItem,
  ListItemText,
  useTheme,
} from '@mui/material';
import Pay3Layout from '@/Components/Layout/Pay3Layout';
import BackButton from '@/Components/Page/Pay3Components/backButton';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';

const AMLPolicyPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { t } = useTranslation('common');
  
  const sectionKeys = [
    'purpose',
    'riskBased',
    'kyc',
    'monitoring',
    'reporting',
    'training',
    'records',
    'crypto',
    'userResponsibility'
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
            gutterBottom
          >
            {t('aml.title')}
          </Typography>
          <Typography 
            variant="body2" 
            color={isDark ? theme.palette.text.secondary : '#707070'} 
            sx={{ mt: '12px' }}
          >
            {t('aml.lastUpdated')} January 11, 2025
          </Typography>
        </Box>

        <Box sx={{ mt: '12px' }}>
          <Typography 
            variant="body1" 
            sx={{ fontFamily: 'Space Grotesk', color: theme.palette.text.primary }}
          >
            {t('aml.intro')}
          </Typography>
          <List dense sx={{ listStyle: 'disc', pl: 4, mb: 2, pt: 0 }}>
            <ListItem sx={{ display: 'list-item', py: 0 }}>
              <ListItemText 
                primary={t('aml.services.wallet')} 
                sx={{ '& .MuiListItemText-primary': { color: theme.palette.text.primary } }} 
              />
            </ListItem>
            <ListItem sx={{ display: 'list-item', py: 0 }}>
              <ListItemText 
                primary={t('aml.services.bank')} 
                sx={{ '& .MuiListItemText-primary': { color: theme.palette.text.primary } }} 
              />
            </ListItem>
            <ListItem sx={{ display: 'list-item', py: 0 }}>
              <ListItemText 
                primary={t('aml.services.crypto')} 
                sx={{ '& .MuiListItemText-primary': { color: theme.palette.text.primary } }} 
              />
            </ListItem>
          </List>

          {sectionKeys.map((key) => (
            <Box key={key} sx={{ mt: '24px' }}>
              <Typography
                variant="subtitle1"
                fontWeight={500}
                sx={{ mb: '12px', fontFamily: 'Space Grotesk', color: theme.palette.text.primary }}
              >
                {t(`aml.sections.${key}.title`)}
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
                {t(`aml.sections.${key}.content`)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Pay3Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale, req }) => {
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
          destination: `/${geoData.locale}/pay/aml-policy`,
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

export default AMLPolicyPage;
