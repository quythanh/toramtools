export const formatNumber = (num?: number) =>
  num ? new Intl.NumberFormat().format(num) : 'NaN';
