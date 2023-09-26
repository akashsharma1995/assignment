import {
  validateAmount,
  validateLength,
  validateStringStart,
} from "./validation/validationRules";
import { ErrorsType, DuplicateData } from "../components/Disperse";


export const validate = (values: string []) => {
  const errors: ErrorsType [] = [];
  values.forEach((item, i) => {
    const result = validateLine(item);
    if (!result.isValid) {
      errors.push({ ...result, message: `Line ${i + 1} ${result.message}` });
    }
  });
  return errors;
};

export const validateLine = (line: string) => {
  const result: ErrorsType = {
    isValid: true,
    message: "",
  };
  if (!validateStringStart(line)) {
    result.isValid = false;
    result.message = "Invalid Ethereum Address";
  }
  if (!validateLength(line)) {
    result.isValid = false;
    result.message = "Invalid Ethereum Address";
  }
  if (!validateAmount(line)) {
    result.isValid = false;
    result.message = result.message
      ? `${result.message} and Wrong Amount`
      : "Wrong Amount";
  }
  return result;
};

export const checkDuplicate = (values: string []): DuplicateData => {
  const data: DuplicateData = {};
  values.forEach((item, i) => {
    const { address, amount, delimiter } = ethereumAddressDetails(item);
    data[address] = data[address]
      ? {
          ...data[address],
          [i + 1]: {
            amount,
            delimiter,
            token: item,
          },
        }
      : {
          [i + 1]: {
            amount,
            delimiter,
            token: item,
          },
        };
  });
  return data;
};

export const ethereumAddressDetails = (value: string) => {
  let address = "";
  let amount = 0;
  let delimiter = "";
  for (let i = value.length - 1; i >= 0; i--) {
    if (
      value.charAt(i) === " " ||
      value.charAt(i) === "=" ||
      value.charAt(i) === ","
    ) {
      address = value.split(value.charAt(i))[0];
      amount = +value.split(value.charAt(i))[1];
      delimiter = value.charAt(i);
      break;
    }
  }
  return {
    address,
    amount,
    delimiter
  };
};

export const generateDuplicateErrorMessages = (data: DuplicateData): ErrorsType [] => {
  const errorsArr: ErrorsType [] = [];
  for (let key in data) {
    if (Object.keys(data[key]).length > 1) {
      errorsArr.push({
        isValid: false,
        message: `${key} duplicate in Line: ${Object.keys(data[key])}`,
      });
    }
  }
  return errorsArr;
};
