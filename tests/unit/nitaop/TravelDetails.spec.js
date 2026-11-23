import Page from "@/views/nitaop/TravelDetails.vue";
import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import { vi } from "vitest";
import { routes } from "@/router/index.js";
import { useNitaopStore } from "@/stores/nitaopStore";
import { createStubRouter, errorTexts, blurValue, clickContinue } from "./helpers";

const router = createStubRouter(routes.NITAOP_STEP_2, routes.NITAOP_STEP_3);
const scrollSpy = vi.spyOn(window, "scrollTo").mockImplementation(() => {});

const HEALTH_AUTHORITY_ERROR = "Health authority is required.";
const DATE_ERROR = "Date must be a valid date.";
const DEPARTURE_REQUIRED_ERROR = "Select AM or PM for departure time.";
const dateOrderError = (n) => `Date must not be earlier than the date of Trip # ${n}.`;
const timeOrderError = (n) =>
  `Departure time must not be earlier than the arrival time of Trip # ${n}.`;
const currentYear = new Date().getFullYear();

const VALID_TRIP = {
  date: { month: 5, day: "15", year: "2024" },
  communityDeparted: "Prince George",
  departureHour: "09",
  departureMinute: "30",
  departureMeridiem: "am",
  communityArrived: "Fort St. John",
  arrivalHour: "12",
  arrivalMinute: "59",
  arrivalMeridiem: "pm",
  patientsSeen: "0",
};

