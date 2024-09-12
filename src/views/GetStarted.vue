<template>
  <main>
    <PageContent>
      <main>
        <h1>Welcome to the Practitioner Upload Tool!</h1>
        <p>
          Our e-form simplifies the process of submitting essential documents for your
          Pre-authorizations or Claims. To ensure efficient processing, please select whether the
          documents pertain to a claim or a pre-authorization.
        </p>
        <p>
          Please note that information will be submitted for one individual's personal health number
          (PHN) at a time. Unless specified as optional, all fields in the form are mandatory.
        </p>
        <p>
          When uploading documents, ensure they are in one of the following formats: JPG, PNG, GIF,
          BMP, or PDF. For optimal processing, please include the entire document, from corner to
          corner, rotated correctly (not upside down or sideways), in focus, and easy to read.
        </p>
        <p>
          Thank you for using the Practitioner Upload Tool to streamline your document submissions.
          If you have any questions or need assistance, please don't hesitate to contact our support
          team.
        </p>
        <h1>Documents to be uploaded</h1>
        <p>
          Could you please specify what type of documents need to be uploaded by indicating which
          category they belong to? Once you select a category and start providing the needed
          information for your upload, the category cannot be changed; make sure you select the
          right category for your document upload.
        </p>
        <RadioComponent
          id="documents-category"
          v-model="documentsCategory"
          :label="'Documents category'"
          aria-labelledby="documentsCategory"
          name="documents-category"
          :required="true"
          :items="radioOptionsDocumentsCategory"
          cypress-id="documents-category"
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
import { PageContent, ContinueBar, RadioComponent } from "common-lib-vue";
// const store = useFormStore();
</script>

<script>
export default {
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
    },
  },
};
</script>
