<template>
  <ProgressBar
    :routes="authInProvRoutes"
    :current-path="$route.path"
  />
  <PageContent>
    <main class="container mb-5">
      <h1 class="my-0">Review and declaration</h1>
      <hr class="mt-0" />
      <AuthInProvReviewTable :show-edit-buttons="true" />
      <h2 class="my-0 mt-5">Declaration of accuracy and validity</h2>
      <hr class="mt-0" />
      <div class="mt-1 row">
        <p>
          {{ declarations.authInProv.declarationAccuracy }}
        </p>
        <p>
          {{ declarations.authInProv.declarationValidity }}
        </p>
      </div>
      <div class="row px-3 fs-5">
        <CheckboxComponent
          id="practitioner-declaration-accuracy"
          v-model="review.isDeclarationAccuracy"
          cypress-id="practitioner-declaration-accuracy"
          :required="true"
          :label="pracFullName"
          @change="handleCheckBoxChange"
          @input="handleAPIValidationReset"
        />
      </div>
      <div
        v-if="
          v$.review.isDeclarationAccuracy.$dirty &&
          v$.review.isDeclarationAccuracy.requiredTrue.$invalid
        "
        class="text-danger error mt-3"
        aria-live="assertive"
      >
        Field is required.
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
        There was a problem with your submission. Please try again.
      </div>
    </main>
  </PageContent>
  <ContinueBar
    :has-loader="isLoading"
    :button-label="'Submit'"
    cypress-id="continue-bar"
    @continue="validatePage()"
  />
</template>

<script setup>
import { useCaptchaStore } from "@/stores/captchaStore";
import { useAuthInProvinceStore } from "@/stores/authInProvinceStore";
import { useVuelidate } from "@vuelidate/core";
import { PageContent, ContinueBar, CheckboxComponent } from "common-lib-vue";
import { declarations } from "@/constants/declarations.js";
import AuthInProvReviewTable from "../../components/AuthInProvReviewTable.vue";
import { scrollTo, scrollToError } from "@/helpers/scroll";
import ProgressBar from "@/components/ProgressBar.vue";
import pageStateService from "@/services/page-state-service.js";
import { authInProvRoutes, routes } from "../../router";
import apiService from "@/services/api-service";
import logService from "@/services/log-service.js";
</script>

<script>
const requiredTrue = (value) => {
  return value === true;
};

