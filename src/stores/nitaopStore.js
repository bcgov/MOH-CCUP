import { defineStore } from "pinia";

export const MAX_TRIPS = 16;

//stable id per trip, used as the list key so deleting a trip does not move its state onto the next one
let nextTripId = 1;

const createTrip = () => ({
  id: nextTripId++,
  date: null,
  communityDeparted: "",
  departureHour: "",
  departureMinute: "",
  departureMeridiem: "",
  communityArrived: "",
  arrivalHour: "",
  arrivalMinute: "",
  arrivalMeridiem: "",
  patientsSeen: "",
});

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
      travel: {
        healthAuthority: "",
        trips: [createTrip()],
      },
    },
  }),
  actions: {
    addTrip() {
      this.formFields.travel.trips.push(createTrip());
    },
    deleteTrip(index) {
      this.formFields.travel.trips.splice(index, 1);
    },
    updateTrip(index, fieldName, value) {
      this.formFields.travel.trips[index][fieldName] = value;
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
  },
});
