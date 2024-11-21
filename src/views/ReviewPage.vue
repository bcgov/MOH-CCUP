<template>
  <main>
    <ProgressBar
      :routes="stepRoutes"
      :current-path="$route.path"
    />

    <PageContent>
      <main class="container mb-5">
        <h2 class="my-0">Review</h2>
        <hr class="mt-2" />
        <div class="m-0 row">
          <div class="col-sm-6">
            <div class="row h-50">
              <div class="card border-0">
                <div class="card-header fw-bold px-0 py-0">
                  <div class="row">
                    <div class="col-8">Practitioner information</div>
                    <div class="col-4 icon-align-right">
                      <a
                        href="/ccup/practitioner-info"
                        class="link-icon"
                        @click.prevent="Edit(routes.PRACTITIONER_INFO.path)"
                      >
                        edit&nbsp;&nbsp;<IconPencil
                          class="icon-style"
                          color="#1a5a96"
                      /></a>
                    </div>
                  </div>
                </div>
                <div class="card-body bg-gray">
                  <div class="row row-details">
                    <div class="col-6">
                      <span class="fs-5 fw-bold">First name</span>
                    </div>
                    <div class="col-6 mb-3">
                      <span class="fs-5">{{ practitioner.firstName }}</span>
                    </div>
                  </div>
                  <div class="row row-details">
                    <div class="col-6">
                      <span class="fs-5 fw-bold">Last name</span>
                    </div>
                    <div class="mb-3 col-6">
                      <span class="fs-5">{{ practitioner.lastName }}</span>
                    </div>
                  </div>
                  <div class="mb-0 row">
                    <div class="col-6">
                      <p class="mb-0 fs-5 fw-bold">Practitioner number</p>
                    </div>
                    <div class="col-6">
                      <span class="fs-5">{{ practitioner.number }}</span>
                    </div>
                  </div>
                  <div class="row row-details">
                    <div class="col-6">
                      <span class="fs-5 fw-bold">Payee number</span>
                    </div>
                    <div class="col-6">
                      <span class="fs-5">{{ practitioner.payeeNumber }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="py-3 row pb-0 h-50">
              <div class="card border-0">
                <div class="card-header fw-bold px-0 py-0">
                  <div class="row">
                    <div class="col-8">Documents upload</div>
                    <div class="col-4 icon-align-right">
                      <a
                        href="javascript:void(0)"
                        class="link-icon"
                        @click.prevent="Edit(routes.UPLOAD_DOCUMENTS.path)"
                        >edit&nbsp;&nbsp;<IconPencil
                          class="icon-style"
                          color="#1a5a96"
                      /></a>
                    </div>
                  </div>
                </div>
                <div class="card-body bg-gray">
                  <div>
                    <div class="row">
                      <div class="col-6">
                        <span class="fs-5 fw-bold">Document uploaded</span>
                      </div>
                      <div class="col-6">
                        <span class="fs-5">1</span>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-6">
                        <span class="fs-5 fw-bold">Note</span>
                      </div>
                      <div class="col-6 col-6 fs-5">
                        <p>
                          {{ upload.note }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-sm-6">
            <div class="card border-0">
              <div class="card-header fw-bold px-0 py-0">
                <div class="row">
                  <div class="col-8">Patient information</div>
                  <div class="col-4 icon-align-right">
                    <a
                      href="javascript:void(0)"
                      class="link-icon"
                      @click.prevent="Edit(routes.PATIENT_INFO.path)"
                      >edit&nbsp;&nbsp;<IconPencil
                        class="icon-style"
                        color="#1a5a96"
                    /></a>
                  </div>
                </div>
              </div>
              <div class="card-body bg-gray">
                <div class="row">
                  <h5 class="row-title">Document Type</h5>

                  <div class="row h-100">
                    <div class="col-6 pt-2">
                      <span class="px-2 fs-5 fw-bold">Document</span>
                    </div>
                    <div class="col-6">
                      <RadioComponent
                        id="documents-category"
                        v-model="documentsCategory"
                        class="fs-5"
                        aria-labelledby="documentsCategory"
                        name="documents-category"
                        :required="true"
                        :items="radioOptionsDocumentsCategory"
                        cypress-id="documents-category"
                        :disabled="true"
                        :model-value="patient.documentsCategory"
                      />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <h5 class="row-title">Adjudicator</h5>
                  <div class="row row-details">
                    <div class="col-6">
                      <span class="fs-5 px-2 fw-bold">First name</span>
                    </div>
                    <div class="col-6">
                      <span class="fs-5">{{ patient.adjudicator.adjFirstName }}</span>
                    </div>
                  </div>
                  <div class="row row-details">
                    <div class="col-6">
                      <span class="fs-5 px-2 fw-bold">Last name</span>
                    </div>
                    <div class="col-6">
                      <span class="fs-5">{{ patient.adjudicator.adjLastName }}</span>
                    </div>
                  </div>
                </div>
                <div class="row mt-3 mb-3">
                  <h5 class="row-title">Patient</h5>
                  <div class="row row-details">
                    <div class="col-6">
                      <span class="fs-5 px-2 fw-bold">First initial</span>
                    </div>
                    <div class="col-6">
                      <span class="fs-5">{{ patient.firstInitial }}</span>
                    </div>
                  </div>
                  <div class="row row-details">
                    <div class="col-6">
                      <span class="fs-5 px-2 fw-bold">Last name</span>
                    </div>
                    <div class="col-6">
                      <span class="fs-5">{{ patient.lastName }}</span>
                    </div>
                  </div>
                  <div class="row row-details">
                    <div class="col-6">
                      <span class="fs-5 px-2 fw-bold">Birthdate</span>
                    </div>
                    <div class="col-6">
                      <span class="fs-5">{{ patient.birthdate }}</span>
                      <!-- <span class="fs-5">February 23, 1985</span> -->
                    </div>
                  </div>
                  <div class="row row-details">
                    <div class="col-6">
                      <p class="fs-5 px-2 fw-bold">PHN (Personal Health Number)</p>
                    </div>
                    <div class="col-6">
                      <span class="fs-5">{{ patient.phn }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-5 row">
          <h2 class="my-0">Declaration of accuracy and validity</h2>
          <hr class="mt-2" />
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
        </div>
        <div class="row px-3 fs-5">
          <CheckboxComponent
            id="pratitioner-declaration-accuracy"
            v-model="review.isDeclarationAccuracy"
            :label="pracFullName"
            @change="handleCheckBoxChange"
          />
        </div>
      </main>
    </PageContent>
  </main>
  <ContinueBar
    :button-label="'Submit'"
    cypress-id="continue-bar"
    @continue="nextPage()"
  />
</template>
<script setup>
// import { smallStyles, mediumStyles } from "@/constants/input-styles";
import { useFormStore } from "@/stores/formData";
import {
  PageContent,
  ContinueBar,
  RadioComponent,
  CheckboxComponent,
  IconPencil,
} from "common-lib-vue";
import { stepRoutes, routes } from "../router/index.js";
import ProgressBar from "../components/ProgressBar.vue";
import pageStateService from "../services/page-state-service.js";
import { formatDateDisplay } from "../helpers/date.js";
</script>

<script>
export default {
  data() {
    return {
      store: useFormStore(),
      formFieldPractitioner: "practitioner",
      formFieldPatient: "patient",

      practitioner: {
        firstName: null,
        lastName: null,
        number: null,
        payeeNumber: null,
      },
      patient: {
        documentsCategory: null,
        birthdate: null,
        firstInitial: null,
        lastName: null,
        phn: null,
        adjudicator: {
          adjFirstName: null,
          adjLastName: null,
        },
      },
      upload: {
        note: null,
      },
      review: {
        isDeclarationAccuracy: null,
      },
    };
  },
  computed: {
    pageTitle: function () {
      return this.$route.title;
    },
    radioOptionsDocumentsCategory() {
      return [
        {
          id: "documents-category-claim",
          label: "Claims document(s)",
          value: "claims",
        },
        {
          id: "documents-category-pre-auth",
          label: "Pre-authorization document(S)",
          value: "pre-auth",
        },
      ];
    },
  },
  created() {
    //practitioner details
    this.practitioner.firstName =
      this.store.formFields[this.formFieldPractitioner]["pracFirstName"];
    this.practitioner.lastName = this.store.formFields[this.formFieldPractitioner]["pracLastName"];

    this.pracFullName =
      this.practitioner.firstName != null && this.practitioner.lastName != null
        ? this.practitioner.firstName + " " + this.practitioner.lastName
        : "";

    this.practitioner.number = this.store.formFields[this.formFieldPractitioner]["pracNumber"];
    this.practitioner.payeeNumber =
      this.store.formFields[this.formFieldPractitioner]["payeeNumber"];

    // patient details
    this.patient.documentsCategory =
      this.store.formFields[this.formFieldPatient]["documentsCategory"];
    this.patient.lastName = this.store.formFields[this.formFieldPatient]["patientLastName"];
    this.patient.firstInitial = this.store.formFields[this.formFieldPatient]["patientFirstInitial"];
    this.patient.birthdate = this.store.formFields[this.formFieldPatient]["patientBirthdate"];
    this.patient.phn = this.store.formFields[this.formFieldPatient]["patientPhn"];
    this.patient.birthdate = formatDateDisplay(
      this.store.formFields[this.formFieldPatient]["patientBirthdate"]
    );

    // adjudicator details
    this.patient.adjudicator.adjFirstName =
      this.store.formFields[this.formFieldPatient]["adjFirstName"];
    this.patient.adjudicator.adjLastName =
      this.store.formFields[this.formFieldPatient]["adjLastName"];

    this.upload.note = this.store.formFields["upload"]["uploadNote"];

    //revireview.isDeclarationAccuracyew
    this.review.isDeclarationAccuracy = this.store.formFields["review"]["isDeclarationAccuracy"];
  },

  methods: {
    nextPage() {
      // Navigate to next path.
      const toPath = routes.SUBMISSION_PAGE.path;
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
    },
    handleCheckBoxChange(e) {
      this.store.updateFormField("review", "isDeclarationAccuracy", e.target.checked);
    },
    Edit(toPath) {
      //Navigate to path.
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
    },
  },
};
</script>

<style>
.icon-style {
  width: 16px;
}
.row-details {
  height: 30px;
  padding-bottom: 0.5rem !important;
}
.row-title {
  margin-bottom: 9px;
}

div.card-body.bg-gray {
  background-color: #f4f4f4;
}

div.card-header {
  background-color: white;
  border-color: #d9d9d9;
  border-width: 3px;
}

hr {
  background-color: #313132;
}

.icon-align-right {
  display: flex;
  justify-content: flex-end;
}

a.link-icon {
  text-decoration: none;
}
</style>
