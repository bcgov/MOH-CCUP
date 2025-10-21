import sampleData from "@/stores/sample-data";
import { defineStore } from "pinia";

const clearPatientStructure = {
  patient: {
    documentsCategory: null,
    patientBirthdate: null,
    patientFirstInitial: null,
    patientLastName: null,
    patientPhn: null,
    adjFirstName: null,
    adjLastName: null,
  },
  upload: {
    uploadNote: null,
    patientSupportDocuments: [],
  },
  review: {
    isDeclarationAccuracy: null,
  },
};

export const useDocSubmissionStore = defineStore("formStore", {
  state: () => ({
    formFields: {
      practitioner: {
        pracFirstName: "",
        pracLastName: "",
        pracNumber: "",
        payeeNumber: "",
      },
      patient: {
        documentsCategory: null,
        patientBirthdate: null,
        patientFirstInitial: null,
        patientLastName: null,
        patientPhn: null,
        adjFirstName: null,
        adjLastName: null,
      },
      upload: {
        uploadNote: null,
        patientSupportDocuments: [],
      },
      review: {
        isDeclarationAccuracy: null,
        referenceNumber: null,
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
    clearPatient() {
      Object.assign(this.formFields, clearPatientStructure);
    },
    assignSampleData() {
      Object.assign(this.formFields, sampleData);
    },
  },
});
