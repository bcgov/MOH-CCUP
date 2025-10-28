<template>
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
        <li>Please submit documents for one Personal Health Number (PHN) at a time.</li>
        <li>
          If you are submitting documents in response to a request letter from Health Insurance BC
          (HIBC): for the quickest possible processing, include all requested documents in your
          submission.
        </li>
        <li>
          Ensure that each document is in one of the following formats: JPG, PNG, GIF, BMP, or PDF.
        </li>
        <li>
          Ensure that each file or image displays the entire document from corner to corner; is
          oriented correctly (not upside down or sideways); and is in focus and readable.
        </li>
      </ul>
      <p>
        If you have any questions or need assistance, please contact the HIBC practitioner claim
        support team. In Vancouver: (604) 456-6950 Elsewhere in B.C.: 1-866-456-6950
      </p>
      <h2 class="mt-5 mb-0">Upload portal options</h2>
      <hr class="mt-0" />
      <RadioComponent
        id="upload-portal-options"
        v-model="uploadPortalOptions"
        aria-labelledby="uploadPortalOptions"
        name="upload-portal-options"
        :required="true"
        :items="radioUploadPortalOptions"
        cypress-id="upload-portal-options"
        :model-value="uploadPortalOptions"
        @input="handleAPIValidationReset"
        @change="handleChangeField(v$.uploadPortalOptions, $event, formFieldParent, store)"
      />
      <div
        v-if="v$.uploadPortalOptions.$errors.length > 0"
        class="text-danger error"
        aria-live="assertive"
      >
        Select an upload portal option.
      </div>
    </main>
  </PageContent>
  <ContinueBar
    :button-label="'Continue'"
    :has-loader="isLoading"
    cypress-id="continue-bar"
    @continue="validatePage()"
  />
  <Teleport
    v-if="captchaStore.isShowConsentModal"
    to="#modal-target"
  >
    <ConsentModal @close="handleCloseConsentModal" />
  </Teleport>
</template>

<script setup>
import { PageContent, RadioComponent, ContinueBar } from "common-lib-vue";
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useCaptchaStore } from "@/stores/captchaStore";
import { handleChangeField } from "../helpers/handler.js";
import ConsentModal from "../components/ConsentModal.vue";
</script>

<script>
export default {
  name: "GetStartedInfo",
  components: {},
  data() {
    return {
      v$: useVuelidate(),
      captchaStore: useCaptchaStore(),
      isLoading: false,
      uploadPortalOptions: null,
    };
  },
  computed: {
    radioUploadPortalOptions() {
      return [
        {
          id: "upload-portal-pre-auth-and-claims",
          label: "Submission of documents to support pre-authorizations and claims",
          value: "pre-auth-and-claims",
        },
        {
          id: "upload-portal-over-age-claims",
          label: "Approval of over-age claims",
          value: "over-age-claims",
        },
        {
          id: "upload-portal-auth-in-prov",
          label: "Authorization in Province",
          value: "auth-in-prov",
        },
      ];
    },
  },
  validations() {
    return {
      uploadPortalOptions: {
        required,
      },
    };
  },
  methods: {
    validatePage() {
      this.v$.$validate();
    },
    handleCloseConsentModal(value) {
      this.captchaStore.isShowConsentModal = !value;
    },
  },
};
</script>
