<template>
  <main>
    <ProgressBar
      :routes="stepRoutes"
      :current-path="$route.path"
    />
    <PageContent>
      <main class="container pt-3 pt-sm-5 mb-5">
        <h1 class="mb-0">Get started</h1>
        <hr class="mt-0" />
        <h2>Welcome</h2>
        <p>
          Welcome to the Claims Correspondence Upload Portal. This form simplifies the submission of
          documents to support pre-authorization and claims.
        </p>
        <p>Before you begin:</p>
        <ul>
          <li>
            Please submit documents for one individual (Personal Health Number (PHN)) at a time.
            Submitting for more than one individual may delay the processing of your submission.
          </li>
          <li>
            If you are submitting documents in response to a request letter from Health Insurance BC
            (HIBC): for the quickest possible processing include all requested documents in your
            submission.
          </li>
          <li>
            Ensure that each document is in one of the following formats: JPG, PNG, GIF, BMP, or
            PDF.
          </li>
          <li>
            Ensure that each file or image displays the entire document from corner to corner; is
            oriented correctly (not upside down or sideways); and is in focus and readable.
          </li>
        </ul>
        <p>
          If you have any questions or need assistance, please contact the HIBC practitioner claim
          support team. (Vancouver: (604) 456-6950, Elsewhere in B.C.: 1-866-456-6950)
        </p>
        <h2 class="mt-5 mb-0">Practitioner information</h2>
        <hr class="mt-0" />
        <h3>Practitioner</h3>
        <p class="mb-0">Please provide the necessary information about the practitioner.</p>
        <hr class="mt-0" />
        <InputComponent
          id="prac-first-name"
          v-model="pracFirstName"
          cypress-id="pracFirstName"
          label="First name"
          :maxlength="firstNameMaxLength"
          :required="true"
          class="mt-3"
          :input-style="mediumStyles"
          @input="handleAPIValidationReset"
          @blur="handleChangeField(v$.pracFirstName, $event, formFieldParent)"
        />
        <div
          v-if="v$.pracFirstName.$dirty"
          class="text-danger"
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
          cypress-id="pracLastName"
          label="Last name"
          :maxlength="lastNameMaxLength"
          :required="true"
          class="mt-3"
          :input-style="mediumStyles"
          @input="handleAPIValidationReset"
          @blur="handleChangeField(v$.pracLastName, $event, formFieldParent)"
        />

        <div
          v-if="v$.pracLastName.$dirty"
          class="text-danger"
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
          cypress-id="pracNumber"
          class="mt-3"
          :input-style="extraSmallStyles"
          @input="handleAPIValidationReset"
          @blur="handleChangeField(v$.pracNumber, $event, formFieldParent)"
        />
        <div
          v-if="v$.pracNumber.$dirty"
          class="text-danger"
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

        <!-- Using PractitionerNumberInput because payee number has the same format as a practitioner number -->
        <PractitionerNumberInput
          id="payee-number"
          v-model="payeeNumber"
          label="Payee number"
          cypress-id="payeeNumber"
          class="mt-3"
          :input-style="extraSmallStyles"
          @input="handleAPIValidationReset"
          @blur="handleChangeField(v$.payeeNumber, $event, formFieldParent)"
        />

        <div
          v-if="v$.payeeNumber.$dirty"
          class="text-danger"
          aria-live="assertive"
        >
          {{
            v$.payeeNumber.required.$invalid
              ? "Payee number is required."
              : v$.payeeNumber.valueLengthValidator.$invalid
                ? "Payee number must be 5 charactes long."
                : null
          }}
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
          Practitioner information does not match our records.
        </div>
      </main>
    </PageContent>
  </main>
  <ContinueBar
    :button-label="'Continue'"
    :has-loader="isLoading"
    cypress-id="continue-bar"
    @continue="validatePage()"
  />
  <Teleport
    v-if="store.isShowConsentModal"
    to="#modal-target"
  >
    <ConsentModal @close="handleCloseConsentModal" />
  </Teleport>
</template>

<script setup>
import { PageContent, ContinueBar, InputComponent, PractitionerNumberInput } from "common-lib-vue";
import { extraSmallStyles, mediumStyles } from "@/constants/input-styles";
import { firstNameMaxLength, lastNameMaxLength } from "@/constants/html-validations.js";
import ProgressBar from "../components/ProgressBar.vue";
import { stepRoutes, routes } from "../router/index.js";
import pageStateService from "../services/page-state-service.js";
import { required } from "@vuelidate/validators";
import { nameValidator, valueLengthValidator } from "../helpers/validators.js";
import { useVuelidate } from "@vuelidate/core";
import { useFormStore } from "@/stores/formData";
import { handleChangeField } from "../helpers/handler.js";
import ConsentModal from "../components/ConsentModal.vue";
import {
  scrollTo,
  scrollToError,
  // getTopScrollPosition,
} from "../helpers/scroll";
import beforeRouteLeaveHandler from "@/helpers/beforeRouteLeaveHandler.js";
import apiService from "@/services/api-service";
import settings from "@/settings";
</script>

<script>
export default {
  name: "PractitionerInfo",
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
      formFieldParent: "practitioner",
      pracFirstName: null,
      pracLastName: null,
      pracNumber: null,
      payeeNumber: null,
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
  created() {
    this.assignDataFromStore();
  },
  validations() {
    return {
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
      payeeNumber: {
        required,
        valueLengthValidator,
      },
    };
  },
  methods: {
    validatePage() {
      //trigger Vuelidate validation
      this.v$.$validate();

      //if no Vuelidate errors, move to API check, otherwise scroll to error
      if (!this.v$.$error) {
        this.validatePractitioner();
      } else {
        scrollToError();
      }
    },
    validatePractitioner() {
      this.isLoading = true;
      this.isSystemUnavailable = false;
      this.isAPIValidationErrorShown = false;

      apiService
        .validatePractitioner(this.store)
        .then((response) => {
          this.isLoading = false;
          // const responseData = response.data;
          const returnCode = response.data.returnCode;

          switch (returnCode) {
            case "0": // Valid payload data.
              this.nextPage();
              break;
            case "1": // Invalid payload data.
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
      //Navigate to next path.
      const toPath = routes.PATIENT_INFO.path;
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo(0);
    },
    handleAPIValidationReset() {
      this.isAPIValidationErrorShown = false;
      this.isSystemUnavailable = false;
    },
    handleCloseConsentModal(value) {
      this.store.isShowConsentModal = !value;
      if (settings.useSampleData) {
        //assign sample data to the Pinia store
        this.store.assignSampleData();
        //pull local data values from the store one more time, since the store was just changed
        this.assignDataFromStore();
      }
    },
    assignDataFromStore() {
      this.pracFirstName = this.store.formFields[this.formFieldParent]["pracFirstName"];
      this.pracLastName = this.store.formFields[this.formFieldParent]["pracLastName"];
      this.pracNumber = this.store.formFields[this.formFieldParent]["pracNumber"];
      this.payeeNumber = this.store.formFields[this.formFieldParent]["payeeNumber"];
    },
  },
};
</script>
