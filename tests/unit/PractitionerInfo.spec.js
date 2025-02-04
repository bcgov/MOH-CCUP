import Page from "@/views/PractitionerInfo.vue";
import { shallowMount } from "@vue/test-utils";
import { createRouter, createMemoryHistory } from "vue-router";
import { setActivePinia, createPinia } from "pinia";
import { routeStepOrder } from "@/router/index.js";
import { vi } from "vitest";
import logService from "@/services/log-service";

const router = createRouter({
  history: createMemoryHistory(),
  routes: routeStepOrder,
});

vi.mock("axios");
vi.spyOn(logService, "logNavigation").mockImplementation(() => Promise.resolve("logged"));
vi.spyOn(logService, "logError").mockImplementation(() => {
  Promise.resolve("logged");
});
vi.spyOn(logService, "logInfo").mockImplementation(() => Promise.resolve("logged"));

describe("PractitionerInfo.vue", async () => {
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
