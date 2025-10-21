import sampleData from "@/stores/sample-data";
import { defineStore } from "pinia";

export const useAuthInProvinceStore = defineStore("authInProvinceStore", {
  state: () => ({
    formFields: {
      //replace with relevant data structure for this form
    },
  }),
  actions: {
    /**
     * Updates formFields store
     * @param {*} parentName
     * @param {*} fieldName
     * @param {*} fieldValue
     */
    updateFormField(parentName, fieldName, fieldValue) {
      this.formFields[parentName][fieldName] = fieldValue;
    },
    assignSampleData() {
      Object.assign(this.formFields, sampleData);
    },
  },
});
