import Page from "@/views/nitaop/PractitionerInfo.vue";
import { mount } from "@vue/test-utils";
import { createRouter, createMemoryHistory } from "vue-router";
import { setActivePinia, createPinia } from "pinia";
import { vi } from "vitest";
import logService from "@/services/log-service";
import { routes } from "@/router/index.js";
import apiService from "@/services/api-service";

const stub = { template: `<span style="display: none;"></span>` };
const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { ...routes.NITAOP_PRACTITIONER_INFO, component: stub },
    { ...routes.NITAOP_STEP_2, component: stub },
  ],
});

vi.mock("axios");
vi.mock("@/services/api-service", () => ({
  default: { validatePractitioner: vi.fn() },
}));
vi.spyOn(logService, "logNavigation").mockImplementation(() => Promise.resolve("logged"));
vi.spyOn(logService, "logError").mockImplementation(() => {
  Promise.resolve("logged");
});
vi.spyOn(logService, "logInfo").mockImplementation(() => Promise.resolve("logged"));
vi.spyOn(window, "scrollTo").mockImplementation(() => {});

const REQUIRED_MESSAGES = {
  "prac-first-name": "First name is required.",
  "prac-last-name": "Last name is required.",
  "prac-number": "MSP practitioner number is required.",
  "payment-number": "MSP payment number is required.",
  "contact-phone-number": "Contact phone number is required.",
  email: "Email address is required.",
  "street-address": "Full street address is required.",
  city: "City is required.",
  province: "Province is required.",
  "postal-code": "Postal code is required.",
};

const VALID_VALUES = {
  "prac-first-name": "Jane",
  "prac-last-name": "O'Neil-Smith",
  "prac-number": "X1234",
  "payment-number": "X5678",
  "contact-phone-number": "2505551234",
  email: "jane@example.com",
  "street-address": "1 Main Street",
  city: "Victoria",
  province: "BC",
  "postal-code": "V8V 1A1",
};

