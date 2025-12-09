<template>
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
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras blandit ante et augue ornare
        lacinia nec eget dolor. Cras gravida mi in accumsan luctus. Quisque at ex quis ligula
        euismod sagittis. Pellentesque ut felis vel nisl mollis faucibus. In placerat a ligula nec
        tincidunt. Aliquam in vestibulum erat. Suspendisse eget metus tempor, luctus ante tincidunt,
        posuere ipsum. Nullam eu mi in neque tempor convallis. Cras facilisis et quam non semper.
        Vivamus lectus purus, venenatis nec aliquam ac, viverra ut nulla. Phasellus nisl tortor,
        ultricies eget sapien eu, posuere gravida nunc. Duis sit amet scelerisque elit. Ut vitae
        euismod augue. Aenean condimentum, risus vitae porttitor pulvinar, odio lacus eleifend
        libero, vel blandit velit felis semper urna.
      </p>
      <p class="heading">Important.</p>
      <p>After printing or saving this page, please close the browser page.</p>
      <h2 class="mt-5 mb-0">Approval of over-age claims information</h2>
      <hr class="mt-0" />
      <OverAgeReviewTable :show-edit-buttons="false" />
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
</template>

<script setup>
import { PageContent, CheckboxComponent, ValidationMessage, PrintPage } from "common-lib-vue";
// import ReviewTable from "../components/ReviewTable.vue";
import { formatDateDisplay } from "@/helpers/date.js";
import pageStateService from "@/services/page-state-service.js";
import logService from "@/services/log-service.js";
import { routes } from "@/router/index.js";
import { useCaptchaStore } from "@/stores/captchaStore";
import { useDocSubmissionStore } from "@/stores/docSubmissionStore";
import beforeRouteLeaveHandler from "@/helpers/beforeRouteLeaveHandler.js";
import { declarationAccuracy, declarationValidity } from "@/constants/declarations.js";
import OverAgeReviewTable from "@/components/OverAgeReviewTable.vue";
</script>

<script>
export default {
  beforeRouteLeave(to, from, next) {
    beforeRouteLeaveHandler(to, from, next);
  },
  data() {
    return {
      captchaStore: useCaptchaStore(),
      store: useDocSubmissionStore(),
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
      this.captchaStore.applicationUuid,
      routes.UPLOAD_DOCUMENTS.path,
      routes.UPLOAD_DOCUMENTS.title
    );
  },

  methods: {
    nextPage() {
      // Clear patient data so it's ready for the next person
      this.store.clearPatient();
      // Reset captcha token so the database doesn't receive duplicate submission uuids
      this.captchaStore.resetCaptchaToken();

      // Reset page history so navigation happens correctly
      pageStateService.setPageUnvisited(routes.UPLOAD_DOCUMENTS.path);
      pageStateService.setPageUnvisited(routes.REVIEW_PAGE.path);
      pageStateService.setPageUnvisited(routes.SUBMISSION_PAGE.path);
      pageStateService.setPageIncomplete(routes.UPLOAD_DOCUMENTS.path);
      pageStateService.setPageIncomplete(routes.REVIEW_PAGE.path);
      pageStateService.setPageIncomplete(routes.SUBMISSION_PAGE.path);
      const toPath = routes.PATIENT_INFO.path;
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);

      // Navigate to next path.
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
