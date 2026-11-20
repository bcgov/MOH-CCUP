import { createRouter, createMemoryHistory } from "vue-router";

const stub = { template: `<span style="display: none;"></span>` };

export const createStubRouter = (...pageRoutes) =>
  createRouter({
    history: createMemoryHistory(),
    routes: pageRoutes.map((route) => ({ ...route, component: stub })),
  });

export const errorTexts = (wrapper) => wrapper.findAll(".text-danger").map((e) => e.text());

export const blurValue = async (wrapper, selector, value) => {
  const input = wrapper.find(selector);
  await input.setValue(value);
  await input.trigger("blur");
};

export const clickContinue = async (wrapper) => {
  await wrapper.find('button[data-cy="continue-bar"]').trigger("click");
};
