import Page from "@/views/HomeView.vue";
import { shallowMount } from "@vue/test-utils";
import { it, describe, expect, beforeEach } from "vitest";
import { createRouter, createWebHistory } from "vue-router";
import { setActivePinia, createPinia } from "pinia";
// afterEach, vi

const router = createRouter({
  history: createWebHistory(),
  routes: [],
});

describe("HomeView.vue", async () => {
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
