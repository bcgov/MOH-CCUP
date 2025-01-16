import Page from "@/views/ReviewPage.vue";
import { shallowMount } from "@vue/test-utils";
import { createRouter, createMemoryHistory } from "vue-router";
import { setActivePinia, createPinia } from "pinia";
import { routeStepOrder } from "@/router/index.js";

const router = createRouter({
  history: createMemoryHistory(),
  routes: routeStepOrder,
});

describe("ReviewPage.vue", async () => {
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
