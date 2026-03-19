<template>
  <ProgressBar
    :routes="authInProvRoutes"
    :current-path="$route.path"
  />
  <PageContent>
    <main class="container pt-3 pt-sm-5 mb-5">
      <h1 class="mb-0">Practitioner information</h1>
      <hr class="mt-0" />
      <h2>Practitioner</h2>
      <p class="mb-0">Please provide the necessary information about the practitioner.</p>
      <hr class="mt-0" />
      <InputComponent
        id="prac-first-name"
        v-model="pracFirstName"
        cypress-id="prac-first-name"
        label="First name"
        :maxlength="firstNameMaxLength"
        :required="true"
        class="mt-3"
        :input-style="mediumStyles"
        @blur="handleChangeField(v$.pracFirstName, $event, formFieldParent, store)"
      />
      <div
        v-if="v$.pracFirstName.$dirty && v$.pracFirstName.$invalid"
        class="text-danger error"
        aria-live="assertive"
      >
        {{
          v$.pracFirstName.required.$invalid
            ? "First name is required."
            : v$.pracFirstName.nameValidator.$invalid
              ? "First name must begin with a letter and cannot include special characters except hyphens, periods, apostrophes and blank characters."
              : null
        }}
      </div>
      <InputComponent
        id="prac-last-name"
        v-model="pracLastName"
        cypress-id="prac-last-name"
        label="Last name"
        :maxlength="lastNameMaxLength"
        :required="true"
        class="mt-3"
        :input-style="mediumStyles"
        @blur="handleChangeField(v$.pracLastName, $event, formFieldParent, store)"
      />
      <div
        v-if="v$.pracLastName.$dirty && v$.pracLastName.$invalid"
        class="text-danger error"
        aria-live="assertive"
      >
        {{
          v$.pracLastName.required.$invalid
            ? "Last name is required."
            : v$.pracLastName.nameValidator.$invalid
              ? "Last name must begin with a letter and cannot include special characters except hyphens, periods, apostrophes and blank characters."
              : null
        }}
      </div>
      <PractitionerNumberInput
        id="prac-number"
        v-model="pracNumber"
        label="Practitioner number"
        cypress-id="prac-number"
        class="mt-3"
        :input-style="extraSmallStyles"
        @blur="handleChangeField(v$.pracNumber, $event, formFieldParent, store)"
      />
      <div
        v-if="v$.pracNumber.$dirty && v$.pracNumber.$invalid"
        class="text-danger error"
        aria-live="assertive"
      >
        {{
          v$.pracNumber.required.$invalid
            ? "Practitioner number is required."
            : v$.pracNumber.valueLengthValidator.$invalid
              ? "Practitioner number must be 5 charactes long."
              : null
        }}
      </div>
      <div
        v-if="isAPIValidationErrorShown"
        class="text-danger error my-4"
        aria-live="assertive"
      >
        Practitioner information does not match our records.
      </div>
    </main>
  </PageContent>
  <ContinueBar
    :button-label="'Continue'"
    cypress-id="continue-bar"
    @continue="validatePage()"
  />
</template>

<script setup>
import { toRaw } from "vue";
import { PageContent, ContinueBar, InputComponent, PractitionerNumberInput } from "common-lib-vue";
import { firstNameMaxLength, lastNameMaxLength } from "@/constants/html-validations.js";
import { extraSmallStyles, mediumStyles } from "@/constants/input-styles";
import { useVuelidate } from "@vuelidate/core";
import { handleChangeField } from "@/helpers/handler.js";
import { useCaptchaStore } from "@/stores/captchaStore";
import { useAuthInProvinceStore } from "@/stores/authInProvinceStore.js";
import { required } from "@vuelidate/validators";
import { nameValidator, valueLengthValidator } from "@/helpers/validators.js";
import { scrollTo, scrollToError } from "@/helpers/scroll";
import ProgressBar from "@/components/ProgressBar.vue";
import pageStateService from "@/services/page-state-service.js";
import { authInProvRoutes, routes } from "../../router";
import apiService from "@/services/api-service";
import logService from "@/services/log-service.js";
</script>

<script>
export default {
  name: "PractitionerInfo",
  data() {
    return {
      v$: useVuelidate(),
      captchaStore: useCaptchaStore(),
      store: useAuthInProvinceStore(),
      formFieldParent: "practitionerInfo",
      pracFirstName: null,
      pracLastName: null,
      pracNumber: null,
      isLoading: false,
      isAPIValidationErrorShown: false,
      isSystemUnavailable: false,
    };
  },
  created() {
    this.assignDataFromStore();
  },
  validations() {
    const validations = {
      pracFirstName: {
        required,
        nameValidator,
      },
      pracLastName: {
        required,
        nameValidator,
      },
      pracNumber: {
        required,
        valueLengthValidator,
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
      this.validatePractitioner();
    },

    validatePractitioner() {
      this.isLoading = true;
      this.isSystemUnavailable = false;
      this.isAPIValidationErrorShown = false;

      const practitioner = toRaw(this.store?.formFields?.practitionerInfo);
      apiService
        .validatePractitioner(practitioner, this.captchaStore)
        .then((response) => {
          this.isLoading = false;
          const returnCode = response.data.returnCode;

          // Validation error - not found
          if (returnCode == "1") {
            this.isAPIValidationErrorShown = true;

            logService.logError(this.captchaStore.applicationUuid, {
              event: "validation failure (validatePractitioner)",
              response: response.data,
            });
            return scrollToError();
          }

          // Something went wrong.  Bad code or system error
          if (returnCode != "0") {
            this.isSystemUnavailable = true;
            logService.logError(this.captchaStore.applicationUuid, {
              event: "validation failure (validatePractitioner endpoint unavailable)",
              response: response.data,
            });
            return scrollToError();
          }

          // Successfully executed API validation (data matches records)
          logService.logInfo(this.captchaStore.applicationUuid, {
            event: "validation success (validatePractitioner)",
            response: response.data,
          });
          this.nextPage();
        })
        .catch((error) => {
          //all other errors, eg. if the server is down
          this.isLoading = false;
          this.isSystemUnavailable = true;
          logService.logError(this.captchaStore.applicationUuid, {
            event: "HTTP error (validatePractitioner unexpected problem)",
            status: error.response.status,
          });
          scrollToError();
        });
    },

    nextPage() {
      const toPath = routes.AUTH_IN_PROV_REVIEW_PAGE.path;
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo(0);
    },

    assignDataFromStore() {
      this.pracFirstName = this.store.formFields[this.formFieldParent]["pracFirstName"];
      this.pracLastName = this.store.formFields[this.formFieldParent]["pracLastName"];
      this.pracNumber = this.store.formFields[this.formFieldParent]["pracNumber"];
    },
  },
};
</script>
<style></style>