describe("NITAOP PractitionerInfo.vue", () => {
  let wrapper = null;
  let pushSpy = null;

  const errorTexts = () => wrapper.findAll(".text-danger").map((e) => e.text());
  const fill = async (id, value) => {
    const input = wrapper.find(`#${id}`);
    await input.setValue(value);
    await input.trigger("blur");
  };
  const fillAllValid = async () => {
    for (const [id, value] of Object.entries(VALID_VALUES)) {
      await fill(id, value);
    }
    await wrapper.find("#has-other-funding-no").setValue();
    await wrapper.find("#is-on-call-no").setValue();
  };
  const clickContinue = async () => {
    await wrapper.find('button[data-cy="continue-bar"]').trigger("click");
  };

  beforeEach(async () => {
    router.push(routes.NITAOP_PRACTITIONER_INFO.path);
    await router.isReady();
    setActivePinia(createPinia());
    pushSpy = vi.spyOn(router, "push").mockResolvedValue();
    apiService.validatePractitioner.mockReset();

    wrapper = mount(Page, {
      global: {
        plugins: [router],
      },
    });
  });

  afterEach(() => {
    pushSpy.mockRestore();
  });

  it("renders the headings, progress step and fields in order", () => {
    expect(wrapper.find("h1").text()).toBe("Practitioner information");
    expect(wrapper.findAll("h2").map((h) => h.text())).toEqual(["Practitioner", "Address"]);

    const steps = wrapper.findAll(".step-container .step").map((s) => s.text());
    expect(steps).toEqual(["Step 1 of 4", "Practitioner information"]);

    const labels = wrapper
      .findAll("label, legend")
      .map((l) => l.text())
      .filter((t) => t !== "Yes" && t !== "No");
    expect(labels).toEqual([
      "First name",
      "Last name",
      "MSP practitioner number",
      "MSP payment number",
      "Specialty (if applicable)",
      "Contact phone number",
      "Email address",
      "Full street address",
      "City",
      "Province",
      "Postal code",
      "Are you receiving funding for travel expenses or time from any other source for this visit or for providing service under the rural locum programs?",
      "Are you scheduled to be on call?",
    ]);
  });

  it.each(["prac-number", "payment-number", "contact-phone-number", "postal-code"])(
    "marks the %s input as required",
    (id) => {
      const input = wrapper.find(`#${id}`);
      expect(input.attributes("required")).toBeDefined();
      expect(input.attributes("aria-required")).toBe("true");
    }
  );

  it("shows every required-field error and does not navigate when empty", async () => {
    await clickContinue();

    expect(errorTexts()).toEqual([
      ...Object.values(REQUIRED_MESSAGES),
      "Select Yes or No.",
      "Select Yes or No.",
    ]);
    expect(apiService.validatePractitioner).not.toHaveBeenCalled();
    expect(pushSpy).not.toHaveBeenCalled();
  });

  it.each([
    ["prac-first-name", "1Jane", /^First name must begin with a letter/],
    ["prac-last-name", "1Smith", /^Last name must begin with a letter/],
    ["prac-number", "X123", /^MSP practitioner number must be 5 characters long\.$/],
    ["payment-number", "X123", /^MSP payment number must be 5 characters long\.$/],
    ["contact-phone-number", "123", /^Contact phone number does not appear to be valid\.$/],
    ["email", "a@@example.com", /^Email address does not appear to be valid\.$/],
    ["email", "a b@example.com", /^Email address does not appear to be valid\.$/],
    ["email", "a*b@example.com", /^Email address does not appear to be valid\.$/],
    ["email", "a%b@example.com", /^Email address does not appear to be valid\.$/],
    ["email", "jane@example", /^Email address does not appear to be valid\.$/],
    ["postal-code", "V8V1A", /^Postal code does not appear to be valid\.$/],
  ])("shows a format error for %s = %j", async (id, value, message) => {
    await fill(id, value);

    const errors = errorTexts();
    expect(errors.length).toBe(1);
    expect(errors[0].replace(/\s+/g, " ")).toMatch(message);
  });

  it("shows and requires the funding source only when funding is Yes", async () => {
    expect(wrapper.find("#other-funding-source").exists()).toBe(false);

    await wrapper.find("#has-other-funding-yes").setValue();
    expect(wrapper.find("#other-funding-source").exists()).toBe(true);

    await clickContinue();
    expect(errorTexts()).toContain("Funding source is required.");

    await wrapper.find("#has-other-funding-no").setValue();
    expect(wrapper.find("#other-funding-source").exists()).toBe(false);

    await clickContinue();
    expect(errorTexts()).not.toContain("Funding source is required.");
  });

  it.each([
    ["D1F 2O3", "postal-code"],
    ["first.last+tag@sub-domain.example.ca", "email"],
  ])("accepts the valid value %s for %s", async (value, id) => {
    await fill(id, value);

    expect(errorTexts()).toEqual([]);
  });

  it("limits the name inputs to 30 characters via the maxlength attribute", () => {
    expect(wrapper.find("#prac-first-name").attributes("maxlength")).toBe("30");
    expect(wrapper.find("#prac-last-name").attributes("maxlength")).toBe("30");
  });

  it('navigates to step 2 when validatePractitioner returns code "0"', async () => {
    apiService.validatePractitioner.mockResolvedValue({ data: { returnCode: "0" } });
    await fillAllValid();
    await clickContinue();

    expect(apiService.validatePractitioner).toHaveBeenCalledTimes(1);
    expect(apiService.validatePractitioner).toHaveBeenCalledWith(
      expect.objectContaining({
        pracFirstName: "Jane",
        pracLastName: "O'Neil-Smith",
        pracNumber: "X1234",
      }),
      expect.anything()
    );
    expect(errorTexts()).toEqual([]);
    expect(pushSpy).toHaveBeenCalledTimes(1);
    expect(pushSpy).toHaveBeenCalledWith(routes.NITAOP_STEP_2.path);
  });

  it.each([
    [
      "code 1",
      () => apiService.validatePractitioner.mockResolvedValue({ data: { returnCode: "1" } }),
      "Practitioner information does not match our records.",
    ],
    [
      "an unexpected code",
      () => apiService.validatePractitioner.mockResolvedValue({ data: { returnCode: "9" } }),
      "Unable to continue, system unavailable. Please try again later.",
    ],
    [
      "a rejected request",
      () => apiService.validatePractitioner.mockRejectedValue({ response: { status: 500 } }),
      "Unable to continue, system unavailable. Please try again later.",
    ],
  ])("stays on the page when validatePractitioner returns %s", async (_, arrange, message) => {
    arrange();
    await fillAllValid();
    await clickContinue();

    expect(errorTexts()).toEqual([message]);
    expect(pushSpy).not.toHaveBeenCalled();
  });
});
