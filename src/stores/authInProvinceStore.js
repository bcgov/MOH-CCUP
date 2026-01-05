import sampleData from "@/stores/sample-data";
import { defineStore } from "pinia";

export const useAuthInProvinceStore = defineStore("authInProvinceStore", {
  state: () => ({
    formFields: {
      medicalInfo: {
        proposedProcedure: null,
        feeItems: null,
        previousSurgeryDate: null,
        traumaDate: null,
        consultationReport: [],
        description: null,
      },
      patientInfo: {
        patientFirstName: null,
        patientLastName: null,
        patientPhn: null,
        patientBirthdate: null,
      },
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
