<template>
  <DateInput
    :id="`trip-date-${index}`"
    v-model="date"
    :cypress-id="`trip-date-${index}`"
    label="Date"
    class="mt-3"
    @process-date="v$.date.$touch()"
  />
  <FieldError :show="v$.date.$dirty && v$.date.$invalid">
    {{
      v$.date.dateDataValidator.$invalid
        ? "Date must be a valid date."
        : `Year must be between 1900 and ${currentYear}.`
    }}
  </FieldError>

  <InputComponent
    :id="`trip-community-departed-${index}`"
    v-model="communityDeparted"
    :cypress-id="`trip-community-departed-${index}`"
    label="Community departed"
    :maxlength="'254'"
    :required="true"
    class="mt-3"
    :input-style="mediumStyles"
    @blur="v$.communityDeparted.$touch()"
  />
  <FieldError :show="v$.communityDeparted.$dirty && v$.communityDeparted.$invalid">
    Community departed is required.
  </FieldError>

  <fieldset class="mt-3">
    <legend class="fs-4">Departure time</legend>
    <div class="d-flex flex-wrap align-items-end">
      <DigitInput
        :id="`trip-departure-hour-${index}`"
        v-model="departureHour"
        :cypress-id="`trip-departure-hour-${index}`"
        label="Hour"
        :maxlength="'2'"
        :required="true"
        class-name="me-3"
        :input-style="extraSmallStyles"
        @blur="v$.departureHour.$touch()"
      />
      <DigitInput
        :id="`trip-departure-minute-${index}`"
        v-model="departureMinute"
        :cypress-id="`trip-departure-minute-${index}`"
        label="Minute"
        :maxlength="'2'"
        :required="true"
        class-name="me-3"
        :input-style="extraSmallStyles"
        @blur="v$.departureMinute.$touch()"
      />
      <RadioComponent
        :id="`trip-departure-meridiem-${index}`"
        v-model="departureMeridiem"
        :name="`trip-departure-meridiem-${index}`"
        :cypress-id="`trip-departure-meridiem-${index}`"
        :required="true"
        :items="meridiemOptions"
        @input="v$.departureMeridiem.$touch()"
      />
    </div>
  </fieldset>
  <FieldError :show="v$.departureHour.$dirty && v$.departureHour.$invalid">
    Departure hour must be 00 to 12.
  </FieldError>
  <FieldError :show="v$.departureMinute.$dirty && v$.departureMinute.$invalid">
    Departure minute must be 00 to 59.
  </FieldError>
  <FieldError :show="v$.departureMeridiem.$dirty && v$.departureMeridiem.$invalid">
    Select AM or PM for departure time.
  </FieldError>

  <InputComponent
    :id="`trip-community-arrived-${index}`"
    v-model="communityArrived"
    :cypress-id="`trip-community-arrived-${index}`"
    label="Community arrived"
    :maxlength="'254'"
    :required="true"
    class="mt-3"
    :input-style="mediumStyles"
    @blur="v$.communityArrived.$touch()"
  />
  <FieldError :show="v$.communityArrived.$dirty && v$.communityArrived.$invalid">
    Community arrived is required.
  </FieldError>

  <fieldset class="mt-3">
    <legend class="fs-4">Arrival time</legend>
    <div class="d-flex flex-wrap align-items-end">
      <DigitInput
        :id="`trip-arrival-hour-${index}`"
        v-model="arrivalHour"
        :cypress-id="`trip-arrival-hour-${index}`"
        label="Hour"
        :maxlength="'2'"
        :required="true"
        class-name="me-3"
        :input-style="extraSmallStyles"
        @blur="v$.arrivalHour.$touch()"
      />
      <DigitInput
        :id="`trip-arrival-minute-${index}`"
        v-model="arrivalMinute"
        :cypress-id="`trip-arrival-minute-${index}`"
        label="Minute"
        :maxlength="'2'"
        :required="true"
        class-name="me-3"
        :input-style="extraSmallStyles"
        @blur="v$.arrivalMinute.$touch()"
      />
      <RadioComponent
        :id="`trip-arrival-meridiem-${index}`"
        v-model="arrivalMeridiem"
        :name="`trip-arrival-meridiem-${index}`"
        :cypress-id="`trip-arrival-meridiem-${index}`"
        :required="true"
        :items="meridiemOptions"
        @input="v$.arrivalMeridiem.$touch()"
      />
    </div>
  </fieldset>
  <FieldError :show="v$.arrivalHour.$dirty && v$.arrivalHour.$invalid">
    Arrival hour must be 00 to 12.
  </FieldError>
  <FieldError :show="v$.arrivalMinute.$dirty && v$.arrivalMinute.$invalid">
    Arrival minute must be 00 to 59.
  </FieldError>
  <FieldError :show="v$.arrivalMeridiem.$dirty && v$.arrivalMeridiem.$invalid">
    Select AM or PM for arrival time.
  </FieldError>

  <DigitInput
    :id="`trip-patients-seen-${index}`"
    v-model="patientsSeen"
    :cypress-id="`trip-patients-seen-${index}`"
    label="Patients seen"
    :maxlength="'3'"
    :required="true"
    class-name="mt-3"
    :input-style="extraSmallStyles"
    @blur="v$.patientsSeen.$touch()"
  />
  <p class="mb-0">
    Enter the number of patients seen during this travel segment. Enter 0 if no patients were seen.
  </p>
  <FieldError :show="v$.patientsSeen.$dirty && v$.patientsSeen.$invalid">
    {{
      v$.patientsSeen.required.$invalid
        ? "Patients seen is required."
        : "Patients seen must be a number from 0 to 999."
    }}
  </FieldError>
