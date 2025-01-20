// import { getISODateString, isValidISODateString } from "./date";

export const valueLengthValidator = (value) => {
  return value.length == 5;
};

export const nameValidator = (value) => {
  const criteria = /^[a-zA-Z][a-zA-Z-.' ]*$/;
  return criteria.test(value);
};

export const dateDataValidator = (_, vm) => {
  const data = vm.patientBirthdate;

  if (data instanceof Date && !isNaN(data)) {
    return true;
  } else {
    return false;
  }
};

export const phnFirstDigitValidator = (value) => {
  if (typeof value !== "string") {
    return false;
  }
  return value[0] === "9";
};
