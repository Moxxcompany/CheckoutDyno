interface CurrencyFormat {
  symbol: string;
  decimals: number;
  locale: string;
}

const currencyFormats: Record<string, CurrencyFormat> = {
  // International
  USD: { symbol: '$', decimals: 2, locale: 'en-US' },
  EUR: { symbol: '€', decimals: 2, locale: 'de-DE' },
  GBP: { symbol: '£', decimals: 2, locale: 'en-GB' },
  AUD: { symbol: 'A$', decimals: 2, locale: 'en-AU' },
  CAD: { symbol: 'C$', decimals: 2, locale: 'en-CA' },
  CHF: { symbol: 'Fr', decimals: 2, locale: 'de-CH' },
  CNY: { symbol: '¥', decimals: 2, locale: 'zh-CN' },
  JPY: { symbol: '¥', decimals: 0, locale: 'ja-JP' },
  HKD: { symbol: 'HK$', decimals: 2, locale: 'zh-HK' },
  NZD: { symbol: 'NZ$', decimals: 2, locale: 'en-NZ' },
  SGD: { symbol: 'S$', decimals: 2, locale: 'en-SG' },
  // Latin America
  BRL: { symbol: 'R$', decimals: 2, locale: 'pt-BR' },
  ARS: { symbol: '$', decimals: 2, locale: 'es-AR' },
  COP: { symbol: '$', decimals: 0, locale: 'es-CO' },
  CLP: { symbol: '$', decimals: 0, locale: 'es-CL' },
  PEN: { symbol: 'S/', decimals: 2, locale: 'es-PE' },
  MXN: { symbol: '$', decimals: 2, locale: 'es-MX' },
  VES: { symbol: 'Bs', decimals: 2, locale: 'es-VE' },
  UYU: { symbol: '$U', decimals: 2, locale: 'es-UY' },
  // Africa
  NGN: { symbol: '₦', decimals: 2, locale: 'en-NG' },
  ZAR: { symbol: 'R', decimals: 2, locale: 'en-ZA' },
  KES: { symbol: 'KSh', decimals: 2, locale: 'en-KE' },
  GHS: { symbol: '₵', decimals: 2, locale: 'en-GH' },
  TZS: { symbol: 'TSh', decimals: 0, locale: 'sw-TZ' },
  XAF: { symbol: 'FCFA', decimals: 0, locale: 'fr-CM' },
  XOF: { symbol: 'CFA', decimals: 0, locale: 'fr-SN' },
  EGP: { symbol: 'E£', decimals: 2, locale: 'ar-EG' },
  MAD: { symbol: 'DH', decimals: 2, locale: 'ar-MA' },
  UGX: { symbol: 'USh', decimals: 0, locale: 'en-UG' },
  RWF: { symbol: 'FRw', decimals: 0, locale: 'rw-RW' },
  ETB: { symbol: 'Br', decimals: 2, locale: 'am-ET' },
  ZMW: { symbol: 'ZK', decimals: 2, locale: 'en-ZM' },
  BWP: { symbol: 'P', decimals: 2, locale: 'en-BW' },
  MUR: { symbol: '₨', decimals: 2, locale: 'en-MU' },
  AOA: { symbol: 'Kz', decimals: 2, locale: 'pt-AO' },
  MZN: { symbol: 'MT', decimals: 2, locale: 'pt-MZ' },
  CDF: { symbol: 'FC', decimals: 2, locale: 'fr-CD' },
};

export const formatCurrency = (amount: number, currency: string): string => {
  const format = currencyFormats[currency?.toUpperCase()] || { symbol: '', decimals: 2, locale: 'en-US' };
  
  try {
    return new Intl.NumberFormat(format.locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: format.decimals,
      maximumFractionDigits: format.decimals
    }).format(amount);
  } catch {
    // Fallback for unsupported currencies
    return `${format.symbol} ${amount.toFixed(format.decimals)}`;
  }
};

export const getCurrencyDecimals = (currency: string): number => {
  return currencyFormats[currency?.toUpperCase()]?.decimals ?? 2;
};

export const getCurrencySymbolFromFormat = (currency: string): string => {
  return currencyFormats[currency?.toUpperCase()]?.symbol ?? '';
};

export default currencyFormats;
