export const formatNumber = (num: number, decimalPlaces: number = 3) => {
  if (num === undefined || num === null) {
    return 0;
  }
  if (isNaN(num)) {
    return 0;
  }
  if (num === Infinity) {
    return 0;
  }
  if (num === -Infinity) {
    return 0;
  }

  return +num.toFixed(decimalPlaces);
};
