<template>
  <main>
    <PageContent>
      <main class="container pt-3 pt-sm-5 mb-5">
        <h1>Confirmation of submission</h1>
        <p>Date submitted: {insert date here} {insert print page button here}</p>
        <!-- make date submitted bold-->

        <h2>Next steps</h2>
        <hr />
        <p>Print or save this page for your records.</p>
        <!-- make print or save sentence bold-->
        <p>
          Your documents will be added to your claim/pre-authorization file so the adjudicator can
          complete the request and continue processing. Please allow two to three weeks for your
          request to be completed.
        </p>
        <h2>Claim / Pre-authorization information</h2>
        <hr />
        (insert tables here)
        <h2>Declaration of accuracy and validity</h2>
        <hr />
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
          id="patient-name"
          v-model="patientName"
          :label="'{insert firstname/lastname here}'"
          :disabled="true"
          @blur="handleBlurField(v$.isAuthorizedFPCAH)"
        />
      </main>
    </PageContent>
  </main>
</template>

<script setup>
// import { useFormStore } from "@/stores/formData";
import { PageContent, CheckboxComponent } from "common-lib-vue";
// const store = useFormStore();
// import { smallStyles, mediumStyles } from "@/constants/input-styles";
</script>

<script>
export default {
  data() {
    return {
      documentsCategory: null,
      patientName: null,
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

  methods: {},
};
</script>
