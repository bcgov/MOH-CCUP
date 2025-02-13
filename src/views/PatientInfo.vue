<template>
  <ProgressBar
    :routes="stepRoutes"
    :current-path="$route.path"
  />
  <PageContent>
    <main class="container pt-3 pt-sm-5 mb-5">
      <h1 class="mb-0">Patient information</h1>
      <hr class="mt-0" />
      <h2>Document type</h2>
      <RadioComponent
        id="documents-category"
        v-model="documentsCategory"
        label="Indicate below the type of document(s) you are uploading. You must select and submit one document type for each submission."
        aria-labelledby="documentsCategory"
        name="documents-category"
        :required="true"
        :items="radioOptionsDocumentsCategory"
        cypress-id="documents-category"
        :model-value="documentsCategory"
        @input="handleAPIValidationReset"
        @change="handleChangeField(v$.documentsCategory, $event, formFieldParent)"
      />

      <div
        v-if="v$.documentsCategory.$errors.length > 0"
        class="text-danger error"
        aria-live="assertive"
      >
        Select a document type.
      </div>
      <h2 class="mt-5">Adjudicator</h2>
      <p class="mb-0">
        Please provide, if possible, the adjudicator’s name, which is included in your letter. This
        information will help us significantly in expediting the processing of your data.
      </p>
      <hr class="mt-0" />
      <InputComponent
        id="adj-first-name"
        v-model="adjFirstName"
        cypress-id="adjFirstName"
        label="First name (optional)"
        :maxlength="firstNameMaxLength"
        class="mt-3"
        :input-style="mediumStyles"
        @input="handleAPIValidationReset"
        @blur="handleChangeField(v$.adjFirstName, $event, formFieldParent)"
      />
      <InputComponent
        id="adj-last-name"
        v-model="adjLastName"
        cypress-id="adjLastName"
        label="Last name (optional)"
        :maxlength="lastNameMaxLength"
        class="mt-3"
        :input-style="mediumStyles"
        @input="handleAPIValidationReset"
        @blur="handleChangeField(v$.adjLastName, $event, formFieldParent)"
      />
      <h2 class="mt-5">Patient</h2>
      <p class="mb-0">Please provide the necessary information about the patient.</p>
      <hr class="mt-0" />
      <InputComponent
        id="patient-first-initial"
        v-model="patientFirstInitial"
        cypress-id="patientFirstInitial"
        label="First initial"
        :maxlength="firstInitialMaxLength"
        :required="true"
        class="mt-3"
        :input-style="mediumStyles"
        @input="handleAPIValidationReset"
        @change="handleChangeField(v$.patientFirstInitial, $event, formFieldParent)"
      />
      <div
        v-if="
          v$.patientFirstInitial.$dirty &&
          (v$.patientFirstInitial.required.$invalid ||
            v$.patientFirstInitial.nameValidator.$invalid)
        "
        class="text-danger error"
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
        cypress-id="patientLastName"
        label="Last name"
        :maxlength="lastNameMaxLength"
        :required="true"
        class="mt-3"
        :input-style="mediumStyles"
        @input="handleAPIValidationReset"
        @blur="handleChangeField(v$.patientLastName, $event, formFieldParent)"
      />
      <div
        v-if="v$.patientLastName.$dirty"
        class="text-danger error"
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
        cypress-id="patientBirthdate"
        label="Patient birthdate"
        :required="true"
        :use-invalid-state="true"
        class-name="mt-3"
        @process-date="handleProcessBirthdate($event)"
        @input="handleAPIValidationReset"
        @blur="handleChangeField(v$.patientBirthdate, null, null)"
      />
      <div
        v-if="v$.patientBirthdate.$dirty"
        class="text-danger error"
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
        cypress-id="patientPhn"
        label="PHN (Personal Health Number)"
        placeholder="9999999999"
        :required="true"
        class="mt-3"
        :input-style="smallStyles"
        @input="handleAPIValidationReset"
        @blur="handleChangeField(v$.patientPhn, $event, formFieldParent)"
      />
      <div
        v-if="v$.patientPhn.$dirty && v$.patientPhn.required.$invalid"
        class="text-danger error"
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
        class="text-danger error"
        aria-live="assertive"
      >
        Personal Health Number is not valid.
      </div>
      <div
        v-if="isSystemUnavailable"
        class="text-danger error my-4"
        aria-live="assertive"
      >
        Unable to continue, system unavailable. Please try again later.
      </div>
      <div
        v-if="isAPIValidationErrorShown"
        class="text-danger error my-4"
        aria-live="assertive"
      >
        Patient information does not match our records.
      </div>
    </main>
  </PageContent>
  <ContinueBar
    :button-label="'Continue'"
    :has-loader="isLoading"
    cypress-id="continue-bar"
    @continue="validatePage()"
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
import { smallStyles, mediumStyles } from "@/constants/input-styles";
import {
  firstNameMaxLength,
  firstInitialMaxLength,
  lastNameMaxLength,
} from "@/constants/html-validations.js";
import ProgressBar from "../components/ProgressBar.vue";
import { stepRoutes, routes } from "../router/index.js";
import pageStateService from "../services/page-state-service.js";
import logService from "@/services/log-service.js";
import { required } from "@vuelidate/validators";
import { nameValidator, dateDataValidator, phnFirstDigitValidator } from "../helpers/validators.js";
import { useVuelidate } from "@vuelidate/core";
import { useFormStore } from "@/stores/formData";
import { distantPastValidator, birthDatePastValidator } from "../helpers/date.js";
import { handleChangeField } from "../helpers/handler.js";
import { scrollTo, scrollToError } from "../helpers/scroll";
import beforeRouteLeaveHandler from "@/helpers/beforeRouteLeaveHandler.js";
import apiService from "@/services/api-service";
</script>

