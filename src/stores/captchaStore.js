import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";

export const useCaptchaStore = defineStore("captchaStore", {
  state: () => ({
    isShowConsentModal: true,
    maintenanceMessage:
      "This application is currently unavailable due to maintenance. Please try again later.",
    applicationUuid: uuidv4(),
    captchaToken: "setCaptchaToken",
  }),
  actions: {
    /**
     * Updates formFields store
     * @param {*} parentName
     * @param {*} fieldName
     * @param {*} fieldValue
     */
    resetCaptchaToken() {
      //assign new applicationUuid so the documents all get grouped together properly
      //the documentuuid on attachments needs to match the uuid on form submission
      this.applicationUuid = uuidv4();
    },
  },
});
