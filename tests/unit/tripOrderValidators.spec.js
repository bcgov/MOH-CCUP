import { tripDateOrderValidator, tripTimeOrderValidator } from "@/helpers/validators.js";

const day = (d, hours = 0) => new Date(2024, 4, d, hours);

const trip = (overrides = {}) => ({
  date: day(15),
  departureHour: "09",
  departureMinute: "00",
  departureMeridiem: "AM",
  arrivalHour: "10",
  arrivalMinute: "00",
  arrivalMeridiem: "AM",
  ...overrides,
});

//vm is the current trip plus previousTrip, as the component supplies it
const dateOrder = (date, previous) => tripDateOrderValidator(date, { previousTrip: previous });
const timeOrder = (current, previous) =>
  tripTimeOrderValidator(current.departureMeridiem, { ...current, previousTrip: previous });

//previous trip arrives at the given time on the same day as the current trip
const arrivesAt = (hour, minute, meridiem) =>
  trip({ arrivalHour: hour, arrivalMinute: minute, arrivalMeridiem: meridiem });
//current trip departs at the given time
const departsAt = (hour, minute, meridiem) =>
  trip({ departureHour: hour, departureMinute: minute, departureMeridiem: meridiem });

describe("tripDateOrderValidator", () => {
  it("fails when the date is earlier than the previous trip date", () => {
    expect(dateOrder(day(14), trip({ date: day(15) }))).toBe(false);
  });

  it("passes on the same day as the previous trip", () => {
    expect(dateOrder(day(15), trip({ date: day(15) }))).toBe(true);
  });

  it("passes when the date is later than the previous trip date", () => {
    expect(dateOrder(day(16), trip({ date: day(15) }))).toBe(true);
  });

  it("compares calendar days, ignoring time of day", () => {
    expect(dateOrder(day(15, 8), trip({ date: day(15, 17) }))).toBe(true);
    expect(dateOrder(day(14, 23), trip({ date: day(15, 1) }))).toBe(false);
  });

  it("compares across a month and year boundary", () => {
    expect(dateOrder(new Date(2024, 4, 1), trip({ date: new Date(2024, 3, 30) }))).toBe(true);
    expect(dateOrder(new Date(2024, 3, 30), trip({ date: new Date(2024, 4, 1) }))).toBe(false);
    expect(dateOrder(new Date(2023, 11, 31), trip({ date: new Date(2024, 0, 1) }))).toBe(false);
  });

  it("passes for the first trip, which has no previous trip", () => {
    expect(dateOrder(day(14), undefined)).toBe(true);
  });

  it.each([
    ["this date is empty", ["", trip()]],
    ["this date is null", [null, trip()]],
    ["this date is an invalid Date", [new Date("nope"), trip()]],
    ["the previous date is empty", [day(14), trip({ date: "" })]],
    ["the previous date is an invalid Date", [day(14), trip({ date: new Date("nope") })]],
    ["this year is out of range", [new Date(1899, 4, 1), trip()]],
    ["the previous year is out of range", [day(14), trip({ date: new Date(2999, 4, 1) })]],
  ])("passes when %s", (_label, [date, previous]) => {
    expect(dateOrder(date, previous)).toBe(true);
  });
});

