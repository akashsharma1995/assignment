import { useState, FC } from "react";
import TextArea from "./TextArea";
import Button from "./Button";
import Errors from "./Errors";
import {
  validate,
  checkDuplicate,
  generateDuplicateErrorMessages,
} from "../utils/disperseUtils";
import { ethereumAddressDetails } from "../utils/disperseUtils";

export type ErrorsType = {
  isValid: boolean;
  message: string;
}

export type DuplicateData = {
  [address: string]: {
    [lineNumber: number]: {
      amount: number;
      // token refers to a line including address delimiter & amount
      token: string;
      delimiter: string;
    }
  }
}

const Disperse: FC = () => {
  const [errors, setErrors] = useState<ErrorsType []>([]);
  const [value, setValue] = useState<string>("");
  const [isduplicated, setIsDuplicated] = useState<boolean>(false);
  const [duplicateValidationData, setDuplicateValidationData] = useState<DuplicateData>({});
  const [isSubmittedOnce, setIsSubmittedOnce] = useState(false);

  const handleSubmit = () => {
    validateData();
    if(value !== "") {
      setIsSubmittedOnce(true);
    }
  };

  const validateData = (data?: string) => {
    const valueString: string = data || value;
    if(value === "") {
      resetErrors();
      return;
    }
    const valueSplittedByLines = valueString.split(/\r?\n/);
    const errors: ErrorsType[] = validate(valueSplittedByLines);
    errors.length > 0 ? setErrors(errors) : setErrors([]);
    setIsDuplicated(false);
    setDuplicateValidationData({});
    if (errors.length !== 0) {
      return;
    }
    // Check for duplicate addresses if all the addresses are valid
    const duplicateValidationResult = checkDuplicate(valueSplittedByLines);
    const duplicateErrors = generateDuplicateErrorMessages(
      duplicateValidationResult
    );
    if (duplicateErrors.length > 0) {
      setIsDuplicated(true);
      setDuplicateValidationData(duplicateValidationResult);
    }
    setErrors(duplicateErrors);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if(isSubmittedOnce) {
      validateData(e.target.value);
    }
  };

  const handleKeepFirstOne = () => {
    let updatedValue = "";
    for (let key in duplicateValidationData) {
      const firstOccuranceAtLine: number = +Object.keys(duplicateValidationData[key])[0];
      const token = duplicateValidationData[key][firstOccuranceAtLine].token;
      updatedValue = updatedValue ? `${updatedValue}\n${token}` : token;
    }
    setValue(updatedValue);
    resetErrors();
  };

  const handleCombineDuplicates = () => {
    let updatedValue = "";
    for (let key in duplicateValidationData) {
      const occuranceAtLines = Object.keys(duplicateValidationData[key]);
      const firstOccuranceAtLine: number = +occuranceAtLines[0];
      const tokenAtFirstOccurance = duplicateValidationData[key][firstOccuranceAtLine].token;
      const combinedAmount = occuranceAtLines.reduce(
        (accumulator: number, currentValue: any) => {
          return (
            accumulator +
            Number(duplicateValidationData[key][currentValue].amount)
          );
        },
        0
      );
      const { delimiter, address } = ethereumAddressDetails(
        tokenAtFirstOccurance
      );
      const updatedToken = `${address}${delimiter}${combinedAmount}`;
      updatedValue = updatedValue
        ? `${updatedValue}\n${updatedToken}`
        : updatedToken;
    }
    setValue(updatedValue);
    resetErrors();
  };

  const resetErrors = () => {
    setErrors([]);
    setIsDuplicated(false);
    setDuplicateValidationData({});
  };

  return (
    <div className="p-5 bg-gray-800 max-w-[800px] m-auto">
      <div className="flex justify-between mb-4">
        <span className="text-white font-medium">Addresses with Amounts</span>
        <span className="text-slate-300 font-medium">Upload File</span>
      </div>
      <TextArea value={value} handleChange={handleChange} />
      <div className="flex justify-between my-3">
        <span className="text-white font-medium">
          Separated by "," or "" or "="
        </span>
        <span className="text-gray-500 font-medium">Show Example</span>
      </div>
      {isduplicated && (
        <div className="flex justify-between my-3">
          <span className="text-white font-medium">Duplicated</span>
          <div className="text-red-700 font-bold">
            <span
              className="hover:cursor-pointer"
              onClick={() => handleKeepFirstOne()}
            >
              Keep the first one
            </span>{" "}
            |{" "}
            <span
              className="hover:cursor-pointer"
              onClick={() => handleCombineDuplicates()}
            >
              Combine
            </span>
          </div>
        </div>
      )}

      {
        errors.length > 0 && <Errors errors={errors} />
      }

      <Button onClick={handleSubmit} disabled={errors.length === 0 ? false : true}>Submit</Button>
    </div>
  );
};

export default Disperse;
