const currencySymbols = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$',
  CHF: 'Fr.',
  CNY: '¥',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
  PLN: 'zł',
  CZK: 'Kč',
  HUF: 'Ft',
  RUB: '₽',
  INR: '₹',
  BRL: 'R$',
  MXN: '$',
  KRW: '₩',
  SGD: 'S$',
  NZD: 'NZ$',
  ZAR: 'R'
};

export const getCurrencySymbol = (currencyCode) => {
  return currencySymbols[currencyCode] || currencyCode;
};

export const formatPrice = (price, currencyCode) => {
  const symbol = getCurrencySymbol(currencyCode);
  return `${symbol}${price}`;
};