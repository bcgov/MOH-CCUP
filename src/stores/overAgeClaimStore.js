import sampleData from "@/stores/sample-data";
import { defineStore } from "pinia";

export const useOverAgeClaimStore = defineStore("overAgeClaimStore", {
  state: () => ({
    formFields: {
      practitioner: {
        pracFirstName: "",
        pracLastName: "",
        pracNumber: "",
        payeeNumber: "",
        dataCenterNumber: "",
        contactPhoneNumber: "",
        preferredContactMethod: "",
        faxPhoneNumber: "",
      },
      claimsInformation: {
        dateType: "",
        claimServiceDate: "",
        claimDateRangeFrom: "",
        claimDateRangeTo: "",
        approximateClaimNumber: "",
        approximateDollarValue: "",
        feeItems: "",
        detailedExplanation: "",
        individuals: [
          {
            phn: "",
            individualServiceDate: "",
            individualFeeItem: "",
          },
        ],
        supportDocuments: [],
        documentComment: "",
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
