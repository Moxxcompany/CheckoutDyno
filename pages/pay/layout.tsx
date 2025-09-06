import Header from '@/Components/Page/Pay3Components/header';
import Footer from '@/Components/UI/Footer';
import { Box } from '@mui/material';
import React, { useState } from 'react';

export default function Pay3Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [darkMode, setDarkMode] = useState(false)
    const toggleDarkMode = () => setDarkMode(!darkMode)

    return (
        <Box sx={{ minHeight: '100vh', background: '#F5F8FF' }}>
            <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <main style={{ minHeight: 'calc(100vh - 210px)' }}>
                {children}
            </main>
            <Footer />
        </Box>
    );
}