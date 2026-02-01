import checkTouched from "./checkTouchedHelper";
import checkValidation from "./checkValidationHelper";
import createEncryption from "./createEncryption";

import getRandomColor from "./getRandomColor";
import getRandomNumber from "./getRandomNumber";
import inputHelper from "./inputHelper";
import unAuthorizedHelper from "./unAutorizedHelper";

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const firstCapital = (string: string) => {
  let hasDash = false;
  if (string?.includes("_")) {
    hasDash = true;
  }

  const str = hasDash
    ? string.split("_").join(" ").toLowerCase()
    : string.toLowerCase();

  const returnedString = str.charAt(0).toUpperCase() + str.slice(1);

  return returnedString;
};

const extractLinks = (text: string) => {
  const regex = /^(https):\/\/[^ "]+\.[^ "]+$/;
  return text.match(regex);
};

const getTime = (dateStamp: any) => {
  const date = new Date(dateStamp);

  let hours = date.getHours();
  let minutes: any = date.getMinutes();
  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
};

const generateRedirectUrl = (data: any) => {
  let url;
  url =
    process.env.NEXT_PUBLIC_SERVER_URL +
    "pay/verify?response=" +
    JSON.stringify(data);

  return url;
};

const generateStatusUrl = (data: any) => {
  let url;
  const status = data?.status;
  if (status === "successful") {
    url =
      process.env.NEXT_PUBLIC_SERVER_URL +
      "pay/success?response=" +
      JSON.stringify(data);
  } else {
    url =
      process.env.NEXT_PUBLIC_SERVER_URL +
      "pay/failed?response=" +
      JSON.stringify(data);
  }
  return url;
};

const getCurrencySymbol = (currency: any, amount: any) => {
  const symbols: Record<string, string> = {
    // International
    USD: '$',
    EUR: '€',
    GBP: '£',
    AUD: 'A$',
    CAD: 'C$',
    CHF: 'Fr',
    CNY: '¥',
    JPY: '¥',
    HKD: 'HK$',
    NZD: 'NZ$',
    SGD: 'S$',
    // Latin America
    BRL: 'R$',
    ARS: '$',
    COP: '$',
    CLP: '$',
    PEN: 'S/',
    MXN: '$',
    VES: 'Bs',
    UYU: '$U',
    // Africa
    NGN: '₦',
    ZAR: 'R',
    KES: 'KSh',
    GHS: '₵',
    TZS: 'TSh',
    XAF: 'FCFA',
    XOF: 'CFA',
    EGP: 'E£',
    MAD: 'DH',
    UGX: 'USh',
    RWF: 'FRw',
    ETB: 'Br',
    ZMW: 'ZK',
    BWP: 'P',
    MUR: '₨',
    AOA: 'Kz',
    MZN: 'MT',
    CDF: 'FC',
  };

  const symbol = symbols[currency?.toUpperCase()] || '';
  return symbol ? `${symbol} ${amount}` : String(amount);
};

export {
  a11yProps,
  inputHelper,
  getRandomColor,
  checkValidation,
  checkTouched,
  unAuthorizedHelper,
  firstCapital,
  extractLinks,
  getRandomNumber,
  createEncryption,
  getTime,
  generateRedirectUrl,
  getCurrencySymbol,
  generateStatusUrl,
};