</template>

<script setup>
import {
  DateInput,
  DigitInput,
  InputComponent,
  RadioComponent,
  digitValidator,
} from "common-lib-vue";
import FieldError from "@/components/FieldError.vue";
import { useNitaopStore } from "@/stores/nitaopStore";
import { extraSmallStyles, mediumStyles } from "@/constants/input-styles";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import {
  dateDataValidator,
  yearRangeValidator,
  hourValidator,
  minuteValidator,
} from "@/helpers/validators.js";

const meridiemOptions = [
  { id: "am", label: "AM", value: "AM" },
  { id: "pm", label: "PM", value: "PM" },
];
const currentYear = new Date().getFullYear();
</script>

<script>
//reads from and writes to the store on every change, so the store never holds a stale value
const tripField = (fieldName) => ({
  get() {
    return this.propData[fieldName];
  },
  set(value) {
    this.store.updateTrip(this.index, fieldName, value);
  },
});

export default {
  name: "NitaopTrip",
  props: {
    index: {
      type: Number,
      default: null,
    },
    propData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      v$: useVuelidate(),
      store: useNitaopStore(),
    };
  },
  computed: {
    date: tripField("date"),
    communityDeparted: tripField("communityDeparted"),
    departureHour: tripField("departureHour"),
    departureMinute: tripField("departureMinute"),
    departureMeridiem: tripField("departureMeridiem"),
    communityArrived: tripField("communityArrived"),
    arrivalHour: tripField("arrivalHour"),
    arrivalMinute: tripField("arrivalMinute"),
    arrivalMeridiem: tripField("arrivalMeridiem"),
    patientsSeen: tripField("patientsSeen"),
  },
  validations() {
    return {
      date: { dateDataValidator, yearRangeValidator },
      communityDeparted: { required },
      departureHour: { hourValidator },
      departureMinute: { minuteValidator },
      departureMeridiem: { required },
      communityArrived: { required },
      arrivalHour: { hourValidator },
      arrivalMinute: { minuteValidator },
      arrivalMeridiem: { required },
      patientsSeen: { required, digitValidator },
    };
  },
};
</script>
