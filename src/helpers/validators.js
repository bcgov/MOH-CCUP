import { subDays, subMonths, startOfToday, startOfDay, isAfter, isBefore, isEqual } from "date-fns";

export const valueLengthValidator = (value) => {
  return value.length == 5;
};

export const nameValidator = (value) => {
  const criteria = /^[a-zA-Z][a-zA-Z-.' ]*$/;
  return criteria.test(value);
};

export const emailValidator = (value) => {
  const criteria = /^[A-Za-z0-9._+-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/;
  return criteria.test(value);
};

export const postalCodeFormatValidator = (value) => {
  const criteria = /^[A-Za-z]\d[A-Za-z][ ]?\d[A-Za-z]\d$/;
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
    return value && (isBefore(value, past90Days) || isEqual(value, past90Days));
  }
  //date is not valid, don't need to trigger this validation message
  return true;
};

export const lessThan18MonthsValidator = (value) => {
  if (value && value instanceof Date) {
    //date is valid. Is it within the last 90 days?
    const past18Months = subMonths(startOfToday(), 18);
    return value && (isAfter(value, past18Months) || isEqual(value, past18Months));
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

//two digits, 00 to 12; 00 is accepted on purpose for now (may be used for 24-hour times)
export const hourValidator = (value) => {
  return /^(0[0-9]|1[0-2])$/.test(value);
};

//two digits, 00 to 59
export const minuteValidator = (value) => {
  return /^[0-5][0-9]$/.test(value);
};

export const yearRangeValidator = (value) => {
  if (value instanceof Date && !isNaN(value)) {
    const year = value.getFullYear();
    return year >= 1900 && year <= new Date().getFullYear();
  }
  //not a valid date, dateDataValidator reports it
  return true;
};

//true when the trip date is a real date inside the allowed year range
const hasValidTripDate = (date) => {
  return dateDataValidator(date) && yearRangeValidator(date);
};

//minutes since midnight from a 12-hour time; hour 00 and 12 both mean hour 0 of the meridiem
const toMinutes = (hour, minute, meridiem) => {
  return ((Number(hour) % 12) + (meridiem === "PM" ? 12 : 0)) * 60 + Number(minute);
};

//minutes for a time whose parts all pass the per-field rules, otherwise null
const validTimeMinutes = (hour, minute, meridiem) => {
  if (hourValidator(hour) && minuteValidator(minute) && (meridiem === "AM" || meridiem === "PM")) {
    return toMinutes(hour, minute, meridiem);
  }
  return null;
};

//trip date is not earlier than the previous trip date (same day is allowed);
//valid when either date is missing or invalid, those have their own messages
export const tripDateOrderValidator = (value, vm) => {
  const previous = vm.previousTrip;
  if (!previous || !hasValidTripDate(value) || !hasValidTripDate(previous.date)) {
    return true;
  }
  return !isBefore(startOfDay(value), startOfDay(previous.date));
};

//on the same day, departure is not earlier than the previous trip arrival (equal is allowed);
//valid when either date or either time is missing or invalid
export const tripTimeOrderValidator = (value, vm) => {
  const previous = vm.previousTrip;
  if (!previous || !hasValidTripDate(vm.date) || !hasValidTripDate(previous.date)) {
    return true;
  }
  if (!isEqual(startOfDay(vm.date), startOfDay(previous.date))) {
    return true;
  }
  const departure = validTimeMinutes(vm.departureHour, vm.departureMinute, vm.departureMeridiem);
  const previousArrival = validTimeMinutes(
    previous.arrivalHour,
    previous.arrivalMinute,
    previous.arrivalMeridiem
  );
  if (departure === null || previousArrival === null) {
    return true;
  }
  return departure >= previousArrival;
};