export default {
  name: "ReviewPage",
  data() {
    return {
      v$: useVuelidate(),
      captchaStore: useCaptchaStore(),
      store: useAuthInProvinceStore(),
      formFieldPatient: "patientInfo",
      formFieldPractitioner: "practitionerInfo",
      formFieldMedical: "medicalInfo",
      patientInfo: {
        patientFirstName: null,
        patientLastName: null,
        patientBirthdate: null,
        patientPhn: null,
      },
      practitionerInfo: {
        pracFirstName: null,
        pracLastName: null,
        pracNumber: null,
      },
      medicalInfo: {
        proposedProcedure: null,
        feeItems: null,
        previousSurgeryDate: null,
        traumaDate: null,
        consultationReport: [],
        description: null,
      },
      review: {
        isDeclarationAccuracy: false,
      },
      isLoading: false,
      isSystemUnavailable: false,
      isAPIValidationErrorShown: false,
    };
  },
  computed: {
    pageTitle: function () {
      return this.$route.title;
    },
  },
  created() {
    this.practitionerInfo.pracFirstName =
      this.store.formFields[this.formFieldPractitioner]["pracFirstName"];
    this.practitionerInfo.pracLastName =
      this.store.formFields[this.formFieldPractitioner]["pracLastName"];
    this.pracFullName =
      this.practitionerInfo.pracFirstName != null && this.practitionerInfo.pracLastName != null
        ? this.practitionerInfo.pracFirstName + " " + this.practitionerInfo.pracLastName
        : "";
  },
  validations() {
    return {
      review: {
        isDeclarationAccuracy: {
          requiredTrue,
        },
      },
    };
  },
  methods: {
    validatePage() {
      // trigger Vuelidate validation
      this.v$.$validate();

      // if no Vuelidate errors, move to API check, otherwise scroll to error
      if (!this.v$.$error) {
        this.handleAttachments();
      } else {
        scrollToError();
      }
    },
    handleAttachments() {
      this.isLoading = true;
      this.isSystemUnavailable = false;
      this.isAPIValidationErrorShown = false;

      const documents = this.store.formFields.medicalInfo.consultationReport;
      apiService
        .sendAttachments(documents, this.captchaStore)
        .then(() => {
          logService.logInfo(this.captchaStore.applicationUuid, {
            event: "submission success (sendAttachments, all)",
            response: "N/A",
          });
          this.submitForm();
        })
        .catch((error) => {
          this.isLoading = false;
          this.isSystemUnavailable = true;
          logService.logError(this.captchaStore.applicationUuid, {
            event: "submission failure (one or more sendAttachment calls failed)",
            status: error,
          });
          scrollToError();
        });
    },
    submitForm() {
      this.isLoading = true;
      this.isSystemUnavailable = false;

      const patient = this.store.formFields.patientInfo;
      const practitioner = this.store.formFields.practitionerInfo;
      const info = this.store.formFields.medicalInfo;
      const documents = info.consultationReport;

      apiService
        .submitAuthInProvForm(
          patient,
          practitioner,
          info,
          documents,
          this.captchaStore,
          declarations.authInProv
        )
        .then((response) => {
          this.isLoading = false;
          const returnCode = response?.data?.returnCode;

          // "Normal" submission errors
          if (returnCode == "-1" || returnCode == "failure") {
            this.isAPIValidationErrorShown = true;
            logService.logError(this.captchaStore.applicationUuid, {
              event: `submission failure (submitForm)`,
              response: response.data,
            });
            return scrollToError();
          }

          // Anything else is unexpected
          if (returnCode !== "success") {
            this.isSystemUnavailable = true;
            logService.logError(this.captchaStore.applicationUuid, {
              event: `submission failure (submitForm bad response)`,
              response: response.data,
            });
            return scrollToError();
          }

          // Happy path - Submission success
          this.store.updateFormField("review", "referenceNumber", response.data.refNumber);
          logService.logInfo(this.captchaStore.applicationUuid, {
            event: "submission success (submitForm)",
            response: response.data,
          });
          return this.complete();
        })

        .catch((error) => {
          // all other errors, eg. if the server is down
          this.isLoading = false;
          this.isSystemUnavailable = true;
          logService.logError(this.captchaStore.applicationUuid, {
            event: "HTTP error (submitForm schema error or other unexpected problem)",
            status: error?.response?.status,
          });
          scrollToError();
        });
    },
    complete() {
      // Navigate to Confirmation/Submission Page
      const toPath = routes.AUTH_IN_PROV_SUBMISSION.path;
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo(0);
      this.v$.$validate();
    },
    handleCheckBoxChange(e) {
      this.v$.review.isDeclarationAccuracy.$touch();
      this.store.updateFormField("review", "isDeclarationAccuracy", e.target.checked);
    },
    handleAPIValidationReset() {
      this.isAPIValidationErrorShown = false;
      this.isSystemUnavailable = false;
    },
  },
};
</script>

<style>
.icon-style {
  width: 16px;
}

.row-details {
  height: 30px;
  padding-bottom: 0.5rem !important;
}

.row-title {
  margin-bottom: 9px;
}

div.card-body.bg-gray {
  background-color: #f4f4f4;
}

div.card-header {
  background-color: white;
  border-color: #d9d9d9;
  border-width: 3px;
}

hr {
  background-color: #313132;
}

.icon-align-right {
  display: flex;
  justify-content: flex-end;
}

a.link-icon {
  text-decoration: none;
}
</style>
