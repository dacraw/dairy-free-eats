export const formatIntegerToMoney = (integer: number) => {
  return new Intl.NumberFormat("en-EN", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Number((integer / 100).toFixed(2)));
};
