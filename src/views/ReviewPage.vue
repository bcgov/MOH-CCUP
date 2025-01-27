<template>
  <main>
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
            :label="pracFullName"
            @change="handleCheckBoxChange"
            @input="handleAPIValidationReset"
          />
        </div>
        <div
          v-if="isSystemUnavailable"
          class="text-danger my-4"
          aria-live="assertive"
        >
          Unable to continue, system unavailable. Please try again later.
        </div>
        <div
          v-if="isAPIValidationErrorShown"
          class="text-danger my-4"
          aria-live="assertive"
        >
          There was a problem with your submission. Please try again.
        </div>
      </main>
    </PageContent>
  </main>
  <ContinueBar
    :has-loader="isLoading"
    :button-label="'Submit'"
    cypress-id="continue-bar"
    @continue="validatePage()"
  />
</template>
<script setup>
// import { smallStyles, mediumStyles } from "@/constants/input-styles";
import { useFormStore } from "@/stores/formData";
import { PageContent, ContinueBar, CheckboxComponent } from "common-lib-vue";
import { stepRoutes, routes } from "../router/index.js";
import ProgressBar from "../components/ProgressBar.vue";
import pageStateService from "../services/page-state-service.js";
import ReviewTable from "../components/ReviewTable.vue";
import {
  scrollTo,
  scrollToError,
  // getTopScrollPosition,
} from "../helpers/scroll";
import beforeRouteLeaveHandler from "@/helpers/beforeRouteLeaveHandler.js";
import apiService from "@/services/api-service";
import { declarationAccuracy, declarationValidity } from "@/constants/declarations.js";
</script>

<script>
export default {
  beforeRouteLeave(to, from, next) {
    beforeRouteLeaveHandler(to, from, next);
  },
  data() {
    return {
      store: useFormStore(),
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
        isDeclarationAccuracy: null,
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
  },
  methods: {
    validatePage() {
      this.isLoading = true;
      this.isSystemUnavailable = false;
      this.isAPIValidationErrorShown = false;
      apiService
        .submitForm(this.store)
        .then((response) => {
          this.isLoading = false;
          // const responseData = response.data;
          const returnCode = response.data.returnCode;
          switch (returnCode) {
            case "success": // Valid payload data.
              this.nextPage();
              break;
            case "failure": // Invalid payload data.
              this.isAPIValidationErrorShown = true;
              scrollToError();
              break;
            default: // An error occurred.
              this.isSystemUnavailable = true;
              scrollToError();
              break;
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.isSystemUnavailable = true;
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
