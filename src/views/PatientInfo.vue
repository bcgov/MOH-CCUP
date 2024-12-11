<template>
  <main>
    <ProgressBar
      :routes="stepRoutes"
      :current-path="$route.path"
    />
    <PageContent>
      <main class="container pt-3 pt-sm-5 mb-5">
        <h1 class="mb-0">Patient information</h1>
        <hr class="mt-0" />
        <h2>Document type</h2>
        <p class="mb-0">
          Indicate below the type of document(s) you are uploading. You must select and submit one
          document type for each submission.
        </p>
        <hr class="mt-0" />
        <RadioComponent
          id="documents-category"
          v-model="documentsCategory"
          aria-labelledby="documentsCategory"
          name="documents-category"
          :required="true"
          :items="radioOptionsDocumentsCategory"
          cypress-id="documents-category"
          :model-value="documentsCategory"
          @change="handleChangeField(v$.documentsCategory, $event, formFieldParent)"
        />

        <div
          v-if="v$.documentsCategory.$errors.length > 0"
          class="text-danger"
          aria-live="assertive"
        >
          Select a document type.
        </div>
        <h2 class="mt-5">Adjudicator</h2>
        <p class="mb-0">
          Please provide, if possible, the adjudicator’s name, which is included in your letter.
          This information will help us significantly in expediting the processing of your data.
        </p>
        <hr class="mt-0" />
        <InputComponent
          id="adj-first-name"
          v-model="adjFirstName"
          label="First name (optional)"
          :maxlength="firstNameMaxLength"
          class="mt-3"
          :input-style="mediumStyles"
          @blur="handleChangeField(v$.adjFirstName, $event, formFieldParent)"
        />
        <InputComponent
          id="adj-last-name"
          v-model="adjLastName"
          label="Last name (optional)"
          :maxlength="lastNameMaxLength"
          class="mt-3"
          :input-style="mediumStyles"
          @blur="handleChangeField(v$.adjLastName, $event, formFieldParent)"
        />
        <h2 class="mt-5">Patient</h2>
        <p class="mb-0">Please provide the necessary information about the patient.</p>
        <hr class="mt-0" />
        <InputComponent
          id="patient-first-initial"
          v-model="patientFirstInitial"
          label="First initial"
          :maxlength="firstInitialMaxLength"
          :required="true"
          class="mt-3"
          :input-style="extraSmallStyles"
          @change="handleChangeField(v$.patientFirstInitial, $event, formFieldParent)"
        />
        <div
          v-if="
            v$.patientFirstInitial.$dirty &&
            (v$.patientFirstInitial.required.$invalid ||
              v$.patientFirstInitial.nameValidator.$invalid)
          "
          class="text-danger"
          aria-live="assertive"
        >
          {{
            v$.patientFirstInitial.required.$invalid
              ? "First initial is required."
              : v$.patientFirstInitial.nameValidator.$invalid
                ? "First initial must begin with a letter and cannot include special characters except hyphens, periods, apostrophes and blank characters."
                : null
          }}
        </div>

        <InputComponent
          id="patient-last-name"
          v-model="patientLastName"
          label="Last name"
          :maxlength="lastNameMaxLength"
          :required="true"
          class="mt-3"
          :input-style="mediumStyles"
          @blur="handleChangeField(v$.patientLastName, $event, formFieldParent)"
        />
        <div
          v-if="v$.patientLastName.$dirty"
          class="text-danger"
          aria-live="assertive"
        >
          {{
            v$.patientLastName.required.$invalid
              ? "Last name is required."
              : v$.patientLastName.nameValidator.$invalid
                ? "Last name must begin with a letter and cannot include special characters except hyphens, periods, apostrophes and blank characters."
                : null
          }}
        </div>
        <DateInput
          id="patient-birthdate"
          v-model="patientBirthdate"
          label="Patient birthdate"
          :required="true"
          :use-invalid-state="true"
          class-name="mt-3"
          @process-date="handleProcessBirthdate($event)"
          @blur="handleChangeField(v$.patientBirthdate, null, null)"
        />
        <div
          v-if="v$.patientBirthdate.$dirty"
          class="text-danger"
          aria-live="assertive"
        >
          {{
            patientBirthdate == null && v$.patientBirthdate.required.$invalid
              ? "Birthdate is required."
              : v$.patientBirthdate.dateDataValidator.$invalid ||
                  v$.patientBirthdate.distantPastValidator.$invalid ||
                  v$.patientBirthdate.birthDatePastValidator.$invalid
                ? "Invalid birthdate."
                : null
          }}
        </div>
        <PhnInput
          id="patient-phn"
          v-model="patientPhn"
          label="PHN (Personal Health Number)"
          placeholder="9999999999"
          :required="true"
          class="mt-3"
          :input-style="smallStyles"
          @blur="handleChangeField(v$.patientPhn, $event, formFieldParent)"
        />
        <div
          v-if="v$.patientPhn.$dirty && v$.patientPhn.required.$invalid"
          class="text-danger"
          aria-live="assertive"
        >
          Personal Health Number is required.
        </div>
        <div
          v-if="
            v$.patientPhn.$dirty &&
            !v$.patientPhn.required.$invalid &&
            (v$.patientPhn.phnValidator.$invalid || v$.patientPhn.phnFirstDigitValidator.$invalid)
          "
          class="text-danger"
          aria-live="assertive"
        >
          Personal Health Number is not valid.
        </div>
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
import {
  PageContent,
  ContinueBar,
  RadioComponent,
  InputComponent,
  DateInput,
  PhnInput,
  phnValidator,
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
import { required } from "@vuelidate/validators";
import { nameValidator, dateDataValidator, phnFirstDigitValidator } from "../helpers/validators.js";
import { useVuelidate } from "@vuelidate/core";
import { useFormStore } from "@/stores/formData";
import { distantPastValidator, birthDatePastValidator } from "../helpers/date.js";
import { handleChangeField } from "../helpers/handler.js";
import {
  scrollTo,
  scrollToError,
  // getTopScrollPosition,
} from "../helpers/scroll";
</script>

<script>
export default {
  data() {
    return {
      v$: useVuelidate(),
      store: useFormStore(),
      formFieldParent: "patient",
      documentsCategory: null,
      patientBirthdate: null,
      patientFirstInitial: null,
      patientLastName: null,
      patientPhn: null,
      adjFirstName: null,
      adjLastName: null,
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
  created() {
    this.documentsCategory = this.store.formFields[this.formFieldParent]["documentsCategory"];
    this.patientLastName = this.store.formFields[this.formFieldParent]["patientLastName"];
    this.patientFirstInitial = this.store.formFields[this.formFieldParent]["patientFirstInitial"];
    this.patientBirthdate = this.store.formFields[this.formFieldParent]["patientBirthdate"];
    this.patientPhn = this.store.formFields[this.formFieldParent]["patientPhn"];
    this.adjFirstName = this.store.formFields[this.formFieldParent]["adjFirstName"];
    this.adjLastName = this.store.formFields[this.formFieldParent]["adjLastName"];
  },
  validations() {
    return {
      documentsCategory: {
        required,
      },
      patientLastName: {
        required,
        nameValidator,
      },
      adjFirstName: {},
      adjLastName: {},
      patientFirstInitial: {
        required,
        nameValidator,
      },
      patientBirthdate: {
        required,
        dateDataValidator,
        distantPastValidator,
        birthDatePastValidator,
      },
      patientPhn: {
        required,
        phnValidator,
        phnFirstDigitValidator,
      },
    };
  },
  methods: {
    nextPage() {
      this.v$.$validate();

      if (!this.v$.$error) {
        // Navigate to next path.
        const toPath = routes.UPLOAD_DOCUMENTS.path;
        pageStateService.setPageComplete(toPath);
        pageStateService.visitPage(toPath);
        this.$router.push(toPath);
        scrollTo(0);
      } else {
        scrollToError();
      }
    },
    handleProcessBirthdate(data) {
      this.store.updateFormField(this.formFieldParent, "patientBirthdate", data.date);
    },
  },
};
</script>
