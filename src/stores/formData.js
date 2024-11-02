import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { ref } from "vue";

export const useFormStore = defineStore("formStore", {
  state: () => ({
    phn: null,
    pracNumber: null,
    testField: "asdf",
    isShowConsentModal: true,
    applicationUuid: uuidv4(),
    SET_CAPTCHA_TOKEN: "setCaptchaToken",
    documentTypeSelected: ref(""),
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
    handleDocumentTypeChange(docType) {
      this.documentTypeSelected = docType;
    },
    clearData() {
      this.phn = null;
      this.pracNumber = null;
      this.testField = "";
    },
  },
});
