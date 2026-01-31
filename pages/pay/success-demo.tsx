import React, { useState } from 'react'
import { Box, Button, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material'
import TransferExpectedCard from '@/Components/UI/TransferExpectedCard/Index'
import Pay3Layout from '@/Components/Layout/Pay3Layout'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetServerSideProps } from 'next'

// Demo scenarios
const scenarios = {
  // With redirect + with email
  redirectWithEmail: {
    isTrue: true,
    redirectUrl: 'https://acme-store.com/order/complete',
    transactionId: 'TXN-2026-A1B2C3',
    merchantName: 'Acme Store',
    amount: '€125.50 EUR',
    email: 'john@email.com'
  },
  // With redirect + no email
  redirectNoEmail: {
    isTrue: true,
    redirectUrl: 'https://acme-store.com/order/complete',
    transactionId: 'TXN-2026-A1B2C3',
    merchantName: 'Acme Store',
    amount: '€125.50 EUR',
    email: ''
  },
  // No redirect + with email
  noRedirectWithEmail: {
    isTrue: true,
    redirectUrl: null,
    transactionId: 'TXN-2026-A1B2C3',
    merchantName: 'Acme Store',
    amount: '€125.50 EUR',
    email: 'john@email.com'
  },
  // No redirect + no email
  noRedirectNoEmail: {
    isTrue: true,
    redirectUrl: null,
    transactionId: 'TXN-2026-A1B2C3',
    merchantName: 'Acme Store',
    amount: '€125.50 EUR',
    email: ''
  },
  // Pending state
  pending: {
    isTrue: false,
    redirectUrl: null,
    transactionId: 'TXN-2026-A1B2C3',
    merchantName: '',
    amount: '',
    email: ''
  }
}

type ScenarioKey = keyof typeof scenarios

const SuccessDemo = () => {
  const { t } = useTranslation('common')
  const [currentScenario, setCurrentScenario] = useState<ScenarioKey>('noRedirectWithEmail')

  const handleScenarioChange = (
    event: React.MouseEvent<HTMLElement>,
    newScenario: ScenarioKey | null
  ) => {
    if (newScenario) {
      setCurrentScenario(newScenario)
    }
  }

  const scenario = scenarios[currentScenario]

  return (
    <Pay3Layout>
      <Box>
        {/* Scenario Selector */}
        <Box 
          sx={{ 
            position: 'fixed', 
            top: 80, 
            left: '50%', 
            transform: 'translateX(-50%)',
            zIndex: 1000,
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderRadius: 2,
            p: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          <Typography variant="caption" display="block" mb={1} fontWeight={600}>
            Demo Scenario:
          </Typography>
          <ToggleButtonGroup
            value={currentScenario}
            exclusive
            onChange={handleScenarioChange}
            size="small"
            sx={{ flexWrap: 'wrap', gap: 0.5 }}
          >
            <ToggleButton value="redirectWithEmail" sx={{ fontSize: 11, px: 1.5 }}>
              Redirect + Email
            </ToggleButton>
            <ToggleButton value="redirectNoEmail" sx={{ fontSize: 11, px: 1.5 }}>
              Redirect Only
            </ToggleButton>
            <ToggleButton value="noRedirectWithEmail" sx={{ fontSize: 11, px: 1.5 }}>
              Email Only
            </ToggleButton>
            <ToggleButton value="noRedirectNoEmail" sx={{ fontSize: 11, px: 1.5 }}>
              No Redirect/Email
            </ToggleButton>
            <ToggleButton value="pending" sx={{ fontSize: 11, px: 1.5 }}>
              Pending
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Card Display */}
        <Box pt={12}>
          <TransferExpectedCard
            key={currentScenario} // Force re-render on scenario change
            isTrue={scenario.isTrue}
            dataUrl=""
            type="bank"
            redirectUrl={scenario.redirectUrl}
            transactionId={scenario.transactionId}
            merchantName={scenario.merchantName}
            amount={scenario.amount}
            email={scenario.email}
          />
        </Box>
      </Box>
    </Pay3Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  }
}

export default SuccessDemo