describe("NITAOP TravelDetails.vue", () => {
  let wrapper = null;
  let pushSpy = null;
  let store = null;

  const fillDate = async (i, { month, day, year }) => {
    await wrapper.find(`#trip-date-${i}-month`).setValue(month);
    await wrapper.find(`#trip-date-${i}-day`).setValue(day);
    await blurValue(wrapper, `#trip-date-${i}-year`, year);
  };
  const fillTrip = async (i, values = VALID_TRIP) => {
    await fillDate(i, values.date);
    await blurValue(wrapper, `#trip-community-departed-${i}`, values.communityDeparted);
    await blurValue(wrapper, `#trip-departure-hour-${i}`, values.departureHour);
    await blurValue(wrapper, `#trip-departure-minute-${i}`, values.departureMinute);
    await wrapper.find(`#trip-departure-meridiem-${i}-${values.departureMeridiem}`).setValue();
    await blurValue(wrapper, `#trip-community-arrived-${i}`, values.communityArrived);
    await blurValue(wrapper, `#trip-arrival-hour-${i}`, values.arrivalHour);
    await blurValue(wrapper, `#trip-arrival-minute-${i}`, values.arrivalMinute);
    await wrapper.find(`#trip-arrival-meridiem-${i}-${values.arrivalMeridiem}`).setValue();
    await blurValue(wrapper, `#trip-patients-seen-${i}`, values.patientsSeen);
  };
  const selectAuthority = async (id = "mp") => {
    await wrapper.find(`#health-authority-${id}`).setValue();
  };
  const clickAdd = async () => {
    await wrapper.find('[data-cy="add-trip"]').trigger("click");
  };
  const addTrips = async (count) => {
    for (let n = 0; n < count; n++) {
      await clickAdd();
    }
  };

  beforeEach(async () => {
    router.push(routes.NITAOP_STEP_2.path);
    await router.isReady();
    setActivePinia(createPinia());
    store = useNitaopStore();
    pushSpy = vi.spyOn(router, "push").mockResolvedValue();
    scrollSpy.mockClear();

    wrapper = mount(Page, {
      attachTo: document.body,
      global: {
        plugins: [router],
      },
    });
  });

  afterEach(() => {
    pushSpy.mockRestore();
    wrapper.unmount();
  });

  describe("AC1 health authority", () => {
    it("shows the required error on Continue with no authority selected", async () => {
      expect(errorTexts(wrapper)).toEqual([]);

      await clickContinue(wrapper);

      expect(errorTexts(wrapper)).toContain(HEALTH_AUTHORITY_ERROR);
      expect(pushSpy).not.toHaveBeenCalled();
    });

    it("stores the full option text and clears the error when an authority is selected", async () => {
      await clickContinue(wrapper);
      await selectAuthority("mp");

      expect(store.formFields.travel.healthAuthority).toBe("MP – Mary Pack");
      expect(errorTexts(wrapper)).not.toContain(HEALTH_AUTHORITY_ERROR);
    });

    it("names the health authority radio group with the Health Authority heading", () => {
      const fieldset = wrapper.find("#health-authority-mp").element.closest("fieldset");
      const labelledBy = fieldset.getAttribute("aria-labelledby");
      expect(labelledBy).toBe("health-authority-heading");
      expect(wrapper.find(`#${labelledBy}`).text()).toBe("Health Authority");
    });

    it("lists the eight authorities with their full labels", () => {
      const labels = wrapper.findAll('input[name="health-authority"] + label').map((l) => l.text());
      expect(labels).toEqual([
        "FHA – Fraser Health Authority",
        "IHA – Interior Health Authority",
        "ISLH - Island Health",
        "MP – Mary Pack",
        "NHA – Northern Health Authority",
        "NVHB – Nisga’a Valley Health Authority",
        "VCHA – Vancouver Coastal Health Authority",
        "PHSA - Provincial Health Services Authority",
      ]);
    });
  });

  describe("AC2 trips", () => {
    it("starts with Trip # 1 and no delete button", () => {
      expect(wrapper.findAll("h3").map((h) => h.text())).toEqual(["Trip # 1"]);
      expect(wrapper.find('[data-cy="delete-trip-0"]').exists()).toBe(false);
      expect(wrapper.find('[data-cy="add-trip"]').text()).toBe("Add community");
    });

    it("adds a trip with Add community and shows delete buttons once there are two", async () => {
      await clickAdd();

      expect(wrapper.findAll("h3").map((h) => h.text())).toEqual(["Trip # 1", "Trip # 2"]);
      expect(wrapper.find('[data-cy="delete-trip-0"]').exists()).toBe(true);
      expect(wrapper.find('[data-cy="delete-trip-1"]').exists()).toBe(true);
    });

    it("hides the add button at 16 trips and shows it at 15", async () => {
      await addTrips(14);
      expect(wrapper.findAll("h3").length).toBe(15);
      expect(wrapper.find('[data-cy="add-trip"]').exists()).toBe(true);

      await clickAdd();
      expect(wrapper.findAll("h3").length).toBe(16);
      expect(wrapper.find('[data-cy="add-trip"]').exists()).toBe(false);

      await wrapper.find('[data-cy="delete-trip-15"]').trigger("click");
      expect(wrapper.findAll("h3").length).toBe(15);
      expect(wrapper.find('[data-cy="add-trip"]').exists()).toBe(true);
    });

    it("deletes a middle trip and the remaining trips keep their own values", async () => {
      await addTrips(2);
      await blurValue(wrapper, "#trip-community-departed-0", "Alpha");
      await blurValue(wrapper, "#trip-community-departed-1", "Bravo");
      await blurValue(wrapper, "#trip-community-departed-2", "Charlie");
      await blurValue(wrapper, "#trip-patients-seen-0", "10");
      await blurValue(wrapper, "#trip-patients-seen-1", "20");
      await blurValue(wrapper, "#trip-patients-seen-2", "30");

      await wrapper.find('[data-cy="delete-trip-1"]').trigger("click");

      expect(wrapper.findAll("h3").map((h) => h.text())).toEqual(["Trip # 1", "Trip # 2"]);
      expect(wrapper.find("#trip-community-departed-0").element.value).toBe("Alpha");
      expect(wrapper.find("#trip-community-departed-1").element.value).toBe("Charlie");
      expect(wrapper.find("#trip-patients-seen-0").element.value).toBe("10");
      expect(wrapper.find("#trip-patients-seen-1").element.value).toBe("30");
      expect(store.formFields.travel.trips.map((t) => t.communityDeparted)).toEqual([
        "Alpha",
        "Charlie",
      ]);
    });

    it("keeps a trip's error state with that trip when an earlier trip is deleted", async () => {
      await clickAdd();
      await blurValue(wrapper, "#trip-community-departed-1", "");
      expect(errorTexts(wrapper)).toEqual(["Community departed is required."]);

      await wrapper.find('[data-cy="delete-trip-0"]').trigger("click");

      expect(wrapper.findAll("h3").map((h) => h.text())).toEqual(["Trip # 1"]);
      expect(errorTexts(wrapper)).toEqual(["Community departed is required."]);
    });

    it("hides the delete buttons again when one trip is left", async () => {
      await clickAdd();
      await wrapper.find('[data-cy="delete-trip-0"]').trigger("click");

      expect(wrapper.findAll("h3").length).toBe(1);
      expect(wrapper.find('[data-cy="delete-trip-0"]').exists()).toBe(false);
    });
  });

  describe("AC2 trip collapse", () => {
    const toggle = (i) => wrapper.find(`[data-cy="toggle-trip-${i}"]`);
    const body = (i) => wrapper.find(`#trip-body-${store.formFields.travel.trips[i].id}`);

    it("collapses and expands a trip with the toggle and keeps aria-controls on the body id", async () => {
      expect(toggle(0).attributes("aria-label")).toBe("Trip # 1");
      expect(toggle(0).attributes("aria-controls")).toBe(body(0).attributes("id"));
      expect(toggle(0).attributes("aria-expanded")).toBe("true");
      expect(body(0).isVisible()).toBe(true);

      await toggle(0).trigger("click");
      expect(toggle(0).attributes("aria-expanded")).toBe("false");
      expect(body(0).isVisible()).toBe(false);

      await toggle(0).trigger("click");
      expect(toggle(0).attributes("aria-expanded")).toBe("true");
      expect(body(0).isVisible()).toBe(true);
    });

    it("hides Delete on a collapsed trip while the open trip keeps it", async () => {
      await clickAdd();
      await toggle(0).trigger("click");

      expect(body(0).isVisible()).toBe(false);
      expect(wrapper.find('[data-cy="delete-trip-0"]').isVisible()).toBe(false);
      expect(wrapper.find('[data-cy="delete-trip-1"]').isVisible()).toBe(true);
    });

    it("opens a collapsed trip that has errors on Continue and does not navigate", async () => {
      await toggle(0).trigger("click");
      expect(body(0).isVisible()).toBe(false);

      await clickContinue(wrapper);

      expect(toggle(0).attributes("aria-expanded")).toBe("true");
      expect(body(0).isVisible()).toBe(true);
      expect(pushSpy).not.toHaveBeenCalled();
    });

    it("keeps a collapsed trip collapsed when an earlier trip is deleted", async () => {
      await addTrips(2);
      await blurValue(wrapper, "#trip-community-departed-0", "Alpha");
      await blurValue(wrapper, "#trip-community-departed-1", "Bravo");
      await blurValue(wrapper, "#trip-community-departed-2", "Charlie");
      await toggle(1).trigger("click");

      await wrapper.find('[data-cy="delete-trip-0"]').trigger("click");

      expect(wrapper.find("#trip-community-departed-0").element.value).toBe("Bravo");
      expect(toggle(0).attributes("aria-expanded")).toBe("false");
      expect(body(0).isVisible()).toBe(false);
      expect(wrapper.find("#trip-community-departed-1").element.value).toBe("Charlie");
      expect(toggle(1).attributes("aria-expanded")).toBe("true");
      expect(body(1).isVisible()).toBe(true);
    });
  });

  describe("AC2 trip accordion", () => {
    const toggle = (i) => wrapper.find(`[data-cy="toggle-trip-${i}"]`);
    const body = (i) => wrapper.find(`#trip-body-${store.formFields.travel.trips[i].id}`);
    const summary = (i) => wrapper.find(`[data-cy="trip-summary-${i}"]`);
    const edit = (i) => wrapper.find(`[data-cy="edit-trip-${i}"]`);
    const del = (i) => wrapper.find(`[data-cy="delete-trip-${i}"]`);
    const DESIGN_TRIP = {
      date: { month: 8, day: "10", year: "2026" },
      communityDeparted: "Falls Creek",
      communityArrived: "Jordan River",
      patientsSeen: "10",
    };
    const fillSummaryParts = async (i, values) => {
      if (values.date) {
        await fillDate(i, values.date);
      }
      if (values.communityDeparted !== undefined) {
        await blurValue(wrapper, `#trip-community-departed-${i}`, values.communityDeparted);
      }
      if (values.communityArrived !== undefined) {
        await blurValue(wrapper, `#trip-community-arrived-${i}`, values.communityArrived);
      }
      if (values.patientsSeen !== undefined) {
        await blurValue(wrapper, `#trip-patients-seen-${i}`, values.patientsSeen);
      }
    };

    it("shows the chevron, a small Trip label, the summary and Edit on a collapsed trip", async () => {
      await fillSummaryParts(0, DESIGN_TRIP);
      await toggle(0).trigger("click");

      expect(toggle(0).attributes("aria-expanded")).toBe("false");
      expect(wrapper.find(".trip-header h3").text()).toBe("Trip # 1");
      expect(summary(0).text()).toBe(
        "Sep 10, 2026 - Falls Creek \u2192 Jordan River - 10 Patients"
      );
      expect(edit(0).isVisible()).toBe(true);
      expect(edit(0).text()).toBe("Edit");
      expect(edit(0).attributes("aria-label")).toBe("Edit Trip # 1");
    });

    it("shows no Delete anywhere visible on a collapsed trip even with several trips", async () => {
      await addTrips(2);
      await toggle(0).trigger("click");
      await toggle(1).trigger("click");

      for (const i of [0, 1]) {
        expect(edit(i).isVisible()).toBe(true);
        expect(del(i).isVisible()).toBe(false);
      }
      expect(del(2).isVisible()).toBe(true);
    });

    it("shows no summary and no Edit on an open trip", () => {
      expect(toggle(0).attributes("aria-expanded")).toBe("true");
      expect(summary(0).exists()).toBe(false);
      expect(edit(0).exists()).toBe(false);
      expect(wrapper.find(".trip-header h3").exists()).toBe(false);
    });

    it("shows Delete inside the body of an open trip when there is more than one trip", async () => {
      await clickAdd();

      for (const i of [0, 1]) {
        const button = body(i).find(`[data-cy="delete-trip-${i}"]`);
        expect(button.exists()).toBe(true);
        expect(button.isVisible()).toBe(true);
        expect(button.attributes("aria-label")).toBe(`Delete Trip # ${i + 1}`);
        expect(body(i).find("h3").text()).toBe(`Trip # ${i + 1}`);
      }
    });

    it("shows no Delete on an open trip when it is the only one", () => {
      expect(body(0).find("h3").text()).toBe("Trip # 1");
      expect(del(0).exists()).toBe(false);
    });

    it("shows Edit on a collapsed trip even when it is the only one", async () => {
      await toggle(0).trigger("click");

      expect(edit(0).isVisible()).toBe(true);
      expect(del(0).exists()).toBe(false);
    });

    it.each([
      ["no date", { ...DESIGN_TRIP, date: null }, "Falls Creek \u2192 Jordan River - 10 Patients"],
      ["only the departure community", { communityDeparted: "Falls Creek" }, "Falls Creek"],
      ["only the arrival community", { communityArrived: "Jordan River" }, "Jordan River"],
      [
        "0 patients",
        { ...DESIGN_TRIP, patientsSeen: "0" },
        "Sep 10, 2026 - Falls Creek \u2192 Jordan River - 0 Patients",
      ],
      ["only a date", { date: DESIGN_TRIP.date }, "Sep 10, 2026"],
      ["only patients", { patientsSeen: "7" }, "7 Patients"],
      [
        "a non-numeric patients value",
        { ...DESIGN_TRIP, patientsSeen: "abc" },
        "Sep 10, 2026 - Falls Creek \u2192 Jordan River",
      ],
      [
        "an impossible date",
        { ...DESIGN_TRIP, date: { month: 1, day: "31", year: "2026" } },
        "Falls Creek \u2192 Jordan River - 10 Patients",
      ],
      ["a one-digit day", { date: { month: 8, day: "5", year: "2026" } }, "Sep 5, 2026"],
      [
        "a patients value that only contains a digit",
        { ...DESIGN_TRIP, patientsSeen: "1a" },
        "Sep 10, 2026 - Falls Creek \u2192 Jordan River",
      ],
      ["nothing set", {}, ""],
    ])("summarises a trip with %s", async (_label, values, expected) => {
      await fillSummaryParts(0, values);
      await toggle(0).trigger("click");

      expect(summary(0).text()).toBe(expected);
    });

    //values the inputs normally prevent, written to the store directly
    it.each([
      ["an invalid Date", { date: new Date("nope") }, ""],
      [
        "padded communities",
        { communityDeparted: " Alpha ", communityArrived: " Bravo " },
        "Alpha \u2192 Bravo",
      ],
      ["blank communities", { communityDeparted: "  ", communityArrived: " " }, ""],
      [
        "a blank departure and a real arrival",
        { communityDeparted: " ", communityArrived: "Bravo" },
        "Bravo",
      ],
    ])("summarises a store value of %s", async (_label, fields, expected) => {
      for (const [field, value] of Object.entries(fields)) {
        store.updateTrip(0, field, value);
      }
      await toggle(0).trigger("click");

      expect(summary(0).text()).toBe(expected);
    });

    it("opens the trip with Edit, sets aria-expanded and focuses the Month select", async () => {
      await addTrips(1);
      await toggle(0).trigger("click");
      await toggle(1).trigger("click");
      expect(toggle(1).attributes("aria-expanded")).toBe("false");

      await edit(1).trigger("click");

      expect(toggle(1).attributes("aria-expanded")).toBe("true");
      expect(body(1).isVisible()).toBe(true);
      expect(edit(1).exists()).toBe(false);
      expect(toggle(0).attributes("aria-expanded")).toBe("false");
      expect(document.activeElement).toBe(wrapper.find("#trip-date-1-month").element);
    });

    it("focuses the Month select of the edited trip's own index", async () => {
      await addTrips(2);
      await toggle(0).trigger("click");

      await edit(0).trigger("click");

      expect(document.activeElement).toBe(wrapper.find("#trip-date-0-month").element);
    });

    it("deletes the open trip and keeps the other trips with their own values", async () => {
      await addTrips(2);
      await blurValue(wrapper, "#trip-community-departed-0", "Alpha");
      await blurValue(wrapper, "#trip-community-departed-1", "Bravo");
      await blurValue(wrapper, "#trip-community-departed-2", "Charlie");
      await toggle(0).trigger("click");
      await toggle(2).trigger("click");

      await del(1).trigger("click");

      expect(store.formFields.travel.trips.map((t) => t.communityDeparted)).toEqual([
        "Alpha",
        "Charlie",
      ]);
      expect(toggle(0).attributes("aria-expanded")).toBe("false");
      expect(toggle(1).attributes("aria-expanded")).toBe("false");
      expect(summary(0).text()).toBe("Alpha");
      expect(summary(1).text()).toBe("Charlie");
    });

    it("deletes a trip that was reopened with Edit", async () => {
      await clickAdd();
      await blurValue(wrapper, "#trip-community-departed-0", "Alpha");
      await blurValue(wrapper, "#trip-community-departed-1", "Bravo");
      await toggle(0).trigger("click");
      expect(del(0).isVisible()).toBe(false);

      await edit(0).trigger("click");
      await del(0).trigger("click");

      expect(store.formFields.travel.trips.map((t) => t.communityDeparted)).toEqual(["Bravo"]);
      expect(wrapper.find("#trip-community-departed-0").element.value).toBe("Bravo");
    });
  });

  describe("AC3 date", () => {
    it("shows the date error when the date is empty", async () => {
      await clickContinue(wrapper);
      expect(errorTexts(wrapper)).toContain(DATE_ERROR);
    });

    it("shows the date error for a day that does not exist in the month", async () => {
      await fillDate(0, { month: 1, day: "31", year: "2024" });
      expect(errorTexts(wrapper)).toEqual([DATE_ERROR]);
    });

    it.each([
      ["1900", []],
      ["1899", ["Year must be between 1900 and " + currentYear + "."]],
      [String(currentYear), []],
      [String(currentYear + 1), ["Year must be between 1900 and " + currentYear + "."]],
    ])("year %s gives errors %j", async (year, expected) => {
      await fillDate(0, { month: 0, day: "10", year });
      expect(errorTexts(wrapper)).toEqual(expected);
    });
  });

  describe("AC4 communities", () => {
    it("shows both required errors when the communities are empty", async () => {
      await blurValue(wrapper, "#trip-community-departed-0", "");
      await blurValue(wrapper, "#trip-community-arrived-0", "");

      expect(errorTexts(wrapper)).toEqual([
        "Community departed is required.",
        "Community arrived is required.",
      ]);
    });

    it("limits both community inputs to 254 characters", () => {
      expect(wrapper.find("#trip-community-departed-0").attributes("maxlength")).toBe("254");
      expect(wrapper.find("#trip-community-arrived-0").attributes("maxlength")).toBe("254");
    });
  });

  describe("AC5 times", () => {
    it.each([
      ["departure", "Departure hour must be 1 to 12."],
      ["arrival", "Arrival hour must be 1 to 12."],
    ])("%s hour accepts 1 to 12 with or without a leading zero", async (kind) => {
      for (const ok of ["1", "01", "9", "09", "10", "12"]) {
        await blurValue(wrapper, `#trip-${kind}-hour-0`, ok);
        expect(errorTexts(wrapper), `hour ${ok}`).toEqual([]);
      }
    });

    it.each([
      ["departure", "Departure hour must be 1 to 12."],
      ["arrival", "Arrival hour must be 1 to 12."],
    ])("%s hour rejects 0, 00, 13 and empty with its message", async (kind, message) => {
      for (const bad of ["0", "00", "13", ""]) {
        await blurValue(wrapper, `#trip-${kind}-hour-0`, "7");
        expect(errorTexts(wrapper)).toEqual([]);
        await blurValue(wrapper, `#trip-${kind}-hour-0`, bad);
        expect(errorTexts(wrapper), `hour "${bad}"`).toEqual([message]);
      }
    });

    it.each([
      ["departure", "Departure minute must be 00 to 59."],
      ["arrival", "Arrival minute must be 00 to 59."],
    ])("%s minute 59 is ok and 60 is an error", async (kind, message) => {
      await blurValue(wrapper, `#trip-${kind}-minute-0`, "59");
      expect(errorTexts(wrapper)).toEqual([]);
      await blurValue(wrapper, `#trip-${kind}-minute-0`, "60");
      expect(errorTexts(wrapper)).toEqual([message]);
    });

    it.each([
      ["departure-minute", "Departure minute must be 00 to 59."],
      ["arrival-minute", "Arrival minute must be 00 to 59."],
    ])("a single digit in %s is an error", async (field, message) => {
      await blurValue(wrapper, `#trip-${field}-0`, "5");
      expect(errorTexts(wrapper)).toEqual([message]);
    });

    it("accepts 00 for the minute but not for the hour", async () => {
      await blurValue(wrapper, "#trip-departure-minute-0", "00");
      expect(errorTexts(wrapper)).toEqual([]);
      await blurValue(wrapper, "#trip-departure-hour-0", "00");
      expect(errorTexts(wrapper)).toEqual(["Departure hour must be 1 to 12."]);
    });

    it("shows the AM or PM errors on Continue when neither is selected", async () => {
      await clickContinue(wrapper);
      expect(errorTexts(wrapper)).toContain("Select AM or PM for departure time.");
      expect(errorTexts(wrapper)).toContain("Select AM or PM for arrival time.");
    });

    it("clears the AM or PM error once one is selected", async () => {
      await clickContinue(wrapper);
      await wrapper.find("#trip-departure-meridiem-0-pm").setValue();

      expect(errorTexts(wrapper)).not.toContain("Select AM or PM for departure time.");
      expect(errorTexts(wrapper)).toContain("Select AM or PM for arrival time.");
      expect(store.formFields.travel.trips[0].departureMeridiem).toBe("PM");
    });
  });

  describe("AC6 patients seen", () => {
    it("shows the required error when empty", async () => {
      await blurValue(wrapper, "#trip-patients-seen-0", "");
      expect(errorTexts(wrapper)).toEqual(["Patients seen is required."]);
    });

    it("accepts 0 and limits the input to 3 digits", async () => {
      await blurValue(wrapper, "#trip-patients-seen-0", "0");
      expect(errorTexts(wrapper)).toEqual([]);
      expect(wrapper.find("#trip-patients-seen-0").attributes("maxlength")).toBe("3");
    });

    it("accepts 999", async () => {
      await blurValue(wrapper, "#trip-patients-seen-0", "999");
      expect(errorTexts(wrapper)).toEqual([]);
    });

    it("rejects non-digits that bypass the keypress filter and blocks Continue", async () => {
      await selectAuthority("fha");
      await fillTrip(0, { ...VALID_TRIP, patientsSeen: "abc" });

      await clickContinue(wrapper);

      expect(errorTexts(wrapper)).toEqual(["Patients seen must be a number from 0 to 999."]);
      expect(pushSpy).not.toHaveBeenCalled();
    });
  });

  describe("AC7 Continue", () => {
    it("goes to step 3 when every field on every trip is valid", async () => {
      await selectAuthority("fha");
      await clickAdd();
      await fillTrip(0);
      await fillTrip(1, {
        ...VALID_TRIP,
        date: { ...VALID_TRIP.date, day: "16" },
        communityDeparted: "Terrace",
      });

      await clickContinue(wrapper);

      expect(errorTexts(wrapper)).toEqual([]);
      expect(pushSpy).toHaveBeenCalledTimes(1);
      expect(pushSpy).toHaveBeenCalledWith(routes.NITAOP_STEP_3.path);
    });

    it("stays on step 2 when only the second trip is invalid", async () => {
      await selectAuthority("fha");
      await clickAdd();
      await fillTrip(0);
      await fillTrip(1, {
        ...VALID_TRIP,
        date: { ...VALID_TRIP.date, day: "16" },
        arrivalHour: "13",
      });

      await clickContinue(wrapper);

      expect(errorTexts(wrapper)).toEqual(["Arrival hour must be 1 to 12."]);
      expect(pushSpy).not.toHaveBeenCalled();
    });

    it("scrolls to the first error on the page", async () => {
      await selectAuthority("fha");
      await fillTrip(0, { ...VALID_TRIP, communityDeparted: "" });
      const rectSpy = vi
        .spyOn(Element.prototype, "getBoundingClientRect")
        .mockImplementation(function () {
          return { top: this.textContent.includes("Community departed") ? 400 : 100 };
        });
      vi.useFakeTimers();

      try {
        await clickContinue(wrapper);
        vi.runAllTimers();
      } finally {
        vi.useRealTimers();
        rectSpy.mockRestore();
      }
      expect(pushSpy).not.toHaveBeenCalled();
      expect(scrollSpy).toHaveBeenCalledWith({ top: 325, behavior: "smooth" });
    });
  });

  describe("AC8 trip order", () => {
    //VALID_TRIP arrives at 12:59 PM on day 15, so same-day departures are measured against that
    const onDay = (day, overrides = {}) => ({
      ...VALID_TRIP,
      date: { ...VALID_TRIP.date, day },
      ...overrides,
    });
    const departing = (hour, minute, meridiem, day = "15") =>
      onDay(day, {
        departureHour: hour,
        departureMinute: minute,
        departureMeridiem: meridiem,
      });
    const toggle = (i) => wrapper.find(`[data-cy="toggle-trip-${i}"]`);
    //the date is only committed to the store when the year input is blurred
    const setDay = async (i, day) => {
      await wrapper.find(`#trip-date-${i}-day`).setValue(day);
      await wrapper.find(`#trip-date-${i}-year`).trigger("blur");
    };

    describe("date", () => {
      it("shows the order error under Trip # 2 when its date is before Trip # 1", async () => {
        await clickAdd();
        await fillTrip(0);
        await fillTrip(1, onDay("14"));

        expect(errorTexts(wrapper)).toEqual([dateOrderError(1)]);
      });

      it("allows the same day and a later day", async () => {
        await clickAdd();
        await fillTrip(0);
        await fillTrip(1, departing("01", "00", "pm"));
        expect(errorTexts(wrapper)).toEqual([]);

        await setDay(1, "16");
        expect(errorTexts(wrapper)).toEqual([]);
      });

      it("names the trip before it, comparing Trip # 3 with Trip # 2 and not Trip # 1", async () => {
        await addTrips(2);
        await fillTrip(0, onDay("10"));
        await fillTrip(1, onDay("20", { arrivalHour: "01", arrivalMeridiem: "am" }));
        await fillTrip(2, onDay("15", { arrivalHour: "01", arrivalMeridiem: "am" }));

        expect(errorTexts(wrapper)).toEqual([dateOrderError(2)]);
      });

      it("never shows the order error on Trip # 1", async () => {
        await fillTrip(0, onDay("01"));
        expect(errorTexts(wrapper)).toEqual([]);
      });

      it("shows the valid-date message and not the order message for an impossible date", async () => {
        await clickAdd();
        await fillTrip(0);
        await fillDate(1, { month: 1, day: "31", year: "2024" });

        expect(errorTexts(wrapper)).toEqual([DATE_ERROR]);
      });

      it("shows the year message and not the order message for a year before the previous trip", async () => {
        await clickAdd();
        await fillTrip(0);
        await fillDate(1, { month: 5, day: "14", year: "1899" });

        expect(errorTexts(wrapper)).toEqual([`Year must be between 1900 and ${currentYear}.`]);
      });

      it("shows the order message once an out-of-range year is corrected to an earlier date", async () => {
        await clickAdd();
        await fillTrip(0);
        await fillDate(1, { month: 5, day: "14", year: "1899" });
        await blurValue(wrapper, "#trip-date-1-year", "2024");

        expect(errorTexts(wrapper)).toEqual([dateOrderError(1)]);
      });

      it("shows no order error while Trip # 1 has no valid date", async () => {
        await clickAdd();
        await fillDate(1, { month: 5, day: "14", year: "2024" });

        expect(errorTexts(wrapper)).toEqual([]);
      });
    });

    describe("departure time", () => {
      it("shows the order error when departure is before the previous arrival on the same day", async () => {
        await clickAdd();
        await fillTrip(0);
        await fillTrip(1, departing("12", "58", "pm"));

        expect(errorTexts(wrapper)).toEqual([timeOrderError(1)]);
      });

      it("allows a departure equal to the previous arrival and one minute after it", async () => {
        await clickAdd();
        await fillTrip(0);
        await fillTrip(1, departing("12", "59", "pm"));
        expect(errorTexts(wrapper)).toEqual([]);

        await blurValue(wrapper, "#trip-departure-hour-1", "01");
        await blurValue(wrapper, "#trip-departure-minute-1", "00");
        expect(errorTexts(wrapper)).toEqual([]);
      });

      it("does not apply the time rule when Trip # 2 is on a later day", async () => {
        await clickAdd();
        await fillTrip(0);
        await fillTrip(1, departing("01", "00", "am", "16"));

        expect(errorTexts(wrapper)).toEqual([]);
      });

      it("names the trip before it", async () => {
        await addTrips(2);
        await fillTrip(0);
        await fillTrip(1, departing("01", "00", "pm"));
        await fillTrip(2, departing("01", "00", "pm", "15"));
        expect(errorTexts(wrapper)).toEqual([]);

        await blurValue(wrapper, "#trip-departure-hour-2", "12");
        expect(errorTexts(wrapper)).toEqual([timeOrderError(2)]);
      });

      it("does not show the AM or PM required message for an order error", async () => {
        await clickAdd();
        await fillTrip(0);
        await fillTrip(1, departing("09", "30", "am"));

        expect(errorTexts(wrapper)).toContain(timeOrderError(1));
        expect(errorTexts(wrapper)).not.toContain(DEPARTURE_REQUIRED_ERROR);
      });

      it("shows only the AM or PM required message when no meridiem is selected", async () => {
        await clickAdd();
        await fillTrip(0);
        await fillDate(1, VALID_TRIP.date);
        await blurValue(wrapper, "#trip-departure-hour-1", "09");
        await blurValue(wrapper, "#trip-departure-minute-1", "30");
        expect(errorTexts(wrapper)).toEqual([]);

        await clickContinue(wrapper);

        expect(errorTexts(wrapper)).toContain(DEPARTURE_REQUIRED_ERROR);
        expect(errorTexts(wrapper)).not.toContain(timeOrderError(1));
      });

      it("waits until hour, minute and AM or PM have all been touched", async () => {
        await clickAdd();
        await fillTrip(0);
        await fillDate(1, VALID_TRIP.date);
        await blurValue(wrapper, "#trip-departure-hour-1", "09");
        await blurValue(wrapper, "#trip-departure-minute-1", "30");
        expect(errorTexts(wrapper)).not.toContain(timeOrderError(1));

        await wrapper.find("#trip-departure-meridiem-1-am").setValue();
        expect(errorTexts(wrapper)).toEqual([timeOrderError(1)]);
      });

      it.each([
        ["hour", "#trip-departure-minute-1", "#trip-departure-hour-1"],
        ["minute", "#trip-departure-hour-1", "#trip-departure-minute-1"],
      ])("waits for the departure %s to be touched", async (_part, touchedFirst, touchedLast) => {
        await clickAdd();
        await fillTrip(0);
        await fillDate(1, VALID_TRIP.date);
        store.updateTrip(1, "departureHour", "09");
        store.updateTrip(1, "departureMinute", "30");
        await wrapper.find("#trip-departure-meridiem-1-am").setValue();
        await wrapper.find(touchedFirst).trigger("blur");
        expect(errorTexts(wrapper)).toEqual([]);

        await wrapper.find(touchedLast).trigger("blur");
        expect(errorTexts(wrapper)).toEqual([timeOrderError(1)]);
      });

      it("waits for the AM or PM to be touched", async () => {
        await clickAdd();
        await fillTrip(0);
        await fillDate(1, VALID_TRIP.date);
        await blurValue(wrapper, "#trip-departure-hour-1", "09");
        store.updateTrip(1, "departureMeridiem", "AM");
        await blurValue(wrapper, "#trip-departure-minute-1", "30");
        expect(errorTexts(wrapper)).toEqual([]);

        await wrapper.find("#trip-departure-meridiem-1-am").trigger("change");
        expect(errorTexts(wrapper)).toEqual([timeOrderError(1)]);
      });

      it.each([
        ["hour", "#trip-departure-hour-1", "13", "Departure hour must be 1 to 12."],
        ["minute", "#trip-departure-minute-1", "60", "Departure minute must be 00 to 59."],
      ])(
        "shows only the invalid %s message when the other parts would be out of order",
        async (_part, selector, bad, message) => {
          await clickAdd();
          await fillTrip(0);
          await fillTrip(1, departing("09", "30", "am"));
          expect(errorTexts(wrapper)).toEqual([timeOrderError(1)]);

          await blurValue(wrapper, selector, bad);

          expect(errorTexts(wrapper)).toEqual([message]);
        }
      );

      it("reads 12 AM as midnight and 12 PM as noon", async () => {
        await clickAdd();
        await fillTrip(0, onDay("15", { arrivalHour: "12", arrivalMinute: "00" }));
        await fillTrip(1, departing("12", "00", "pm"));
        expect(errorTexts(wrapper)).toEqual([]);

        await wrapper.find("#trip-departure-meridiem-1-am").setValue();
        expect(errorTexts(wrapper)).toEqual([timeOrderError(1)]);
      });

      it("reads single-digit hours: 9:29 AM is before a 9:30 AM arrival and 9:30 is not", async () => {
        await clickAdd();
        await fillTrip(
          0,
          onDay("15", { arrivalHour: "9", arrivalMinute: "30", arrivalMeridiem: "am" })
        );
        await fillTrip(1, departing("9", "29", "am"));
        expect(errorTexts(wrapper)).toEqual([timeOrderError(1)]);

        await blurValue(wrapper, "#trip-departure-minute-1", "30");
        expect(errorTexts(wrapper)).toEqual([]);
      });

      it("shows the hour message and not the order message for a departure hour of 0 or 00", async () => {
        await clickAdd();
        await fillTrip(
          0,
          onDay("15", { arrivalHour: "12", arrivalMinute: "00", arrivalMeridiem: "am" })
        );
        await fillTrip(1, departing("12", "00", "am"));
        expect(errorTexts(wrapper)).toEqual([]);

        for (const bad of ["0", "00"]) {
          await blurValue(wrapper, "#trip-departure-hour-1", bad);
          expect(errorTexts(wrapper), `hour "${bad}"`).toEqual(["Departure hour must be 1 to 12."]);
        }
      });
    });

    describe("re-evaluation", () => {
      it("creates and clears Trip # 2's date error as Trip # 1's date is edited", async () => {
        await clickAdd();
        await fillTrip(0, onDay("10"));
        await fillTrip(1, departing("01", "00", "pm", "12"));
        expect(errorTexts(wrapper)).toEqual([]);

        await setDay(0, "20");
        expect(errorTexts(wrapper)).toEqual([dateOrderError(1)]);

        await setDay(0, "12");
        expect(errorTexts(wrapper)).toEqual([]);
      });

      it("creates and clears Trip # 2's time error as Trip # 1's arrival is edited", async () => {
        await clickAdd();
        await fillTrip(
          0,
          onDay("15", { arrivalHour: "10", arrivalMinute: "00", arrivalMeridiem: "am" })
        );
        await fillTrip(1, departing("10", "30", "am"));
        expect(errorTexts(wrapper)).toEqual([]);

        await blurValue(wrapper, "#trip-arrival-minute-0", "31");
        expect(errorTexts(wrapper)).toEqual([timeOrderError(1)]);

        await blurValue(wrapper, "#trip-arrival-minute-0", "30");
        expect(errorTexts(wrapper)).toEqual([]);
      });

      it("clears the time error when Trip # 1 is moved to the day before", async () => {
        await clickAdd();
        await fillTrip(0);
        await fillTrip(1, departing("09", "30", "am"));
        expect(errorTexts(wrapper)).toEqual([timeOrderError(1)]);

        await setDay(0, "14");

        expect(errorTexts(wrapper)).toEqual([]);
      });

      it("drops the error when deleting the trip it was measured against", async () => {
        await addTrips(2);
        await fillTrip(0, onDay("10"));
        await fillTrip(1, onDay("25"));
        await fillTrip(2, onDay("20"));
        expect(errorTexts(wrapper)).toEqual([dateOrderError(2)]);

        await wrapper.find('[data-cy="delete-trip-1"]').trigger("click");

        expect(wrapper.findAll("h3").map((h) => h.text())).toEqual(["Trip # 1", "Trip # 2"]);
        expect(errorTexts(wrapper)).toEqual([]);
      });

      it("raises an error when deleting the middle trip leaves a later trip before its new predecessor", async () => {
        await addTrips(2);
        await fillTrip(0, onDay("20"));
        await fillTrip(1, onDay("10"));
        await fillTrip(2, onDay("15"));
        expect(errorTexts(wrapper)).toEqual([dateOrderError(1)]);

        await wrapper.find('[data-cy="delete-trip-1"]').trigger("click");

        expect(errorTexts(wrapper)).toEqual([dateOrderError(1)]);
        expect(wrapper.findAll("h3").map((h) => h.text())).toEqual(["Trip # 1", "Trip # 2"]);
        expect(store.formFields.travel.trips.map((t) => t.date.getDate())).toEqual([20, 15]);
      });

      it("drops the first trip's error when the trip before it is deleted", async () => {
        await addTrips(1);
        await fillTrip(0, onDay("20"));
        await fillTrip(1, onDay("10"));
        expect(errorTexts(wrapper)).toEqual([dateOrderError(1)]);

        await wrapper.find('[data-cy="delete-trip-0"]').trigger("click");

        expect(errorTexts(wrapper)).toEqual([]);
      });

      it("re-evaluates the time error when the middle trip is deleted", async () => {
        await addTrips(2);
        await fillTrip(
          0,
          onDay("15", { arrivalHour: "08", arrivalMinute: "00", arrivalMeridiem: "am" })
        );
        await fillTrip(1, departing("08", "30", "am"));
        await fillTrip(2, departing("09", "00", "am"));
        expect(errorTexts(wrapper)).toEqual([timeOrderError(2)]);

        await wrapper.find('[data-cy="delete-trip-1"]').trigger("click");

        expect(errorTexts(wrapper)).toEqual([]);
      });
    });

    describe("Continue", () => {
      it("blocks Continue on a date order error and shows it once", async () => {
        await selectAuthority("fha");
        await clickAdd();
        await fillTrip(0);
        await fillTrip(1, onDay("14"));

        await clickContinue(wrapper);

        expect(errorTexts(wrapper)).toEqual([dateOrderError(1)]);
        expect(pushSpy).not.toHaveBeenCalled();
      });

      it("blocks Continue on a time order error", async () => {
        await selectAuthority("fha");
        await clickAdd();
        await fillTrip(0);
        await fillTrip(1, departing("09", "30", "am"));

        await clickContinue(wrapper);

        expect(errorTexts(wrapper)).toEqual([timeOrderError(1)]);
        expect(pushSpy).not.toHaveBeenCalled();
      });

      it("shows a time order error on Continue even if the departure fields were never blurred", async () => {
        await selectAuthority("fha");
        await clickAdd();
        await fillTrip(0);
        await fillDate(1, VALID_TRIP.date);
        await wrapper.find("#trip-departure-hour-1").setValue("09");
        await wrapper.find("#trip-departure-minute-1").setValue("30");
        await wrapper.find("#trip-departure-meridiem-1-am").setValue();
        await blurValue(wrapper, "#trip-community-departed-1", "Terrace");
        await blurValue(wrapper, "#trip-community-arrived-1", "Fort St. John");
        await blurValue(wrapper, "#trip-arrival-hour-1", "01");
        await blurValue(wrapper, "#trip-arrival-minute-1", "00");
        await wrapper.find("#trip-arrival-meridiem-1-pm").setValue();
        await blurValue(wrapper, "#trip-patients-seen-1", "0");

        await clickContinue(wrapper);

        expect(errorTexts(wrapper)).toEqual([timeOrderError(1)]);
        expect(pushSpy).not.toHaveBeenCalled();
      });

      it("re-opens a collapsed trip with an order error and does not navigate", async () => {
        await selectAuthority("fha");
        await clickAdd();
        await fillTrip(0);
        await fillTrip(1, onDay("14"));
        await toggle(1).trigger("click");
        expect(toggle(1).attributes("aria-expanded")).toBe("false");

        await clickContinue(wrapper);

        expect(toggle(1).attributes("aria-expanded")).toBe("true");
        expect(wrapper.find("#trip-date-1-day").isVisible()).toBe(true);
        expect(errorTexts(wrapper)).toEqual([dateOrderError(1)]);
        expect(pushSpy).not.toHaveBeenCalled();
      });

      it("scrolls to the order error", async () => {
        await selectAuthority("fha");
        await clickAdd();
        await fillTrip(0);
        await fillTrip(1, onDay("14"));
        const rectSpy = vi
          .spyOn(Element.prototype, "getBoundingClientRect")
          .mockImplementation(function () {
            return { top: this.textContent.includes(dateOrderError(1)) ? 400 : 100 };
          });
        vi.useFakeTimers();

        try {
          await clickContinue(wrapper);
          vi.runAllTimers();
        } finally {
          vi.useRealTimers();
          rectSpy.mockRestore();
        }

        expect(scrollSpy).toHaveBeenCalledWith({ top: 325, behavior: "smooth" });
      });

      it("goes to step 3 for ordered trips, including a same-day departure equal to the previous arrival", async () => {
        await selectAuthority("fha");
        await addTrips(2);
        await fillTrip(0);
        await fillTrip(1, departing("12", "59", "pm", "15"));
        await fillTrip(2, onDay("16", { departureHour: "01", departureMeridiem: "am" }));

        await clickContinue(wrapper);

        expect(errorTexts(wrapper)).toEqual([]);
        expect(pushSpy).toHaveBeenCalledTimes(1);
        expect(pushSpy).toHaveBeenCalledWith(routes.NITAOP_STEP_3.path);
      });
    });
  });
});
