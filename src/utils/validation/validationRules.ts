import { ethereumAddressDetails } from "../disperseUtils";

export const validateStringStart = (value: string): boolean => {
  return value.startsWith("0x") ? true : false;
};

export const validateLength = (value: string): boolean  => {
  const { address } = ethereumAddressDetails(value);
  return address?.length === 42 ? true : false;
};

export const validateAmount = (value: string): boolean => {
  let isValid = true;
  for (let i = value.length - 1; i >= 0; i--) {
    if (
      value.charAt(i) === " " ||
      value.charAt(i) === "=" ||
      value.charAt(i) === ","
    ) {
      const amount = +value.split(value.charAt(i))[1];
      isValid = !amount || isNaN(amount) ? false : true;
      break;
    }
  }
  return isValid;
};