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
          :input-style="extraSmallStyles"
        />
        <InputComponent
          id="patient-last-name"
          v-model="patientLastName"
          label="Last name"
          :disabled="true"
          class="mt-3"
          :input-style="mediumStyles"
        />
        <DateInput
          id="patient-birthdate"
          v-model="patientBirthdate"
          label="Patient birthdate"
          class-name="mt-3"
          :disabled="true"
        />
        <InputComponent
          id="patient-phn"
          v-model="patientPhn"
          label="PHN (Personal Health Number)"
          :disabled="true"
          class="mt-3"
          :input-style="smallStyles"
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
              @change="handleChangeFile"
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
        <div class="row">
          <div
            v-if="issupportDocumentsRequired"
            class="text-danger"
            aria-live="assertive"
          >
            At least 1 supporting document is required.
          </div>
        </div>
        <InputComponent
          id="upload-note"
          v-model="uploadNote"
          label="Note (optional)"
          class="mt-3"
          :input-style="extraLargeStyles"
          @blur="handleBlurField"
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
import { useFormStore } from "@/stores/formData";
import { PageContent, ContinueBar, InputComponent, DateInput, FileUploader } from "common-lib-vue";
import {
  extraSmallStyles,
  smallStyles,
  mediumStyles,
  extraLargeStyles,
} from "@/constants/input-styles";
import ProgressBar from "../components/ProgressBar.vue";
import { stepRoutes, routes } from "../router/index.js";
import pageStateService from "../services/page-state-service.js";
// const store = useFormStore();
</script>

<script>
export default {
  components: {
    FileUploader,
  },
  data() {
    return {
      store: useFormStore(),
      formFieldPatient: "patient",
      issupportDocumentsRequired: false,
      formFieldUpload: "upload",
      patientSupportDocuments: [],
      patientBirthdate: null,
      patientFirstInitial: null,
      patientLastName: null,
      patientPhn: null,
      uploadNote: null,
    };
  },
  created() {
    this.patientFirstInitial = this.store.formFields[this.formFieldPatient]["patientFirstInitial"];
    this.patientLastName = this.store.formFields[this.formFieldPatient]["patientLastName"];
    this.patientBirthdate = this.store.formFields[this.formFieldPatient]["patientBirthdate"];
    this.patientPhn = this.store.formFields[this.formFieldPatient]["patientPhn"];
    this.uploadNote = this.store.formFields[this.formFieldUpload]["uploadNote"];
    this.patientSupportDocuments =
      this.store.formFields[this.formFieldUpload]["patientSupportDocuments"];
  },
  methods: {
    nextPage() {
      if (this.patientSupportDocuments.length == 0) {
        // show error message
        this.issupportDocumentsRequired = true;
      } else {
        this.store.updateFormField(
          "upload",
          "patientSupportDocuments",
          this.patientSupportDocuments
        );

        // Navigate to next path.
        const toPath = routes.REVIEW_PAGE.path;
        pageStateService.setPageComplete(toPath);
        pageStateService.visitPage(toPath);
        this.$router.push(toPath);
      }
    },
    handleChangeFile() {
      this.issupportDocumentsRequired = false;
    },
    handleBlurField(event) {
      // update pinia store
      this.store.updateFormField("upload", "uploadNote", event.target.value);
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
