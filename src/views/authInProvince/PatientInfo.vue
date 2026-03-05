<template>
  <ProgressBar
    :routes="authInProvRoutes"
    :current-path="$route.path"
  />
  <PageContent>
    <main class="container pt-3 pt-sm-5 mb-5">
      <h1 class="mb-0">Patient information</h1>
      <hr class="mt-0" />
      <h2>Patient</h2>
      <p class="mb-0">Please provide the nessecary information about this patient.</p>
      <hr class="mt-0" />
      <InputComponent
        id="patient-first-name"
        v-model="patientFirstName"
        cypress-id="patient-first-name"
        label="First name"
        :maxlength="firstNameMaxLength"
        :required="true"
        class="mt-3"
        :input-style="mediumStyles"
        @input="handleAPIValidationReset"
        @change="handleChangeField(v$.patientFirstName, $event, formFieldParent, store)"
      />
      <div
        v-if="
          v$.patientFirstName.$dirty &&
          (v$.patientFirstName.required.$invalid || v$.patientFirstName.nameValidator.$invalid)
        "
        class="text-danger error"
        aria-live="assertive"
      >
        {{
          v$.patientFirstName.required.$invalid
            ? "First name is required."
            : v$.patientFirstName.nameValidator.$invalid
              ? "First name must begin with a letter and cannot include special characters except hyphens, periods, apostrophes and blank characters."
              : null
        }}
      </div>
      <InputComponent
        id="patient-last-name"
        v-model="patientLastName"
        cypress-id="patient-last-name"
        label="Last name"
        :maxlength="lastNameMaxLength"
        :required="true"
        class="mt-3"
        :input-style="mediumStyles"
        @input="handleAPIValidationReset"
        @blur="handleChangeField(v$.patientLastName, $event, formFieldParent, store)"
      />
      <div
        v-if="
          v$.patientLastName.$dirty &&
          (v$.patientLastName.required.$invalid || v$.patientLastName.nameValidator.$invalid)
        "
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
      <PhnInput
        id="patient-phn"
        v-model="patientPhn"
        cypress-id="patient-phn"
        label="PHN (Personal Health Number)"
        placeholder="9999999999"
        :required="true"
        class="mt-3"
        :input-style="smallStyles"
        @input="handleAPIValidationReset"
        @blur="handleChangeField(v$.patientPhn, $event, formFieldParent, store)"
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
      <DateInput
        id="aip-patient-birthdate"
        v-model="patientBirthdate"
        cypress-id="patient-birthdate"
        label="Patient birthdate"
        :required="true"
        :use-invalid-state="true"
        class-name="mt-3"
        @process-date="handleProcessBirthdate($event)"
        @input="handleAPIValidationReset"
        @blur="handleChangeField(v$.patientBirthdate, null, null, store)"
      />
      <div
        v-if="v$.patientBirthdate.$dirty"
        class="text-danger error"
        aria-live="assertive"
      >
        {{
          patientBirthdate == null && v$.patientBirthdate.required.$invalid
            ? "Birthdate is required."
            : v$.patientBirthdate.birthDateValidator.$invalid ||
                v$.patientBirthdate.distantPastValidator.$invalid ||
                v$.patientBirthdate.birthDatePastValidator.$invalid
              ? "Invalid birthdate."
              : null
        }}
      </div>
      <div
        v-if="isSystemUnavailable"
        class="text-danger error my-4"
        aria-live="assertive"
      >
        Unable to continue, system unavailable. Please try again later.
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
  InputComponent,
  PageContent,
  ContinueBar,
  DateInput,
  PhnInput,
  phnValidator,
} from "common-lib-vue";
import { toRaw } from "vue";
import { smallStyles, mediumStyles } from "@/constants/input-styles";
import { firstNameMaxLength, lastNameMaxLength } from "@/constants/html-validations.js";
import { useVuelidate } from "@vuelidate/core";
import { handleChangeField } from "@/helpers/handler.js";
import { useCaptchaStore } from "@/stores/captchaStore";
import { useAuthInProvinceStore } from "@/stores/authInProvinceStore";
import { distantPastValidator, birthDatePastValidator } from "@/helpers/date.js";
import { scrollTo, scrollToError } from "@/helpers/scroll";
import { required } from "@vuelidate/validators";
import { nameValidator, birthDateValidator, phnFirstDigitValidator } from "@/helpers/validators.js";
import ProgressBar from "@/components/ProgressBar.vue";
import pageStateService from "@/services/page-state-service.js";
import { authInProvRoutes, routes } from "../../router";
import apiService from "@/services/api-service";
import logService from "@/services/log-service.js";
</script>

