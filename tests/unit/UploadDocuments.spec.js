import Page from "@/views/UploadDocuments.vue";
import { shallowMount } from "@vue/test-utils";
import { it, describe, expect, beforeEach } from "vitest";
import { createRouter, createWebHistory } from "vue-router";
import { setActivePinia, createPinia } from "pinia";
//beforeEach, afterEach, vi

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "TestRoute",
      component: () => import("@/views/UploadDocuments.vue"),
    },
  ],
});

describe("UploadDocuments.vue", async () => {
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