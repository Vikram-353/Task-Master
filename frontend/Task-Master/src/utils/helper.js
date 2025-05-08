export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const addThousandSeperator = (num) => {
  if (num == null || isNaN(num)) return "";

  const [integerPart, fractionPart] = num.toString().split(".");

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fractionPart
    ? `${formattedInteger}.${fractionPart}`
    : formattedInteger;
};
