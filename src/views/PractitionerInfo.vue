<template>
  <main>
    <ProgressBar
      :routes="stepRoutes"
      :current-path="$route.path"
    />
    <PageContent>
      <main class="container pt-3 pt-sm-5 mb-5">
        <h1>Get started</h1>
        <hr />
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
        <h1 class="mt-5">Practitioner information</h1>
        <hr />
        <h2>Practitioner</h2>
        <p>Please provide the necessary information about the practitioner.</p>
        <hr />
        <InputComponent
          id="prac-first-name"
          v-model="pracFirstName"
          label="First name"
          :maxlength="firstNameMaxLength"
          :required="true"
          class="mt-3"
          :input-style="mediumStyles"
          @blur="handleBlurField(v$.pracFirstName)"
        />
        <InputComponent
          id="prac-last-name"
          v-model="pracLastName"
          label="Last name"
          :maxlength="lastNameMaxLength"
          :required="true"
          class="mt-3"
          :input-style="mediumStyles"
          @blur="handleBlurField(v$.pracLastName)"
        />
        <PractitionerNumberInput
          id="prac-number"
          v-model="pracNumber"
          label="Practitioner number"
          cypress-id="pracNumber"
          class="mt-3"
          :input-style="extraSmallStyles"
          @blur="handleBlurField(v$.pracNumber)"
        />
        <!-- Using PractitionerNumberInput because payee number has the same format as a practitioner number -->
        <PractitionerNumberInput
          id="payee-number"
          v-model="payeeNumber"
          label="Payee number"
          cypress-id="payeeNumber"
          class="mt-3"
          :input-style="extraSmallStyles"
          @blur="handleBlurField(v$.pracNumber)"
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
// import { useFormStore } from "@/stores/formData";
import { PageContent, ContinueBar, InputComponent, PractitionerNumberInput } from "common-lib-vue";
import { extraSmallStyles, mediumStyles } from "@/constants/input-styles";
import { firstNameMaxLength, lastNameMaxLength } from "@/constants/html-validations.js";
import ProgressBar from "../components/ProgressBar.vue";
import { stepRoutes, routes } from "../router/index.js";
import pageStateService from "../services/page-state-service.js";
// const store = useFormStore();
</script>

<script>
export default {
  name: "GetStartedPage",
  components: {
    ProgressBar,
  },
  data() {
    return {
      documentsCategory: null,
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

  methods: {
    nextPage() {
      console.log("nextPage function called");
      // Navigate to next path.
      const toPath = routes.PATIENT_INFO.path;
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
    },
  },
};
</script>
