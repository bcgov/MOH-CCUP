import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";

export const useNewCaptchaStore = defineStore("formStore", {
  state: () => ({
    isShowConsentModal: true,
    maintenanceMessage:
      "This application is currently unavailable due to maintenance. Please try again later.",
    captcha: {
      applicationUuid: uuidv4(),
      enrolmentModule: "enrolmentModule",
      captchaToken: "setCaptchaToken",
    },
  }),
  actions: {
    /**
     * Updates formFields store
     * @param {*} parentName
     * @param {*} fieldName
     * @param {*} fieldValue
     */
  },
});
