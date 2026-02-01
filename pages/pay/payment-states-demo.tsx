import React, { useState } from 'react'
import { Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material'
import OverPayment from '@/Components/UI/OverPayment/Index'
import UnderPayment from '@/Components/UI/UnderPayment/Index'
import Pay3Layout from '@/Components/Layout/Pay3Layout'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetServerSideProps } from 'next'

type DemoState = 'overpayment' | 'underpayment'

const PaymentStatesDemo = () => {
  const { t } = useTranslation('common')
  const [currentState, setCurrentState] = useState<DemoState>('overpayment')

  const handleStateChange = (
    event: React.MouseEvent<HTMLElement>,
    newState: DemoState | null
  ) => {
    if (newState) {
      setCurrentState(newState)
    }
  }

  // Mock handlers
  const handlePayRemaining = (method: "bank" | "crypto") => {
    console.log('Pay remaining with:', method)
  }

  const handleGoToWebsite = () => {
    console.log('Go to website clicked')
  }

  return (
    <Pay3Layout>
      <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
        {/* Scenario Selector */}
        <Box 
          sx={{ 
            mb: 3, 
            p: 2, 
            bgcolor: 'background.paper', 
            borderRadius: 2,
            boxShadow: 1
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Demo State:
          </Typography>
          <ToggleButtonGroup
            value={currentState}
            exclusive
            onChange={handleStateChange}
            size="small"
            sx={{ flexWrap: 'wrap', gap: 1 }}
          >
            <ToggleButton value="overpayment" sx={{ textTransform: 'none' }}>
              Overpayment
            </ToggleButton>
            <ToggleButton value="underpayment" sx={{ textTransform: 'none' }}>
              Underpayment
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Render Component */}
        {currentState === 'overpayment' && (
          <OverPayment
            paidAmount={0.00825}
            expectedAmount={0.00758}
            excessAmount={0.00067}
            currency="ETH"
            onGoToWebsite={handleGoToWebsite}
            transactionId="TXN-2026-DEMO123"
            paidAmountUsd={18.50}
            expectedAmountUsd={17.00}
            excessAmountUsd={1.50}
            baseCurrency="USD"
            displayCurrency="GBP"
            transferRate={0.79}
          />
        )}

        {currentState === 'underpayment' && (
          <UnderPayment
            paidAmount={0.00450}
            expectedAmount={0.00758}
            remainingAmount={0.00308}
            currency="ETH"
            onPayRemaining={handlePayRemaining}
            transactionId="TXN-2026-DEMO456"
            paidAmountUsd={10.00}
            expectedAmountUsd={17.00}
            remainingAmountUsd={7.00}
            baseCurrency="USD"
            graceMinutes={15}
            displayCurrency="GBP"
            transferRate={0.79}
          />
        )}
      </Box>
    </Pay3Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const geoData = {
    locale: context.locale || 'en'
  }

  return {
    props: {
      ...(await serverSideTranslations(geoData.locale, ['common'])),
    },
  }
}

export default PaymentStatesDemo
