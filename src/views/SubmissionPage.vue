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
        <h3>Date submitted: {{ submitDate }}</h3>
        <ValidationMessage class="mb-5">
          Your Claims / Pre-authorization documents have been received.<br />Reference number is:
          {insert reference number here}
        </ValidationMessage>

        <h2 class="mb-0">Next steps</h2>
        <hr class="mt-0" />
        <h4>
          <a
            href="javascript:void(0)"
            @click="printPage()"
          >
            Print or save
          </a>
          this page for your records.
        </h4>
        <!-- make print or save sentence bold-->
        <p>
          Your documents will be added to your claim/pre-authorization file so the adjudicator can
          complete the request and continue processing. Please allow two to three weeks for your
          request to be completed.
        </p>
        <h4>Upload documents for another patient.</h4>
        <p>
          Using the current practitioner information, you can upload documents for a different
          patient by clicking on the following link:

          <a
            href="/ccup/patient-info"
            @click.prevent="nextPage()"
          >
            Upload documents for a new patient.
          </a>
          Please note that the practitioner information cannot be changed, and you will begin the
          process from Step 2 (Patient information).
        </p>
        <h4>Important.</h4>
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
          I hereby declare that the information provided through this web form is accurate,
          complete, and truthful to the best of my knowledge. I confirm that all information
          provided pertains to a single patient and is valid for a single claim or
          pre-authorization. I understand that any false, misleading, or omitted information may
          result in the rejection of my submission and could have legal consequences.
        </p>
        <p>
          By submitting this form, I affirm that I have personally completed all sections and that
          the information I have provided is a true and honest representation of the facts. I
          acknowledge that it is my responsibility to update any changes to this information
          promptly.
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
import { routes } from "../router/index.js";
import { useFormStore } from "@/stores/formData";
// const store = useFormStore();
// import { smallStyles, mediumStyles } from "@/constants/input-styles";
</script>

<script>
export default {
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
  },

  methods: {
    nextPage() {
      // Navigate to next path.
      this.store.clearPatient();
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
