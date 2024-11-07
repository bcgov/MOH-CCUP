import { defineStore } from "pinia";

export const useFormStore = defineStore("formStore", {
  state: () => ({
    phn: null,
    testField: "asdf",
    formFields: {
      practitioner: {
        pracFirstName: "",
        pracLastName: "",
        pracNumber: "",
        payeeNumber: "",
      },
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
    updateFormField(parentName, fieldName, fieldValue) {
      this.formFields[parentName][fieldName] = fieldValue;
    },
    clearData() {
      this.phn = null;
      this.pracNumber = null;
      this.testField = "";

      this.formFields = {
        practitioner: {
          pracFirstName: "",
          pracLastName: "",
          pracNumber: "",
          payeeNumber: "",
        },
      };
    },
  },
});
