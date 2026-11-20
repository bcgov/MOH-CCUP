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

    it("keeps Delete visible and usable on a collapsed trip", async () => {
      await clickAdd();
      await blurValue(wrapper, "#trip-community-departed-0", "Alpha");
      await blurValue(wrapper, "#trip-community-departed-1", "Bravo");
      await toggle(0).trigger("click");
      expect(body(0).isVisible()).toBe(false);

      const del = wrapper.find('[data-cy="delete-trip-0"]');
      expect(del.isVisible()).toBe(true);
      expect(del.attributes("aria-label")).toBe("Delete Trip # 1");

      await del.trigger("click");

      expect(wrapper.findAll("h3").length).toBe(1);
      expect(wrapper.find("#trip-community-departed-0").element.value).toBe("Bravo");
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
      ["departure", "12", "13", "Departure hour must be 00 to 12."],
      ["arrival", "12", "13", "Arrival hour must be 00 to 12."],
    ])("%s hour %s is ok and %s is an error", async (kind, ok, bad, message) => {
      await blurValue(wrapper, `#trip-${kind}-hour-0`, ok);
      expect(errorTexts(wrapper)).toEqual([]);
      await blurValue(wrapper, `#trip-${kind}-hour-0`, bad);
      expect(errorTexts(wrapper)).toEqual([message]);
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
      ["departure-hour", "Departure hour must be 00 to 12."],
      ["departure-minute", "Departure minute must be 00 to 59."],
      ["arrival-hour", "Arrival hour must be 00 to 12."],
      ["arrival-minute", "Arrival minute must be 00 to 59."],
    ])("a single digit in %s is an error", async (field, message) => {
      await blurValue(wrapper, `#trip-${field}-0`, "5");
      expect(errorTexts(wrapper)).toEqual([message]);
    });

    it("accepts 00 for hour and minute", async () => {
      await blurValue(wrapper, "#trip-departure-hour-0", "00");
      await blurValue(wrapper, "#trip-departure-minute-0", "00");
      expect(errorTexts(wrapper)).toEqual([]);
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
      await fillTrip(1, { ...VALID_TRIP, communityDeparted: "Terrace" });

      await clickContinue(wrapper);

      expect(errorTexts(wrapper)).toEqual([]);
      expect(pushSpy).toHaveBeenCalledTimes(1);
      expect(pushSpy).toHaveBeenCalledWith(routes.NITAOP_STEP_3.path);
    });

    it("stays on step 2 when only the second trip is invalid", async () => {
      await selectAuthority("fha");
      await clickAdd();
      await fillTrip(0);
      await fillTrip(1, { ...VALID_TRIP, arrivalHour: "13" });

      await clickContinue(wrapper);

      expect(errorTexts(wrapper)).toEqual(["Arrival hour must be 00 to 12."]);
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
});
