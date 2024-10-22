<template>
  <main>
    <ProgressBar
      :routes="stepRoutes"
      :current-path="$route.path"
    />
    <PageContent>
      <main class="container pt-3 pt-sm-5 mb-5">
        <h1>Documents upload</h1>
        <hr />
        <h2>Patient</h2>
        <p>
          The documents that need to be uploaded being solely to the following individual. If you
          need change the patient's information, please go to the previous step, where you can make
          the necessary changes.
        </p>
        <hr />
        <InputComponent
          id="patient-first-initial"
          v-model="patientFirstInitial"
          label="First initial"
          :disabled="true"
          class="mt-3"
          :input-style="smallStyles"
          @blur="handleBlurField(v$.patientFirstInitial)"
        />
        <InputComponent
          id="patient-last-name"
          v-model="patientLastName"
          label="Last name"
          :disabled="true"
          class="mt-3"
          :input-style="mediumStyles"
          @blur="handleBlurField(v$.patientLastName)"
        />
        <DateInput
          id="patient-birthdate"
          v-model="patientBirthdate"
          label="Patient birthdate"
          class-name="mt-3"
          :disabled="true"
          @blur="handleBlurField(v$.patientBirthdate)"
        />
        <InputComponent
          id="patient-phn"
          v-model="patientPhn"
          label="PHN (Personal Health Number)"
          :disabled="true"
          class="mt-3"
          :input-style="mediumStyles"
          @blur="handleBlurField(v$.patientPhn)"
        />
        <h2 class="mt-5">Upload tool</h2>
        <p>
          Select the type of documents to upload, ensuring all documents belong to the same claim or
          pre-authorization and PHN to avoid delays. You may upload the following types of
          documents:
        </p>
        <ul>
          <li>Operative Report</li>
          <li>Consultation Report</li>
          <li>Operation room record</li>
          <li>Delivery summary</li>
          <li>Pathology report</li>
          <li>Other</li>
        </ul>
        <p>Please comment on the documents to be uploaded if they are not in the previous list.</p>
        <hr />
        <div class="row">
          <div class="col-md-7">
            <FileUploader
              id="patient-support-documents"
              v-model="patientSupportDocuments"
            />
          </div>
          <div class="col-md-5">
            <div class="tip-container rounded p-3">
              <p class="title">Tip</p>
              <div>
                <p>Scan the document or take a photo of it.</p>
                <p>Make sure that it is:</p>
                <ul>
                  <li>The entire document, from corner to corner&nbsp;</li>
                  <li>Rotated correctly (not upside down or sideways)&nbsp;</li>
                  <li>In focus and easy to read&nbsp;</li>
                  <li>A JPG, PNG, GIF, BMP or PDF file&nbsp;</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <hr />
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
import { PageContent, ContinueBar, InputComponent, DateInput, FileUploader } from "common-lib-vue";
import { smallStyles, mediumStyles } from "@/constants/input-styles";
// const store = useFormStore();
import ProgressBar from "../components/ProgressBar.vue";
import { stepRoutes, routes } from "../router/index.js";
import pageStateService from "../services/page-state-service.js";
</script>

<script>
export default {
  components: {
    FileUploader,
  },
  methods: {
    nextPage() {
      console.log("nextPage function called");
      // Navigate to next path.
      const toPath = routes.REVIEW_PAGE.path;
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
    },
  },
};
</script>

<style scoped>
.tip-container {
  background: #f2f2f2;
}
.title {
  font-weight: bold;
}
</style>