describe("tripTimeOrderValidator", () => {
  it("fails when departure is earlier than the previous arrival on the same day", () => {
    expect(timeOrder(departsAt("09", "29", "AM"), arrivesAt("09", "30", "AM"))).toBe(false);
  });

  it("passes when departure equals the previous arrival", () => {
    expect(timeOrder(departsAt("09", "30", "AM"), arrivesAt("09", "30", "AM"))).toBe(true);
  });

  it("passes when departure is later than the previous arrival", () => {
    expect(timeOrder(departsAt("09", "31", "AM"), arrivesAt("09", "30", "AM"))).toBe(true);
  });

  it("compares minutes within the same hour", () => {
    expect(timeOrder(departsAt("10", "05", "AM"), arrivesAt("10", "06", "AM"))).toBe(false);
    expect(timeOrder(departsAt("10", "07", "AM"), arrivesAt("10", "06", "AM"))).toBe(true);
  });

  it("treats PM as later than AM", () => {
    expect(timeOrder(departsAt("01", "00", "AM"), arrivesAt("01", "00", "PM"))).toBe(false);
    expect(timeOrder(departsAt("01", "00", "PM"), arrivesAt("01", "00", "AM"))).toBe(true);
  });

  it("treats 12 AM as midnight, before 01 AM", () => {
    expect(timeOrder(departsAt("12", "00", "AM"), arrivesAt("01", "00", "AM"))).toBe(false);
    expect(timeOrder(departsAt("01", "00", "AM"), arrivesAt("12", "00", "AM"))).toBe(true);
  });

  it("treats 12 PM as noon, before 01 PM and after 11 AM", () => {
    expect(timeOrder(departsAt("12", "00", "PM"), arrivesAt("01", "00", "PM"))).toBe(false);
    expect(timeOrder(departsAt("12", "00", "PM"), arrivesAt("11", "59", "AM"))).toBe(true);
    expect(timeOrder(departsAt("11", "59", "AM"), arrivesAt("12", "00", "PM"))).toBe(false);
  });

  it("treats 00 AM the same as 12 AM", () => {
    expect(timeOrder(departsAt("00", "00", "AM"), arrivesAt("12", "00", "AM"))).toBe(true);
    expect(timeOrder(departsAt("12", "00", "AM"), arrivesAt("00", "00", "AM"))).toBe(true);
    expect(timeOrder(departsAt("00", "00", "AM"), arrivesAt("00", "01", "AM"))).toBe(false);
    expect(timeOrder(departsAt("00", "00", "AM"), arrivesAt("01", "00", "AM"))).toBe(false);
  });

  it("treats 00 PM the same as 12 PM", () => {
    expect(timeOrder(departsAt("00", "00", "PM"), arrivesAt("12", "00", "PM"))).toBe(true);
    expect(timeOrder(departsAt("12", "00", "PM"), arrivesAt("00", "00", "PM"))).toBe(true);
    expect(timeOrder(departsAt("00", "00", "PM"), arrivesAt("12", "01", "PM"))).toBe(false);
    expect(timeOrder(departsAt("00", "00", "PM"), arrivesAt("11", "59", "AM"))).toBe(true);
  });

  it("keeps 12 PM after 12 AM, so noon is not read as midnight", () => {
    expect(timeOrder(departsAt("12", "00", "AM"), arrivesAt("12", "00", "PM"))).toBe(false);
    expect(timeOrder(departsAt("12", "00", "PM"), arrivesAt("12", "00", "AM"))).toBe(true);
  });

  it("passes whatever the times when the dates differ", () => {
    const current = { ...departsAt("01", "00", "AM"), date: day(16) };
    expect(timeOrder(current, arrivesAt("11", "00", "PM"))).toBe(true);
    const earlier = { ...departsAt("01", "00", "AM"), date: day(14) };
    expect(timeOrder(earlier, arrivesAt("11", "00", "PM"))).toBe(true);
  });

  it("compares the times when the same day has different clock times", () => {
    const current = { ...departsAt("01", "00", "AM"), date: day(15, 17) };
    expect(timeOrder(current, { ...arrivesAt("11", "00", "PM"), date: day(15, 8) })).toBe(false);
  });

  it("passes for the first trip, which has no previous trip", () => {
    expect(timeOrder(departsAt("01", "00", "AM"), undefined)).toBe(true);
  });

  it.each([
    ["this date is empty", { date: "" }, {}],
    ["this date is an invalid Date", { date: new Date("nope") }, {}],
    ["this year is out of range", { date: new Date(1899, 4, 15) }, { date: new Date(1899, 4, 15) }],
    ["the previous date is empty", {}, { date: "" }],
    ["the previous date is an invalid Date", {}, { date: new Date("nope") }],
    [
      "the previous year is out of range",
      { date: new Date(2999, 4, 15) },
      { date: new Date(2999, 4, 15) },
    ],
    ["the departure hour is empty", { departureHour: "" }, {}],
    ["the departure hour is out of range", { departureHour: "13" }, {}],
    ["the departure hour is one digit", { departureHour: "1" }, {}],
    ["the departure minute is empty", { departureMinute: "" }, {}],
    ["the departure minute is out of range", { departureMinute: "60" }, {}],
    ["the departure meridiem is empty", { departureMeridiem: "" }, {}],
    ["the departure meridiem is unrecognised", { departureMeridiem: "XM" }, {}],
    ["the previous arrival hour is empty", {}, { arrivalHour: "" }],
    ["the previous arrival hour is out of range", {}, { arrivalHour: "13" }],
    ["the previous arrival minute is empty", {}, { arrivalMinute: "" }],
    ["the previous arrival minute is out of range", {}, { arrivalMinute: "60" }],
    ["the previous arrival meridiem is empty", {}, { arrivalMeridiem: "" }],
    ["the previous arrival meridiem is unrecognised", {}, { arrivalMeridiem: "XM" }],
  ])("passes when %s", (_label, currentOverrides, previousOverrides) => {
    //the valid defaults would otherwise fail: departs 09:00 AM, previous arrives 10:00 AM
    const current = trip(currentOverrides);
    const previous = trip(previousOverrides);
    expect(timeOrder(trip(), trip())).toBe(false);
    expect(timeOrder(current, previous)).toBe(true);
  });
});