<script>
export default {
  name: "PatientInfo",
  components: {
    ProgressBar,
  },
  beforeRouteLeave(to, from, next) {
    beforeRouteLeaveHandler(to, from, next);
  },
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
      isLoading: false,
      isSystemUnavailable: false,
      isAPIValidationErrorShown: false,
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
    this.assignDataFromStore();
    logService.logNavigation(
      this.store.captcha.applicationUuid,
      routes.PATIENT_INFO.path,
      routes.PATIENT_INFO.title
    );
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
    validatePage() {
      //trigger Vuelidate validation
      this.v$.$validate();

      //if no Vuelidate errors, move to API check, otherwise scroll to error
      if (!this.v$.$error) {
        this.validatePatient();
      } else {
        scrollToError();
      }
    },
    validatePatient() {
      this.isLoading = true;
      this.isSystemUnavailable = false;
      this.isAPIValidationErrorShown = false;

      apiService
        .validatePatient(this.store)
        .then((response) => {
          this.isLoading = false;
          const returnCode = response.data.returnCode;

          switch (returnCode) {
            case "success": // Successfully executed API validation (data matches records)
              logService.logInfo(this.store.captcha.applicationUuid, {
                event: "validation success (validatePerson)",
                response: response.data,
              });
              this.nextPage();
              break;
            case "failure": // Either the data does not match records, or the API didn't recognize one of the fields
              this.isAPIValidationErrorShown = true;
              logService.logInfo(this.store.captcha.applicationUuid, {
                event: "validation failure (validatePerson)",
                response: response.data,
              });
              scrollToError();
              break;
            default: // An API error occurred, eg. first name max length exceeded.
              this.isSystemUnavailable = true;
              logService.logError(this.store.captcha.applicationUuid, {
                event: "validation failure (validatePerson endpoint unavailable)",
                response: response.data,
              });
              scrollToError();
              break;
          }
        })
        .catch((error) => {
          //all other errors, eg. if the server is down
          this.isSystemUnavailable = true;
          logService.logError(this.store.captcha.applicationUuid, {
            event: "HTTP error (validatePerson unexpected problem)",
            status: error.response.status,
          });
          scrollToError();
          this.isLoading = false;
        });
    },
    nextPage() {
      //Navigate to next path.
      const toPath = routes.UPLOAD_DOCUMENTS.path;
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo(0);
    },
    handleAPIValidationReset() {
      this.isAPIValidationErrorShown = false;
      this.isSystemUnavailable = false;
    },
    handleProcessBirthdate(data) {
      this.store.updateFormField(this.formFieldParent, "patientBirthdate", data.date);
    },
    assignDataFromStore() {
      this.documentsCategory = this.store.formFields[this.formFieldParent]["documentsCategory"];
      this.patientLastName = this.store.formFields[this.formFieldParent]["patientLastName"];
      this.patientFirstInitial = this.store.formFields[this.formFieldParent]["patientFirstInitial"];
      this.patientBirthdate = this.store.formFields[this.formFieldParent]["patientBirthdate"];
      this.patientPhn = this.store.formFields[this.formFieldParent]["patientPhn"];
      this.adjFirstName = this.store.formFields[this.formFieldParent]["adjFirstName"];
      this.adjLastName = this.store.formFields[this.formFieldParent]["adjLastName"];
    },
  },
};
</script>
