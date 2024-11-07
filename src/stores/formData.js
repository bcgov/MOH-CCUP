import { defineStore } from "pinia";

export const useFormStore = defineStore("formStore", {
  state: () => ({
    phn: null,
    pracNumber: null,
    testField: "asdf",
    formFields: {
      pracFirstName: "",
      pracLastName: "",
      pracNumber: "",
      payeeNumber: "",
    },
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
    updateFormField(fieldName, fieldValue) {
      this.formFields[fieldName] = fieldValue;
    },
    clearData() {
      this.phn = null;
      this.pracNumber = null;
      this.testField = "";

      this.formFields = {
        pracFirstName: "",
        pracLastName: "",
        pracNumber: "",
        payeeNumber: "",
      };
    },
  },
});
