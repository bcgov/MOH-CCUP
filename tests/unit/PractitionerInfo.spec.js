import Page from "@/views/PractitionerInfo.vue";
import { shallowMount } from "@vue/test-utils";
import { it, describe, expect, beforeEach, afterEach, vi } from "vitest";
import { createRouter, createMemoryHistory } from "vue-router";
import { setActivePinia, createPinia } from "pinia";
import { routeStepOrder } from "@/router/index.js";

const router = createRouter({
  history: createMemoryHistory(),
  routes: routeStepOrder,
});

describe("PractitionerInfo.vue", async () => {
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
