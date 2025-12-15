import { subDays, subMonths, startOfToday, isAfter, isBefore } from "date-fns";

export const valueLengthValidator = (value) => {
  return value.length == 5;
};

export const nameValidator = (value) => {
  const criteria = /^[a-zA-Z][a-zA-Z-.' ]*$/;
  return criteria.test(value);
};

export const birthDateValidator = (_, vm) => {
  const data = vm.patientBirthdate;
  if (data instanceof Date && !isNaN(data)) {
    return true;
  } else {
    return false;
  }
};

export const dateDataValidator = (value) => {
  if (value && value instanceof Date && !isNaN(value)) {
    //instance of date checks that the date is valid, eg. January 32nd
    //!isNaN checks that the format isn't a string, eg. "Invalid Date"
    return true;
  }

  //no valid condition met, return false
  return false;
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

export const beforeTodayValidator = (value) => {
  if (value && value instanceof Date) {
    return isBefore(value, startOfToday());
  }
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

export const dateRangeValidator = (value, vm) => {
  if (vm.dateType === "date") {
    return true;
  }
  return isBefore(vm.claimFromDate, vm.claimToDate);
};

export const reportOrDescriptionValidator = (value, vm) => {
  if (
    (vm.consultationReport && vm.consultationReport.length !== 0) ||
    (vm.description && vm.description.length !== 0)
  ) {
    return true;
  }
  return false;
};
