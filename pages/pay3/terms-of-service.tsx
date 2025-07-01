import React from 'react';
import {
  Box,
  Typography,
  Container,
} from '@mui/material';
import Pay3Layout from './layout';
import BackButton from '@/Components/Page/Pay3Components/backButton';

const termsSections = [
  {
    title: '1. Overview',
    description:
      'DynoPay is a digital payment platform that provides wallet-based balance management, bank transfers, and cryptocurrency transactions. These Terms govern your use of our website, platform, and services.',
  },
  {
    title: '2. Eligibility',
    description:
      'To use DynoPay, you must be:\n \u00A0•\u00A0 At least 18 years old\n \u00A0•\u00A0 Capable of entering into a legally binding agreement\n \u00A0•\u00A0 Not located in a restricted or sanctioned jurisdiction\n\nWe reserve the right to reject or terminate any account that violates these requirements.',
  },
  {
    title: '3. User Account',
    description:
      'To access certain features, you may be required to register an account. You agree to:\n \u00A0•\u00A0 Provide accurate and complete information\n \u00A0•\u00A0 Keep your login credentials confidential\n \u00A0•\u00A0 Be fully responsible for all activity under your account\n\nDynoPay is not liable for any unauthorized access resulting from your failure to secure your account.',
  },
  {
    title: '4. Permitted Use',
    description:
      'You agree to use DynoPay only for lawful purposes and in compliance with all applicable laws. Prohibited uses include, but are not limited to:\n \u00A0•\u00A0 Money laundering, terrorist financing, or fraud\n \u00A0•\u00A0 Using stolen or unauthorized payment methods\n \u00A0•\u00A0 Engaging in activities that violate sanctions or embargoes\n \u00A0•\u00A0 Attempting to bypass identity verification or security measures',
  },
  {
    title: '5. Payments & Fees',
    description:
      ' \u00A0•\u00A0 Wallet Balance: You may top up your wallet via supported payment methods.\n \u00A0•\u00A0 Bank Transfers: Subject to processing time and applicable fees.\n \u00A0•\u00A0 Crypto Payments: Only supported cryptocurrencies are accepted. We are not responsible for incorrect addresses or network delays.\n \u00A0•\u00A0 Fees and exchange rates may apply and are visible before confirming any transaction.',
  },
  {
    title: '6. Risk Disclosure',
    description:
      'Using cryptocurrencies carries inherent risks including volatility, network errors, and regulatory changes. You acknowledge and accept these risks when using DynoPay.\nWe do not offer investment advice or financial guarantees.',
  },
  {
    title: '7. AML & KYC',
    description:
      'All users must comply with our AML Policy. We may request verification documents at any time and may freeze or terminate accounts for suspicious activity.',
  },
  {
    title: '8. Account Suspension & Termination',
    description:
      'We may suspend or terminate your access to DynoPay without notice if:\n \u00A0•\u00A0 You breach these Terms\n \u00A0•\u00A0 We suspect unauthorized or unlawful activity\n \u00A0•\u00A0 Required by law enforcement or regulators\n\nUpon termination, we may restrict access to funds pending investigation.',
  },
  {
    title: '9. Intellectual Property',
    description:
      'All content, logos, trademarks, and code on the DynoPay platform are the property of DynoPay or its licensors. You may not copy, distribute, or reverse engineer any part of the service without permission.',
  },
  {
    title: '10. Disclaimer of Warranties',
    description:
      'DynoPay is provided \"as is\" without warranties of any kind. We do not guarantee:\n \u00A0•\u00A0 Continuous or error-free service\n \u00A0•\u00A0 That any transaction will be completed\n \u00A0•\u00A0 Accuracy of third-party data (e.g., exchange rates)',
  },
  {
    title: '11. Limitation of Liability',
    description:
      'To the maximum extent permitted by law, DynoPay is not liable for:\n \u00A0•\u00A0 Indirect or consequential losses\n \u00A0•\u00A0 Loss of funds due to user error (e.g., wrong wallet address)\n \u00A0•\u00A0 Network failures or force majeure events',
  },
  {
    title: '12. Modifications',
    description:
      'We reserve the right to modify these Terms at any time. If material changes are made, we will notify users via email or on-platform notice. Continued use of the service constitutes acceptance of the updated Terms.',
  },
  {
    title: '13. Governing Law',
    description:
      'These Terms are governed by the laws of [укажи юрисдикцию, например: Portugal or Estonia]. Any disputes shall be subject to the exclusive jurisdiction of the courts in that jurisdiction.',
  },
  {
    title: '14. Contact Us',
    description:
      'If you have any questions regarding these Terms, please contact us at:\nsupport@dynopay.com',
  },
];

const TermsOfService = () => {
  return (
    <Pay3Layout>
      <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 } }}>
        <BackButton onClick={() => history.back()} />

        <Box sx={{ mt: '26px' }}>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ color: '#2D3282', fontFamily: 'Space Grotesk', fontSize: { xs: '36px', sm: '50px' } }}
          >
            Terms of Service
          </Typography>
          <Typography variant="body2" color="#707070" sx={{ mt: '12px' }}>
            Last Updated January 11, 2025
          </Typography>
        </Box>

        <Box sx={{mt:'12px'}}>
          <Typography variant="body1" mb={2} sx={{ fontFamily: 'Space Grotesk' }}>
            Welcome to DynoPay. By accessing or using our services, you agree to be bound by the following Terms of Service. Please read them carefully.
          </Typography>

          {termsSections.map((section, index) => (
            <Box key={index} sx={{ mt: '24px' }}>
              <Typography
                variant="subtitle1"
                fontWeight={500}
                sx={{ mb: '12px', fontFamily: 'Space Grotesk' }}
              >
                {section.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{ whiteSpace: 'pre-line', fontSize:"16px", lineHeight: 1.6, fontFamily: 'Space Grotesk' }}
              >
                {section.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Pay3Layout>
  );
};

export default TermsOfService;