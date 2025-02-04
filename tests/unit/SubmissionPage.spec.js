import Page from "@/views/SubmissionPage.vue";
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

describe("SubmissionPage.vue", async () => {
  router.push("/");

  // After this line, router is ready
  await router.isReady();

  let wrapper = null;

  beforeEach(async () => {
    //   let tempForm = cloneDeep(formTemplate);
    //   tempForm.replaceState(dummyData);
    //   store = createStore(tempForm);
    setActivePinia(createPinia());

    wrapper = shallowMount(Page, {
      global: {
        plugins: [router],
      },
    });
  });

  // afterEach(() => {
  //   vi.restoreAllMocks();
  // });

  it("renders", () => {
    expect(wrapper.element).toBeDefined();
  });
});
