<template>
  <main>
    <PageContent>
      <main class="container pt-3 pt-sm-5 mb-5">
        <div class="mb-0 row align-items-end">
          <div class="col-9">
            <h1 class="mb-0">Confirmation of submission</h1>
          </div>
          <PrintPage class="print-page mb-0" />
        </div>
        <hr class="mt-0" />
        <p class="heading">Date submitted: {{ submitDate }}</p>
        <ValidationMessage class="mb-5">
          Your Claims / Pre-authorization documents have been received.<br />Reference number is:
          {{ store.formFields.review.referenceNumber }}
        </ValidationMessage>

        <h2 class="mb-0">Next steps</h2>
        <hr class="mt-0" />
        <p class="heading">
          <a
            href="javascript:void(0)"
            @click="printPage()"
          >
            Print or save
          </a>
          this page for your records.
        </p>
        <!-- make print or save sentence bold-->
        <p>
          Your documents will be added to your claim/pre-authorization file so the adjudicator can
          complete the request and continue processing. Please allow two to three weeks for your
          request to be completed.
        </p>
        <p class="heading">Upload documents for another patient.</p>
        <p>
          Using the current practitioner information, you can upload documents for a different
          patient by clicking on the following link:

          <a
            data-cy="UploadNewPatient"
            href="/ccup/patient-info"
            @click.prevent="nextPage()"
          >
            Upload documents for a new patient.
          </a>
          Please note that the practitioner information cannot be changed, and you will begin the
          process from Step 2 (Patient information).
        </p>
        <p class="heading">Important.</p>
        <p>
          If you are not adding another patient after printing or saving this page, please close the
          browser page.
        </p>
        <h2 class="mt-5 mb-0">Claim / Pre-authorization information</h2>
        <hr class="mt-0" />
        <ReviewTable :show-edit-buttons="false" />
        <h2 class="mt-5 mb-0">Declaration of accuracy and validity</h2>
        <hr class="mt-0" />
        <p>
          {{ declarationAccuracy }}
        </p>
        <p>
          {{ declarationValidity }}
        </p>
        <CheckboxComponent
          id="pratitioner-declaration-accuracy"
          v-model="review.isDeclarationAccuracy"
          :label="pracFullName"
          :disabled="true"
        />
      </main>
    </PageContent>
  </main>
</template>

<script setup>
import { PageContent, CheckboxComponent, ValidationMessage, PrintPage } from "common-lib-vue";
import ReviewTable from "../components/ReviewTable.vue";
import { formatDateDisplay } from "../helpers/date.js";
import pageStateService from "../services/page-state-service.js";
import logService from "@/services/log-service.js";
import { routes } from "../router/index.js";
import { useFormStore } from "@/stores/formData";
// import { smallStyles, mediumStyles } from "@/constants/input-styles";
import beforeRouteLeaveHandler from "@/helpers/beforeRouteLeaveHandler.js";
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
      documentsCategory: null,
      isDeclarationAccuracy: null,
      pracFullName: null,
      practitioner: {
        firstName: null,
        lastName: null,
      },
      review: {
        isDeclarationAccuracy: null,
      },
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
    submitDate() {
      return formatDateDisplay(new Date());
    },
  },
  created() {
    this.review.isDeclarationAccuracy = this.store.formFields["review"]["isDeclarationAccuracy"];
    this.practitioner.firstName = this.store.formFields.practitioner.pracFirstName;
    this.practitioner.lastName = this.store.formFields.practitioner.pracLastName;

    this.pracFullName =
      this.practitioner.firstName != null && this.practitioner.lastName != null
        ? this.practitioner.firstName + " " + this.practitioner.lastName
        : "";
    logService.logNavigation(
      this.store.captcha.applicationUuid,
      routes.UPLOAD_DOCUMENTS.path,
      routes.UPLOAD_DOCUMENTS.title
    );
  },

  methods: {
    nextPage() {
      // Navigate to next path.
      this.store.clearPatient();
      pageStateService.setPageUnvisited(routes.UPLOAD_DOCUMENTS.path);
      pageStateService.setPageUnvisited(routes.REVIEW_PAGE.path);
      pageStateService.setPageUnvisited(routes.SUBMISSION_PAGE.path);
      pageStateService.setPageIncomplete(routes.UPLOAD_DOCUMENTS.path);
      pageStateService.setPageIncomplete(routes.REVIEW_PAGE.path);
      pageStateService.setPageIncomplete(routes.SUBMISSION_PAGE.path);
      const toPath = routes.PATIENT_INFO.path;
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
    },
    printPage() {
      window.print();
    },
  },
};
</script>

<style>
.heading {
  font-weight: bold;
}
</style>
