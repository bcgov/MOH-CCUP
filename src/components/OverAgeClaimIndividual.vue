<template>
  <PhnInput
    :id="`phn-${index}`"
    v-model="phn"
    label="PHN (Personal Health Number)"
    class="mt-3"
    :input-style="smallStyles"
    @change="updateIndividual(index, 'phn', $event.target.value)"
  />

  <DateInput
    :id="`individual-service-date${index}`"
    v-model="individualServiceDate"
    label="Date of service"
    class="mt-3"
    @change="updateIndividual(index, 'individualServiceDate', $event.target.value)"
  />

  <InputComponent
    :id="`fee-item${index}`"
    v-model="individualFeeItem"
    label="Fee item"
    class="mt-3"
    maxlength="5"
    :input-style="extraSmallStyles"
    @change="updateIndividual(index, 'individualFeeItem', $event.target.value)"
  />

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
      store: useOverAgeClaimStore(),
      phn: null,
      individualServiceDate: null,
      individualFeeItem: null,
    };
  },
  watch: {
    //the valueOld argument isn't used, but it's still here in the codebase for future debugging purposes
    propData: function (newPropData) {
      //updates Vue data when the prop changes
      if (newPropData.phn && newPropData.phn !== this.phn) {
        console.log("potato phn assigned");
        this.phn = newPropData.phn;
      }
      if (
        newPropData.individualServiceDate &&
        newPropData.individualServiceDate !== this.individualServiceDate
      ) {
        console.log("potato phn assigned");
        this.individualServiceDate = newPropData.individualServiceDate;
      }
      if (
        newPropData.individualFeeItem &&
        newPropData.individualFeeItem !== this.individualFeeItem
      ) {
        console.log("potato phn assigned");
        this.individualFeeItem = newPropData.individualFeeItem;
      }
    },
  },
  created() {
    this.assignData();
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