<script>
export default {
  name: "PatientInfo",
  components: {
    ProgressBar,
    InputComponent,
    PageContent,
    ContinueBar,
    DateInput,
    PhnInput,
  },
  data() {
    return {
      v$: useVuelidate(),
      captchaStore: useCaptchaStore(),
      store: useAuthInProvinceStore(),
      formFieldParent: "patientInfo",
      patientFirstName: null,
      patientLastName: null,
      patientPhn: null,
      patientBirthdate: null,
      isLoading: false,
      isSystemUnavailable: false,
      isAPIValidationErrorShown: false,
    };
  },
  created() {
    this.assignDataFromStore();
  },
  validations() {
    const validations = {
      patientFirstName: {
        required,
        nameValidator,
      },
      patientLastName: {
        required,
        nameValidator,
      },
      patientBirthdate: {
        required,
        birthDateValidator,
        distantPastValidator,
        birthDatePastValidator,
      },
      patientPhn: {
        required,
        phnValidator,
        phnFirstDigitValidator,
      },
    };
    return validations;
  },
  methods: {
    validatePage() {
      this.v$.$touch();
      if (this.v$.$error) {
        return scrollToError();
      }
      this.validatePatient();
    },

    validatePatient() {
      this.isLoading = true;
      this.isSystemUnavailable = false;
      this.isAPIValidationErrorShown = false;

      const patient = toRaw(this.store?.formFields?.patientInfo);
      if (import.meta.env.VITE_APP_ENV === "DEV") {
        console.log("patient:", patient);
      }

      apiService
        .validatePatient(patient, this.captchaStore)
        .then((response) => {
          this.isLoading = false;
          const returnCode = response.data.returnCode;

          switch (returnCode) {
            case "success": // Successfully executed API validation (data matches records)
              logService.logInfo(this.captchaStore.applicationUuid, {
                event: "validation success (validatePerson)",
                response: response.data,
              });
              this.nextPage();
              break;
            case "failure": // Either the data does not match records, or the API didn't recognize one of the fields
              this.isAPIValidationErrorShown = true;
              logService.logInfo(this.captchaStore.applicationUuid, {
                event: "validation failure (validatePerson)",
                response: response.data,
              });
              scrollToError();
              break;
            default: // An API error occurred, eg. first name max length exceeded.
              this.isSystemUnavailable = true;
              logService.logError(this.captchaStore.applicationUuid, {
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
          logService.logError(this.captchaStore.applicationUuid, {
            event: "HTTP error (validatePerson unexpected problem)",
            status: error.response.status,
          });
          scrollToError();
          this.isLoading = false;
        });
    },

    nextPage() {
      // Navigate to Medical Info Page
      const toPath = routes.AUTH_IN_PROV_MEDICAL.path;
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo(0);
      this.v$.$validate();
    },
    handleAPIValidationReset() {
      this.isAPIValidationErrorShown = false;
      this.isSystemUnavailable = false;
    },
    handleProcessBirthdate(data) {
      this.store.updateFormField(this.formFieldParent, "patientBirthdate", data.date);
    },
    handleChangeDate(validationObject, newValue, formFieldParent, store, dataField) {
      this[dataField] = newValue.date;
      if (validationObject) {
        validationObject.$touch();
        if (!validationObject.$invalid && newValue != null && formFieldParent) {
          store.updateFormField(formFieldParent, validationObject.$path, newValue);
        }
      }
    },
    assignDataFromStore() {
      this.patientFirstName = this.store.formFields[this.formFieldParent]["patientFirstName"];
      this.patientLastName = this.store.formFields[this.formFieldParent]["patientLastName"];
      this.patientPhn = this.store.formFields[this.formFieldParent]["patientPhn"];
      this.patientBirthdate = this.store.formFields[this.formFieldParent]["patientBirthdate"];
    },
  },
};
</script>
