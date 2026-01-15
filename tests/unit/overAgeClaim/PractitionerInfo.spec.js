import Page from "@/views/overAgeClaim/PractitionerInfo.vue";
import { mount } from "@vue/test-utils";
import { createRouter, createMemoryHistory } from "vue-router";
import { setActivePinia, createPinia } from "pinia";
import { routeStepOrder } from "@/router/index.js";
import { vi } from "vitest";
import logService from "@/services/log-service";

const templateRouter = createRouter({
  history: createMemoryHistory(),
  routes: routeStepOrder,
});

vi.mock("axios");
vi.spyOn(logService, "logNavigation").mockImplementation(() => Promise.resolve("logged"));
vi.spyOn(logService, "logError").mockImplementation(() => {
  Promise.resolve("logged");
});
vi.spyOn(logService, "logInfo").mockImplementation(() => Promise.resolve("logged"));

describe("PatientInfo.vue", async () => {
  let router = null;
  let wrapper = null;

  beforeEach(async () => {
    router = templateRouter;
    router.push("/");
    await router.isReady();

    setActivePinia(createPinia());

    wrapper = mount(Page, {
      global: {
        plugins: [router],
      },
    });
  });

  it("renders", () => {
    expect(wrapper.element).toBeDefined();
  });
});
