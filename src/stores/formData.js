import { defineStore } from "pinia";

export const useFormStore = defineStore("formStore", {
  state: () => ({
    phn: null,
    pracNumber: null,
    testField: "asdf",
  }),
  getters: {
    phnGetter() {
      return `Phn: ${this.phn}`;
    },
  },
  actions: {
    appendData(object) {
      if (typeof this.testField === "string") {
        this.testField = `${this.testField.toString()} ${object}`;
      }
    },
    clearData() {
      this.phn = null;
      this.pracNumber = null;
      this.testField = "";
    },
  },
});
