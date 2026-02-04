const { i18n } = require('./next-i18next.config.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ["mui-tel-input"],
  
  // i18n configuration
  i18n,
  
  // Optimize for faster startup
  poweredByHeader: false,
  compress: true,
};

module.exports = nextConfig;
