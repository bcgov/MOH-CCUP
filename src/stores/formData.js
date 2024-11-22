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
      patient: {
        documentsCategory: null,
        patientBirthdate: null,
        patientFirstInitial: null,
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
    /**
     * Updates formFields store
     * @param {*} parentName
     * @param {*} fieldName
     * @param {*} fieldValue
     */
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
        patient: {
          documentsCategory: null,
          patientBirthdate: null,
          patientFirstInitial: null,
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
    },
  },
});
