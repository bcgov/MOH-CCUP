<template>
  <ProgressBar
    :routes="overAgeRoutes"
    :current-path="$route.path"
  />
  <PageContent>
    <main class="container mb-5">
      <h1 class="my-0">Review</h1>
      <hr class="mt-0" />
      <OverAgeReviewTable :show-edit-buttons="true" />
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
import { useOverAgeClaimStore } from "@/stores/overAgeClaimStore";
import { useVuelidate } from "@vuelidate/core";
import { PageContent, ContinueBar, CheckboxComponent } from "common-lib-vue";
import { declarationAccuracy, declarationValidity } from "@/constants/declarations.js";
import OverAgeReviewTable from "../../components/OverAgeReviewTable.vue";
import { overAgeRoutes, routes } from "@/router/index.js";
import ProgressBar from "@/components/ProgressBar.vue";
import pageStateService from "@/services/page-state-service.js";
import { scrollTo, scrollToError } from "@/helpers/scroll";
</script>

<script>
const requiredTrue = (value) => {
  return value === true;
};

export default {
  name: "ReviewPage",
  components: {
    ProgressBar,
  },
  data() {
    return {
      v$: useVuelidate(),
      captchaStore: useCaptchaStore(),
      store: useOverAgeClaimStore(),
      formFieldPractitioner: "practitioner",
      formFieldClaims: "claims",
      practitioner: {
        pracFirstName: null,
        pracLastName: null,
        pracNumber: null,
        payeeNumber: null,
        dataCenterNumber: null,
        contactPhoneNumber: null,
        preferredContactMethod: null,
        faxNumber: null,
      },
      claims: {
        dateType: null,
        claimServiceDate: null,
        claimFromDate: null,
        claimToDate: null,
        approximateClaimNumber: null,
        approximateDollarValue: null,
        feeItems: null,
        detailedExplanation: null,
        claimSupportDocuments: [],
        claimComment: null,
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
    radioOptionsPreferredContactMethod() {
      return [
        {
          id: "preferred-contact-method-fax",
          label: "Fax",
          value: "fax",
        },
        {
          id: "preferred-contact-method-mail",
          label: "Mail",
          value: "mail",
        },
      ];
    },
    radioOptionsDateType() {
      return [
        {
          id: "date-type-date",
          label: "Date of service",
          value: "date",
        },
        {
          id: "date-type-range",
          label: "Range of dates",
          value: "range",
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
        this.submitForm();
      } else {
        scrollToError();
      }
    },
    // handleAttachments() {
    //   this.isLoading = true;
    //   this.isSystemUnavailable = false;
    //   this.isAPIValidationErrorShown = false;
    // },
    submitForm() {
      this.isLoading = true;
      this.isSystemUnavailable = false;
      this.isAPIValidationErrorShown = false;

      //Navigate to the submission page
      const toPath = routes.OVER_AGE_SUBMISSION.path;
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo(0);
    },
    // nextPage() {},
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
