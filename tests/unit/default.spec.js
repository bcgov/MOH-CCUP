import Page from "@/App.vue";
import { shallowMount } from "@vue/test-utils";
import { it, describe, expect } from "vitest";
//beforeEach, afterEach, vi

describe("DefaultPage.vue", () => {
  let wrapper = null;
  // let store = null;

  // beforeEach(async () => {
  //   let tempForm = cloneDeep(formTemplate);
  //   tempForm.replaceState(dummyData);
  //   store = createStore(tempForm);

  wrapper = shallowMount(Page, {
    //     global: {
    //       plugins: [store, router],
    //     },
  });
  // });

  // afterEach(() => {
  //   vi.restoreAllMocks();
  // });

  it("renders", () => {
    expect(wrapper.element).toBeDefined();
  });
});
