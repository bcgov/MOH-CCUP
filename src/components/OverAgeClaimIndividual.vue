<template>
  <PhnInput
    :id="`phn-${index}`"
    v-model="phn"
    label="PHN (Personal Health Number)"
    class="mt-3"
    :input-style="smallStyles"
    @blur="v$.phn.$touch()"
    @change="updateIndividual(index, 'phn', $event.target.value)"
  />

  <div
    v-if="v$.phn.$dirty && v$.phn.required.$invalid"
    class="text-danger error"
    aria-live="assertive"
  >
    <p>PHN is required.</p>
  </div>
  <div
    v-if="
      v$.phn.$dirty &&
      !v$.phn.required.$invalid &&
      (v$.phn.phnValidator.$invalid || v$.phn.phnFirstDigitValidator.$invalid)
    "
    class="text-danger error"
    aria-live="assertive"
  >
    <p>PHN is invalid.</p>
  </div>

  <DateInput
    :id="`individual-service-date${index}`"
    v-model="individualServiceDate"
    label="Date of service"
    class="mt-3"
    @blur="v$.individualServiceDate.$touch()"
    @process-date="updateIndividual(index, 'individualServiceDate', $event)"
  />

  <div
    v-if="v$.individualServiceDate.$dirty && v$.individualServiceDate.dateDataValidator.$invalid"
    class="text-danger error"
    aria-live="assertive"
  >
    <p>Date of service must be a valid date.</p>
  </div>

  <div
    v-if="
      v$.individualServiceDate.$dirty && v$.individualServiceDate.moreThan90DaysValidator.$invalid
    "
    class="text-danger error"
    aria-live="assertive"
  >
    <p>
      Claims that aren't older than 90 days can be submitted or resubmitted under submission code R.
    </p>
  </div>

  <div
    v-if="
      v$.individualServiceDate.$dirty && v$.individualServiceDate.lessThan18MonthsValidator.$invalid
    "
    class="text-danger error"
    aria-live="assertive"
  >
    <p>Claims older than 18 months old cannot be submitted.</p>
  </div>

  <InputComponent
    :id="`fee-item${index}`"
    v-model="individualFeeItem"
    label="Fee item"
    class="mt-3"
    maxlength="5"
    :input-style="extraSmallStyles"
    @blur="v$.individualFeeItem.$touch()"
    @change="updateIndividual(index, 'individualFeeItem', $event.target.value)"
  />

  <div
    v-if="v$.individualFeeItem.$dirty && v$.individualFeeItem.required.$invalid"
    class="text-danger error"
    aria-live="assertive"
  >
    <p>Fee item is required.</p>
  </div>

  <ButtonComponent
    v-if="totalClaims > 1"
    label="Delete this individual"
    class="mt-3"
    :color="'gold'"
    @click="deleteIndividual(index)"
  />
</template>

<script setup>
import { PhnInput, DateInput, InputComponent, ButtonComponent, phnValidator } from "common-lib-vue";
import { useOverAgeClaimStore } from "@/stores/overAgeClaimStore";
import { extraSmallStyles, smallStyles } from "@/constants/input-styles";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import {
  phnFirstDigitValidator,
  moreThan90DaysValidator,
  lessThan18MonthsValidator,
  dateDataValidator,
} from "@/helpers/validators.js";
</script>

<script>
export default {
  name: "OverAgeClaimIndividual",
  components: {},
  props: {
    index: {
      type: Number,
      default: null,
    },
    propData: {
      type: Object,
      default: null,
    },
    totalClaims: {
      type: Number,
      default: null,
    },
  },
  emits: ["delete", "update"],
  data() {
    return {
      v$: useVuelidate(),
      store: useOverAgeClaimStore(),
      phn: null,
      individualServiceDate: null,
      individualFeeItem: null,
    };
  },
  watch: {
    propData: function (newPropData) {
      //updates Vue data when the prop changes
      if (newPropData.phn && newPropData.phn !== this.phn) {
        this.phn = newPropData.phn;
      }
      if (
        newPropData.individualServiceDate &&
        newPropData.individualServiceDate !== this.individualServiceDate
      ) {
        this.individualServiceDate = newPropData.individualServiceDate;
      }
      if (
        newPropData.individualFeeItem &&
        newPropData.individualFeeItem !== this.individualFeeItem
      ) {
        this.individualFeeItem = newPropData.individualFeeItem;
      }
    },
  },
  created() {
    this.assignData();
  },
  validations() {
    const validations = {
      phn: {
        required,
        phnFirstDigitValidator,
        phnValidator,
      },
      individualServiceDate: {
        moreThan90DaysValidator,
        lessThan18MonthsValidator,
        dateDataValidator,
      },
      individualFeeItem: {
        required,
      },
    };

    return validations;
  },
  methods: {
    assignData() {
      this.phn = this.propData.phn;
      this.individualServiceDate = this.propData.individualServiceDate;
      this.individualFeeItem = this.propData.individualFeeItem;
    },
    deleteIndividual(index) {
      this.store.deleteIndividual(index);
    },
    updateIndividual(index, fieldName, newValue) {
      if (!this.v$[fieldName].$invalid) {
        this.store.updateIndividual(index, fieldName, newValue);
      }
    },
  },
};
</script>
