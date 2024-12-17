import Page from "@/views/PatientInfo.vue";
import { mount } from "@vue/test-utils";
import { it, describe, expect, beforeEach, afterEach, vi } from "vitest";
import { createRouter, createMemoryHistory } from "vue-router";
import { setActivePinia, createPinia } from "pinia";
import { routeStepOrder } from "@/router/index.js";

const templateRouter = createRouter({
  history: createMemoryHistory(),
  routes: routeStepOrder,
});

describe("PatientInfo.vue", async () => {
  let router = null;
  let wrapper = null;

  beforeEach(async () => {
    router = templateRouter;
    router.push("/");
    // After this line, router is ready
    await router.isReady();

    setActivePinia(createPinia());

    wrapper = mount(Page, {
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
