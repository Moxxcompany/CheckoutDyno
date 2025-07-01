import React from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const policySections = [
  {
    title: '1. Purpose',
    description:
      'The purpose of this policy is to ensure that DynoPay complies with all applicable AML and Counter-Terrorist Financing (CTF) laws and regulations. We are dedicated to identifying and mitigating risks associated with money laundering and to protecting our platform from being used for illicit purposes.',
  },
  {
    title: '2. Risk-Based Approach',
    description:
      'DynoPay follows a risk-based approach in assessing its clients and transactions. Based on the level of risk, we apply appropriate levels of due diligence and monitoring.',
  },
  {
    title: '3. Know Your Customer (KYC)',
    description:
      'We have established a comprehensive KYC (Know Your Customer) program to verify the identity of our users. Depending on the account type and transaction volume, KYC requirements may include:\n• Full name and date of birth\n• Government-issued identification\n• Proof of address\n• Source of funds (for higher-risk activities)\n\nKYC procedures apply to both fiat and crypto-related operations.',
  },
  {
    title: '4. Ongoing Monitoring',
    description:
      'All transactions processed through DynoPay are subject to ongoing monitoring to detect unusual or suspicious behavior. This includes, but is not limited to:\n• Unusual movement of funds\n• Use of high-risk jurisdictions\n• Use of anonymizing services or tools\n\nWe reserve the right to delay, block, or refuse transactions that raise red flags during monitoring.',
  },
  {
    title: '5. Reporting Suspicious Activities',
    description:
      'In accordance with applicable AML laws, DynoPay is obligated to report any suspected money laundering or suspicious activity to the relevant authorities. Users are not notified when such reports are made, in compliance with legal requirements.',
  },
  {
    title: '6. Employee Training',
    description:
      'Our staff receives regular training in AML procedures, red flag indicators, and legal responsibilities. This ensures our team is equipped to recognize and respond to suspicious activity appropriately.',
  },
  {
    title: '7. Record Keeping',
    description:
      'DynoPay maintains detailed records of all user identification data, transactions, and AML reviews for a minimum period of 5 years, or as otherwise required by law.',
  },
  {
    title: '8. Cryptocurrency-Specific Measures',
    description:
      'Given the unique nature of digital assets, DynoPay implements enhanced due diligence and blockchain analysis tools to monitor the flow of crypto assets. We do not support or tolerate the use of our platform for mixing/tumbling services or privacy coins designed to obscure the source of funds.',
  },
  {
    title: '9. User Responsibility',
    description:
      'By using DynoPay, users agree to comply with this AML Policy and cooperate with any compliance-related requests. Failure to do so may result in account suspension, reporting to authorities, or permanent termination.',
  },
];

const AMLPolicyPage = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 } }}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <IconButton>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="body2" fontWeight={500}>
          Back
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ color: '#2D3282', fontFamily:'Space Grotesk', fontSize: { xs: '35px', sm: '50px' } }}
          gutterBottom
        >
          Anti-Money Laundering (AML) Policy
        </Typography>
        <Typography variant="body2" color="#707070">
          Last Updated January 11, 2025
        </Typography>
      </Box>

      <Box>
        <Typography variant="body1" mb={2} sx={{fontFamily:'Space Grotesk'}}>
          At DynoPay, we are committed to upholding the highest standards in preventing money laundering and the
          financing of terrorism. This Anti-Money Laundering (AML) Policy outlines the measures and procedures we have
          implemented to detect, prevent, and report any suspicious activity across our services, including:
        </Typography>
        <List dense sx={{ listStyle: 'disc', pl: 4 }}>
          <ListItem sx={{ display: 'list-item', py: 0 }}>
            <ListItemText primary="Wallet balance management" />
          </ListItem>
          <ListItem sx={{ display: 'list-item', py: 0 }}>
            <ListItemText primary="Bank transfers" />
          </ListItem>
          <ListItem sx={{ display: 'list-item', py: 0 }}>
            <ListItemText primary="Cryptocurrency payments" />
          </ListItem>
        </List>

        {policySections.map((section, index) => (
          <Box key={index} sx={{ mt: 4 }}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{  mb: 1,fontFamily:'Space Grotesk' }}
            >
              {section.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 ,fontFamily:'Space Grotesk'}}
            >
              {section.description}
            </Typography>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default AMLPolicyPage;