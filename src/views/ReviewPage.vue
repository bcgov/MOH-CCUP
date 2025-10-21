<template>
  <ProgressBar
    :routes="stepRoutes"
    :current-path="$route.path"
  />
  <PageContent>
    <main class="container mb-5">
      <h1 class="my-0">Review</h1>
      <hr class="mt-0" />
      <ReviewTable :show-edit-buttons="true" />
      <h2 class="my-0 mt-5">Declaration of accuracy and validity</h2>
      <hr class="mt-0" />
      <div class="mt-1 row">
        <p>
          {{ declarationAccuracy }}
        </p>
        <p>
          {{ declarationValidity }}
        </p>
      </div>
      <div class="row px-3 fs-5">
        <CheckboxComponent
          id="pratitioner-declaration-accuracy"
          v-model="review.isDeclarationAccuracy"
          cypress-id="isDeclarationAccuracy"
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
import { useDocSubmissionStore } from "@/stores/docSubmissionStore";
import { useVuelidate } from "@vuelidate/core";
import { PageContent, ContinueBar, CheckboxComponent } from "common-lib-vue";
import { stepRoutes, routes } from "../router/index.js";
import ProgressBar from "../components/ProgressBar.vue";
import pageStateService from "../services/page-state-service.js";
import logService from "@/services/log-service.js";
import ReviewTable from "../components/ReviewTable.vue";
import { scrollTo, scrollToError } from "../helpers/scroll";
import beforeRouteLeaveHandler from "@/helpers/beforeRouteLeaveHandler.js";
import apiService from "@/services/api-service";
import { declarationAccuracy, declarationValidity } from "@/constants/declarations.js";
</script>

<script>
const requiredTrue = (value) => {
  return value === true;
};

export default {
  beforeRouteLeave(to, from, next) {
    beforeRouteLeaveHandler(to, from, next);
  },
  data() {
    return {
      v$: useVuelidate(),
      captchaStore: useCaptchaStore(),
      store: useDocSubmissionStore(),
      formFieldPractitioner: "practitioner",
      formFieldPatient: "patient",

      practitioner: {
        firstName: null,
        lastName: null,
        number: null,
        payeeNumber: null,
      },
      patient: {
        documentsCategory: null,
        birthdate: null,
        firstInitial: null,
        lastName: null,
        phn: null,
        adjudicator: {
          adjFirstName: null,
          adjLastName: null,
        },
      },
      upload: {
        note: null,
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
    radioOptionsDocumentsCategory() {
      return [
        {
          id: "documents-category-claim",
          label: "Claims document(s)",
          value: "claims",
        },
        {
          id: "documents-category-pre-auth",
          label: "Pre-authorization document(S)",
          value: "pre-auth",
        },
      ];
    },
  },
  created() {
    this.practitioner.firstName =
      this.store.formFields[this.formFieldPractitioner]["pracFirstName"];
    this.practitioner.lastName = this.store.formFields[this.formFieldPractitioner]["pracLastName"];

    this.pracFullName =
      this.practitioner.firstName != null && this.practitioner.lastName != null
        ? this.practitioner.firstName + " " + this.practitioner.lastName
        : "";
    logService.logNavigation(
      this.captchaStore.captcha.applicationUuid,
      routes.REVIEW_PAGE.path,
      routes.REVIEW_PAGE.title
    );
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
      //trigger Vuelidate validation
      this.v$.$validate();

      //if no Vuelidate errors, move to API check, otherwise scroll to error
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

      apiService
        .sendAttachments(this.store, this.captchaStore)
        .then(() => {
          //if all image uploads are successful, submit the form
          logService.logInfo(this.captchaStore.captcha.applicationUuid, {
            event: "submission success (sendAttachments, all)",
            response: "N/A",
          });
          this.submitForm();
        })
        .catch((error) => {
          //this is the error code that runs if any attachments fail to send
          this.isLoading = false;
          this.isSystemUnavailable = true;
          logService.logError(this.captchaStore.captcha.applicationUuid, {
            event: "submission failure (one or more sendAttachment calls failed)",
            status: error,
          });
          scrollToError();
        });
    },
    submitForm() {
      this.isLoading = true;
      this.isSystemUnavailable = false;
      apiService
        .submitForm(this.store, this.captchaStore)
        .then((response) => {
          this.isLoading = false;
          const returnCode = response.data.returnCode;
          switch (returnCode) {
            case "success": // Successfully submitted form
              this.store.updateFormField("review", "referenceNumber", response.data.refNumber);
              logService.logInfo(this.captchaStore.captcha.applicationUuid, {
                event: "submission success (submitForm)",
                response: response.data,
              });
              this.nextPage();
              break;
            case "failure": // Submission failure, eg. API didn't recognize a field
              this.isAPIValidationErrorShown = true;
              logService.logError(this.captchaStore.captcha.applicationUuid, {
                event: "submission failure (submitForm)",
                response: response.data,
              });
              scrollToError();
              break;
            default: // Default error handler
              this.isSystemUnavailable = true;
              logService.logError(this.captchaStore.captcha.applicationUuid, {
                event: "submission failure (submitForm endpoint unavailable)",
                response: response.data,
              });
              scrollToError();
              break;
          }
        })
        .catch((error) => {
          // all other errors, eg. if the server is down
          this.isLoading = false;
          this.isSystemUnavailable = true;
          logService.logError(this.captchaStore.captcha.applicationUuid, {
            event: "HTTP error (submitForm schema error or other unexpected problem)",
            status: error.response.status,
          });
          scrollToError();
        });
    },
    nextPage() {
      // Navigate to next path.
      const toPath = routes.SUBMISSION_PAGE.path;
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo(0);
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
