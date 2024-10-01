import Page from "@/views/GetStarted.vue";
import { shallowMount } from "@vue/test-utils";
import { it, describe, expect } from "vitest";
import { createRouter, createWebHistory } from "vue-router";
//beforeEach, afterEach, vi

const router = createRouter({
  history: createWebHistory(),
  routes: [],
});

describe("GetStarted.vue", async () => {
  router.push("/");

  // After this line, router is ready
  await router.isReady();

  let wrapper = null;
  // let store = null;

  // beforeEach(async () => {
  //   let tempForm = cloneDeep(formTemplate);
  //   tempForm.replaceState(dummyData);
  //   store = createStore(tempForm);

  wrapper = shallowMount(Page, {
    global: {
      plugins: [
        // store,
        router,
      ],
    },
  });
  // });

  // afterEach(() => {
  //   vi.restoreAllMocks();
  // });

  it("renders", () => {
    expect(wrapper.element).toBeDefined();
  });
});
