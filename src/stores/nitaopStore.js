import { defineStore } from "pinia";

export const useNitaopStore = defineStore("nitaopStore", {
  state: () => ({
    formFields: {
      practitioner: {
        pracFirstName: "",
        pracLastName: "",
        pracNumber: "",
        paymentNumber: "",
        specialty: "",
        contactPhoneNumber: "",
        email: "",
        streetAddress: "",
        city: "",
        province: "",
        postalCode: "",
        hasOtherFunding: "",
        otherFundingSource: "",
        isOnCall: "",
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
  },
});
