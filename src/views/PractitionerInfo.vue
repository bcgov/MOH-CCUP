<template>
  <main>
    <PageContent>
      <main class="container pt-3 pt-sm-5 mb-5">
        <h1>Claims: Practitioner information</h1>
        <hr />
        <h2>Practitioner</h2>
        <p>Please provide the necessary information about the practitioner.</p>
        <hr />
        <InputComponent
          id="prac-first-name"
          v-model="pracFirstName"
          label="First name"
          :maxlength="firstNameMaxLength"
          :required="true"
          class="mt-3"
          :input-style="mediumStyles"
          @blur="handleBlurField(v$.pracFirstName)"
        />
        <InputComponent
          id="prac-last-name"
          v-model="pracLastName"
          label="Last name"
          :maxlength="lastNameMaxLength"
          :required="true"
          class="mt-3"
          :input-style="mediumStyles"
          @blur="handleBlurField(v$.pracLastName)"
        />
        <PractitionerNumberInput
          id="prac-number"
          v-model="pracNumber"
          label="Practitioner number:"
          cypress-id="pracNumber"
          class="mt-3"
          :input-style="smallStyles"
          @blur="handleBlurField(v$.pracNumber)"
        />
        <!-- Using PractitionerNumberInput because payee number has the same format as a practitioner number -->
        <PractitionerNumberInput
          id="payee-number"
          v-model="payeeNumber"
          label="Payee number:"
          cypress-id="payeeNumber"
          class="mt-3"
          :input-style="smallStyles"
          @blur="handleBlurField(v$.pracNumber)"
        />
        <h2 class="mt-5">Adjudicator</h2>
        <p>
          Please provide, if possible, the adjudicator’s name, which is included in your letter.
          This information will help us significantly in expediting the processing of your data.
        </p>
        <hr />
        <InputComponent
          id="adj-first-name"
          v-model="adjFirstName"
          label="First name"
          :maxlength="firstNameMaxLength"
          :required="true"
          class="mt-3"
          :input-style="mediumStyles"
          @blur="handleBlurField(v$.adjFirstName)"
        />
        <InputComponent
          id="adj-last-name"
          v-model="adjLastName"
          label="Last name"
          :maxlength="lastNameMaxLength"
          :required="true"
          class="mt-3"
          :input-style="mediumStyles"
          @blur="handleBlurField(v$.adjLastName)"
        />
      </main>
    </PageContent>
  </main>
  <ContinueBar
    :button-label="'Continue'"
    cypress-id="continue-bar"
    @continue="nextPage()"
  />
</template>

<script setup>
// import { useFormStore } from "@/stores/formData";
import { PageContent, ContinueBar, InputComponent, PractitionerNumberInput } from "common-lib-vue";
// const store = useFormStore();
import { smallStyles, mediumStyles } from "@/constants/input-styles";
</script>

<script>
export default {
  data() {
    return {
      documentsCategory: null,
    };
  },

  computed: {
    radioOptionsDocumentsCategory() {
      return [
        {
          id: "documents-category-claim",
          label: "Documents are for a claim",
          value: "claim",
        },
        {
          id: "documents-category-pre-auth",
          label: "Documents are for a pre-authorization",
          value: "pre-auth",
        },
      ];
    },
  },

  methods: {
    nextPage() {
      console.log("nextPage function called");
    },
  },
};
</script>
