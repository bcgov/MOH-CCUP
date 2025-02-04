import sampleData from "@/stores/sample-data";
import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";

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

export const useFormStore = defineStore("formStore", {
  state: () => ({
    isShowConsentModal: true,
    maintenanceMessage:
      "This application is currently unavailable due to maintenance. Please try again later.",
    captcha: {
      applicationUuid: uuidv4(),
      enrolmentModule: "enrolmentModule",
      captchaToken: "setCaptchaToken",
    },
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
    clearData() {
      (this.captcha = {
        applicationUuid: "",
        enrolmentModule: "",
        captchaToken: "",
      }),
        (this.formFields = {
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
        });
    },
    clearPatient() {
      Object.assign(this.formFields, clearPatientStructure);
    },
    assignSampleData() {
      Object.assign(this.formFields, sampleData);
    },
  },
});
