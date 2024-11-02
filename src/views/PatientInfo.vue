<template>
  <main>
    <ProgressBar
      :routes="stepRoutes"
      :current-path="$route.path"
    />
    <PageContent>
      <main class="container pt-3 pt-sm-5 mb-5">
        <h1>Patient information</h1>
        <hr />
        <h2>Document type</h2>
        <p>
          Indicate below the type of document(s) you are uploading. You must select and submit one
          document type for each submission.
        </p>
        <hr />
        <RadioComponent
          id="documents-category"
          v-model="documentsCategory"
          aria-labelledby="documentsCategory"
          name="documents-category"
          :required="true"
          :items="radioOptionsDocumentsCategory"
          cypress-id="documents-category"
          @change="getDocTypeSelected"
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
          label="First name (optional)"
          :maxlength="firstNameMaxLength"
          class="mt-3"
          :input-style="mediumStyles"
          @blur="handleBlurField(v$.adjFirstName)"
        />
        <InputComponent
          id="adj-last-name"
          v-model="adjLastName"
          label="Last name (optional)"
          :maxlength="lastNameMaxLength"
          class="mt-3"
          :input-style="mediumStyles"
          @blur="handleBlurField(v$.adjLastName)"
        />
        <h2 class="mt-5">Practitioner</h2>
        <p>Please provide the necessary information about the practitioner.</p>
        <hr />
        <InputComponent
          id="patient-first-initial"
          v-model="patientFirstInitial"
          label="First initial"
          :maxlength="firstInitialMaxLength"
          :required="true"
          class="mt-3"
          :input-style="extraSmallStyles"
          @blur="handleBlurField(v$.patientFirstInitial)"
        />
        <InputComponent
          id="patient-last-name"
          v-model="patientLastName"
          label="Last name"
          :maxlength="lastNameMaxLength"
          :required="true"
          class="mt-3"
          :input-style="mediumStyles"
          @blur="handleBlurField(v$.patientLastName)"
        />
        <DateInput
          id="patient-birthdate"
          v-model="patientBirthdate"
          label="Patient birthdate"
          :required="true"
          class-name="mt-3"
          @blur="handleBlurField(v$.patientBirthdate)"
        />
        <PhnInput
          id="patient-phn"
          v-model="patientPhn"
          label="PHN (Personal Health Number)"
          placeholder="9999999999"
          :required="true"
          class="mt-3"
          :input-style="smallStyles"
          @blur="handleBlurField($v.patientPhn)"
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
import { useFormStore } from "@/stores/formData";
import {
  PageContent,
  ContinueBar,
  RadioComponent,
  InputComponent,
  DateInput,
  PhnInput,
} from "common-lib-vue";
import { extraSmallStyles, smallStyles, mediumStyles } from "@/constants/input-styles";
import {
  firstNameMaxLength,
  lastNameMaxLength,
  firstInitialMaxLength,
} from "@/constants/html-validations.js";
import ProgressBar from "../components/ProgressBar.vue";
import { stepRoutes, routes } from "../router/index.js";
import pageStateService from "../services/page-state-service.js";
</script>

<script>
export default {
  data() {
    return {
      store: useFormStore(),
      documentsCategory: null,
    };
  },

  computed: {
    radioOptionsDocumentsCategory() {
      return [
        {
          id: "documents-category-claim",
          label: "Claims document(s)",
          value: "claims",
        },
        {
          id: "documents-category-pre-auth",
          label: "Pre-authorization document(s)",
          value: "pre-auth",
        },
      ];
    },
  },

  methods: {
    getDocTypeSelected(e) {
      this.store.handleDocumentTypeChange(e.target.value);
    },
    nextPage() {
      console.log("nextPage function called");
      // Navigate to next path.
      const toPath = routes.UPLOAD_DOCUMENTS.path;
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
    },
  },
};
</script>
