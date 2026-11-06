import Page from "@/views/GetStarted.vue";
import { shallowMount, mount } from "@vue/test-utils";
import { createRouter, createMemoryHistory } from "vue-router";
import { setActivePinia, createPinia } from "pinia";
import { vi } from "vitest";
import logService from "@/services/log-service";
import { routes } from "@/router/index.js";

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: "/get-started",
      title: "Get Started",
      name: "GetStarted",
      component: { template: `<span style="display: none;"></span>` },
    },
  ],
});

vi.mock("axios");
vi.spyOn(logService, "logNavigation").mockImplementation(() => Promise.resolve("logged"));
vi.spyOn(logService, "logError").mockImplementation(() => {
  Promise.resolve("logged");
});
vi.spyOn(logService, "logInfo").mockImplementation(() => Promise.resolve("logged"));

describe("GetStarted.vue", async () => {
  router.push("/");
  await router.isReady();

  let wrapper = null;

  beforeEach(async () => {
    setActivePinia(createPinia());

    wrapper = shallowMount(Page, {
      global: {
        plugins: [router],
      },
    });
  });

  it("renders", () => {
    expect(wrapper.element).toBeDefined();
  });
});

describe("GetStarted.vue upload portal options", () => {
  let fullWrapper = null;
  let pushSpy = null;

  const selectOption = (value) => fullWrapper.find(`input[type="radio"][value="${value}"]`);
  const clickContinue = async () => {
    await fullWrapper.find('button[data-cy="continue-bar"]').trigger("click");
  };

  beforeEach(() => {
    setActivePinia(createPinia());
    pushSpy = vi.spyOn(router, "push").mockResolvedValue();
    fullWrapper = mount(Page, {
      global: {
        plugins: [router],
        stubs: { ConsentModal: true },
      },
    });
  });

  afterEach(() => {
    pushSpy.mockRestore();
  });

  it("shows the NITAOPS option as the fourth option with its label and PDF link", () => {
    const options = fullWrapper.findAll(".md-radio");
    expect(options.length).toBe(4);

    const nitaop = options[3];
    expect(nitaop.find("label").text()).toBe(
      "Northern and isolation travel assistance outreach program (NITAOPS): Application for expenses (HLTH 2804):"
    );
    expect(nitaop.find("li").text()).toContain(
      "Before submitting an application, review the summary of requirements on pg. 2 of the print form"
    );

    const link = nitaop.find("li a");
    expect(link.attributes("href")).toBe(
      "https://www2.gov.bc.ca/assets/gov/health/forms/2804fil.pdf"
    );
    expect(link.text()).toBe("https://www2.gov.bc.ca/assets/gov/health/forms/2804fil.pdf");
    expect(link.attributes("target")).toBe("_blank");
  });

  it("navigates to the NITAOP practitioner page when NITAOPS is selected", async () => {
    await selectOption("nitaop").setValue();
    await clickContinue();

    expect(pushSpy).toHaveBeenCalledTimes(1);
    expect(pushSpy).toHaveBeenCalledWith("/nitaop/practitioner-info");
  });

  it.each([
    ["pre-auth-and-claims", routes.PRACTITIONER_INFO.path],
    ["over-age-claims", routes.OVER_AGE_PRACTITIONER_PAGE.path],
    ["auth-in-prov", routes.AUTH_IN_PROV_PATIENT_INFO.path],
  ])("still navigates option %s to %s", async (value, path) => {
    await selectOption(value).setValue();
    await clickContinue();

    expect(pushSpy).toHaveBeenCalledTimes(1);
    expect(pushSpy).toHaveBeenCalledWith(path);
  });

  it("does not navigate and shows an error when no option is selected", async () => {
    await clickContinue();

    expect(pushSpy).not.toHaveBeenCalled();
    expect(fullWrapper.find(".text-danger").text()).toBe("Select an upload portal option.");
  });
});
