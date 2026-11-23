import FieldError from "@/components/FieldError.vue";
import { mount } from "@vue/test-utils";

describe("FieldError.vue", () => {
  it("keeps the assertive live region in the DOM and only renders the error when shown", async () => {
    const wrapper = mount(FieldError, {
      props: { show: false },
      slots: { default: "Name is required." },
    });

    const region = wrapper.find('[aria-live="assertive"]');
    expect(region.exists()).toBe(true);
    expect(region.find(".text-danger").exists()).toBe(false);

    await wrapper.setProps({ show: true });

    const live = wrapper.find('[aria-live="assertive"]');
    expect(live.find(".text-danger.error").text()).toBe("Name is required.");
  });
});
