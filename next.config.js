const { i18n } = require('./next-i18next.config.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ["mui-tel-input"],
  
  // Enable standalone output for Railway
  output: 'standalone',
  
  // i18n configuration
  i18n,
};

// Log on startup
if (process.env.NODE_ENV === 'production') {
  console.log(`[${new Date().toISOString()}] ✅ Next.js config loaded`);
  console.log(`[${new Date().toISOString()}] ✅ Server URL: ${process.env.NEXT_PUBLIC_SERVER_URL || 'not set'}`);
}

module.exports = nextConfig;
