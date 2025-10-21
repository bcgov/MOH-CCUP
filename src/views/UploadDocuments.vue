<template>
  <ProgressBar
    :routes="stepRoutes"
    :current-path="$route.path"
  />
  <PageContent>
    <main class="container pt-3 pt-sm-5 mb-5">
      <h1 class="mb-0">Documents upload</h1>
      <hr class="mt-0" />
      <h2>Patient</h2>
      <p class="mb-0">
        The documents that need to be uploaded being solely to the following individual. If you need
        change the patient's information, please go to the previous step, where you can make the
        necessary changes.
      </p>
      <hr class="mt-0" />
      <InputComponent
        id="patient-first-initial"
        v-model="patientFirstInitial"
        cypress-id="patientFirstInitial"
        label="First initial"
        :disabled="true"
        class="mt-3"
        :input-style="extraSmallStyles"
      />
      <InputComponent
        id="patient-last-name"
        v-model="patientLastName"
        cypress-id="patientLastName"
        label="Last name"
        :disabled="true"
        class="mt-3"
        :input-style="mediumStyles"
      />
      <DateInput
        id="patient-birthdate"
        v-model="patientBirthdate"
        cypress-id="patientBirthdate"
        label="Patient birthdate"
        class-name="mt-3"
        :disabled="true"
      />
      <InputComponent
        id="patient-phn"
        v-model="patientPhn"
        cypress-id="patientPhn"
        label="PHN (Personal Health Number)"
        :disabled="true"
        class="mt-3"
        :input-style="smallStyles"
      />
      <h2 class="mt-5">Upload tool</h2>
      <p>
        Select the type of documents to upload, ensuring all documents belong to the same claim or
        pre-authorization and PHN to avoid delays. You may upload the following types of documents:
      </p>
      <ul>
        <li>Operative Report</li>
        <li>Consultation Report</li>
        <li>Operation room record</li>
        <li>Delivery summary</li>
        <li>Pathology report</li>
        <li>Photos</li>
      </ul>
      <p class="mb-0">
        If your documents are not listed above, or if additional information is needed to support
        your claim or pre-authorization, please provide comments below.
      </p>
      <hr class="mt-0" />
      <div class="row">
        <div class="col-md-7">
          <FileUploader
            id="patient-support-documents"
            v-model="patientSupportDocuments"
            @input="handleChangeFile"
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
          class="text-danger error"
          aria-live="assertive"
        >
          At least 1 supporting document is required.
        </div>
      </div>
      <InputComponent
        id="upload-note"
        v-model="uploadNote"
        cypress-id="uploadNote"
        label="Comments (optional)"
        class="mt-3"
        :input-style="extraLargeStyles"
        @blur="handleBlurField"
      />
    </main>
  </PageContent>
  <ContinueBar
    :button-label="'Continue'"
    cypress-id="continue-bar"
    @continue="nextPage()"
  />
</template>

<script setup>
import { useCaptchaStore } from "@/stores/captchaStore";
import { useDocSubmissionStore } from "@/stores/docSubmissionStore";
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
import logService from "@/services/log-service.js";
import { scrollTo, scrollToError } from "../helpers/scroll";
import beforeRouteLeaveHandler from "@/helpers/beforeRouteLeaveHandler.js";
</script>

<script>
export default {
  components: {
    FileUploader,
  },
  beforeRouteLeave(to, from, next) {
    beforeRouteLeaveHandler(to, from, next);
  },
  data() {
    return {
      captchaStore: useCaptchaStore(),
      store: useDocSubmissionStore(),
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
    logService.logNavigation(
      this.captchaStore.applicationUuid,
      routes.PATIENT_INFO.path,
      routes.PATIENT_INFO.title
    );
  },
  methods: {
    nextPage() {
      if (!this.patientSupportDocuments || this.patientSupportDocuments.length == 0) {
        // show error message
        this.issupportDocumentsRequired = true;
        scrollToError();
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
        scrollTo(0);
      }
    },
    handleChangeFile() {
      this.issupportDocumentsRequired = false;
    },
    handleBlurField(event) {
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
