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
        dateType: null,
        claimServiceDate: null,
        claimDateRangeFrom: null,
        claimDateRangeTo: null,
        approximateClaimNumber: null,
        approximateDollarValue: null,
        feeItems: null,
        detailedExplanation: null,
        individuals: [
          {
            phn: null,
            individualServiceDate: null,
            individualFeeItem: null,
          },
        ],
        claimSupportDocuments: [],
        claimComment: null,
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
    addIndividual() {
      this.formFields.claimsInformation.individuals.push({
        phn: null,
        individualServiceDate: null,
        individualFeeItem: null,
      });
    },
    deleteIndividual(index) {
      this.formFields.claimsInformation.individuals.splice(index, 1);
    },
    updateIndividual(index, fieldName, newValue) {
      this.formFields.claimsInformation.individuals[index][fieldName] = newValue;
    },
    updateFormField(parentName, fieldName, fieldValue) {
      this.formFields[parentName][fieldName] = fieldValue;
    },
    assignSampleData() {
      Object.assign(this.formFields, sampleData);
    },
  },
});
