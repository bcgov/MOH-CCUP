import { subDays, subMonths, startOfToday, isAfter, isBefore } from "date-fns";

export const valueLengthValidator = (value) => {
  return value.length == 5;
};

export const nameValidator = (value) => {
  const criteria = /^[a-zA-Z][a-zA-Z-.' ]*$/;
  return criteria.test(value);
};

export const dateFormatValidator = (value) => {
  if (value && value.date && value.date instanceof Date) {
    return true;
  } else {
    return false;
  }
};

export const claimServiceDateValidator = (value, vm) => {
  if (vm.dateType !== "date") {
    //claimServiceDate not needed-- date type is either "range" or "null"
    return true;
  }

  if (value && value instanceof Date) {
    //claimServiceDate is needed, and the date format is valid
    return true;
  }

  //no valid condition met, return false
  return false;
};

export const claimDateRangeValidator = (value, vm) => {
  if (vm.dateType !== "range") {
    //claimServiceDate not needed-- date type is either "date" or "null"
    return true;
  }

  if (value && value instanceof Date) {
    //claimServiceDate is needed, and the date format is valid
    return true;
  }

  //no valid condition met, return false
  return false;
};

export const moreThan90DaysValidator = (value) => {
  if (value && value instanceof Date) {
    //date is valid. Is it within the last 90 days?
    const past90Days = subDays(startOfToday(), 90);
    return value && isBefore(value, past90Days);
  }
  //date is not valid, don't need to trigger this validation message
  return true;
};

export const lessThan18MonthsValidator = (value) => {
  if (value && value instanceof Date) {
    //date is valid. Is it within the last 90 days?
    const past18Months = subMonths(startOfToday(), 18);
    return value && isAfter(value, past18Months);
  }
  //date is not valid, don't need to trigger this validation message
  return true;
};

export const phnFirstDigitValidator = (value) => {
  if (typeof value !== "string") {
    return false;
  }
  return value[0] === "9";
};

export const feeItemValidator = (value) => {
  const criteria = /^([0-9]{5})( *?, *?[0-9]{5})*( *?,? *?)$/;
  return criteria.test(value);
};

export const numericCommaValidator = (value) => {
  const criteria = /^[0-9, ]+$/;
  return criteria.test(value);
};
