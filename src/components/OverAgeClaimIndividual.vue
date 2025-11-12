<template>
  <PhnInput
    :id="`phn-${index}`"
    v-model="phn"
    label="PHN (Personal Health Number)"
    class="mt-3"
    :input-style="smallStyles"
    @change="updateIndividual(index, 'phn', $event.target.value)"
  />

  <div
    v-if="v$.phn.$dirty && v$.phn.required.$invalid"
    class="text-danger error"
    aria-live="assertive"
  >
    <p>PHN is required.</p>
  </div>

  <DateInput
    :id="`individual-service-date${index}`"
    v-model="individualServiceDate"
    label="Date of service"
    class="mt-3"
    @change="updateIndividual(index, 'individualServiceDate', $event.target.value)"
  />

  <div
    v-if="v$.individualServiceDate.$dirty && v$.individualServiceDate.required.$invalid"
    class="text-danger error"
    aria-live="assertive"
  >
    <p>Date of service is required.</p>
  </div>

  <InputComponent
    :id="`fee-item${index}`"
    v-model="individualFeeItem"
    label="Fee item"
    class="mt-3"
    maxlength="5"
    :input-style="extraSmallStyles"
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
import { PhnInput, DateInput, InputComponent, ButtonComponent } from "common-lib-vue";
import { useOverAgeClaimStore } from "@/stores/overAgeClaimStore";
import { extraSmallStyles, smallStyles } from "@/constants/input-styles";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
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
      },
      individualServiceDate: {
        required,
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
      console.log("potato emitted change", index, fieldName, newValue);
      this.store.updateIndividual(index, fieldName, newValue);
    },
  },
};
</script>
