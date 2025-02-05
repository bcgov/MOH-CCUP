<template>
  <div class="m-0 row">
    <div class="col-md-6">
      <!-- Practitioner information -->
      <div class="row">
        <div class="card border-0">
          <div class="card-header fw-bold px-0 py-0">
            <div class="row">
              <div class="col-8">Practitioner information</div>
              <div
                v-if="showEditButtons"
                class="col-4 icon-align-right"
              >
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
            <div class="row">
              <div class="col-6">
                <span class="fs-5 fw-bold"> First name </span>
              </div>
              <div class="col-6 mb-3">
                <span
                  class="fs-5"
                  data-cy="reviewTablePracFirstName"
                >
                  {{ practitioner.firstName }}
                </span>
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <span class="fs-5 fw-bold">Last name</span>
              </div>
              <div class="mb-3 col-6">
                <span
                  class="fs-5"
                  data-cy="reviewTablePracLastName"
                >
                  {{ practitioner.lastName }}
                </span>
              </div>
            </div>
            <div class="mb-0 row">
              <div class="col-6">
                <p class="mb-0 fs-5 fw-bold">Practitioner number</p>
              </div>
              <div class="col-6">
                <span
                  class="fs-5"
                  data-cy="reviewTablePracNumber"
                  >{{ practitioner.number }}
                </span>
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <span class="fs-5 fw-bold">Payee number</span>
              </div>
              <div class="col-6">
                <span
                  class="fs-5"
                  data-cy="reviewTablePayeeNumber"
                  >{{ practitioner.payeeNumber }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Documents upload -->
      <div class="py-3 row pb-0">
        <div class="card border-0">
          <div class="card-header fw-bold px-0 py-0">
            <div class="row">
              <div class="col-8">Documents upload</div>
              <div
                v-if="showEditButtons"
                class="col-4 icon-align-right"
              >
                <a
                  href="javascript:void(0)"
                  class="link-icon"
                  @click.prevent="Edit(routes.UPLOAD_DOCUMENTS.path)"
                >
                  edit&nbsp;&nbsp;<IconPencil
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
                  <span
                    class="fs-5"
                    data-cy="reviewTablePatientSupportDocuments"
                  >
                    {{ upload.patientSupportDocuments }}
                  </span>
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  <span class="fs-5 fw-bold">Note</span>
                </div>
                <div
                  class="col-6 fs-5"
                  data-cy="reviewTableUploadNote"
                >
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
    <!-- Patient information -->
    <div class="col-md-6">
      <div class="card border-0">
        <div class="card-header fw-bold px-0 py-0">
          <div class="row">
            <div class="col-8">Patient information</div>
            <div
              v-if="showEditButtons"
              class="col-4 icon-align-right"
            >
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
            <p class="row-title fs-5 fw-bold">Document Type</p>

            <div class="row">
              <div class="col-6 pt-2">
                <span class="px-2 fs-5 fw-bold">Document</span>
              </div>
              <div class="col-6">
                <RadioComponent
                  id="documents-category"
                  v-model="patient.documentsCategory"
                  data-cy="reviewTableDocumentsCategory"
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
            <p class="row-title fs-5 fw-bold">Adjudicator</p>
            <div class="row">
              <div class="col-6">
                <span class="fs-5 px-2 fw-bold">First name </span>
              </div>
              <div class="col-6">
                <span
                  class="fs-5"
                  data-cy="reviewTableAdjFirstName"
                >
                  {{ patient.adjudicator.adjFirstName }}
                </span>
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <span class="fs-5 px-2 fw-bold">Last name</span>
              </div>
              <div class="col-6">
                <span
                  class="fs-5"
                  data-cy="reviewTableAdjLastName"
                  >{{ patient.adjudicator.adjLastName }}
                </span>
              </div>
            </div>
          </div>
          <div class="row mt-3 mb-3">
            <p class="row-title fs-5 fw-bold">Patient</p>
            <div class="row">
              <div class="col-6">
                <span class="fs-5 px-2 fw-bold">First initial</span>
              </div>
              <div class="col-6">
                <span
                  class="fs-5"
                  data-cy="reviewTablePatientFirstInitial"
                  >{{ patient.firstInitial }}
                </span>
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <span class="fs-5 px-2 fw-bold">Last name</span>
              </div>
              <div class="col-6">
                <span
                  class="fs-5"
                  data-cy="reviewTablePatientLastName"
                  >{{ patient.lastName }}
                </span>
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <span class="fs-5 px-2 fw-bold">Birthdate</span>
              </div>
              <div class="col-6">
                <span
                  class="fs-5"
                  data-cy="reviewTablePatientBirthdate"
                  >{{ patient.birthdate }}
                </span>
                <!-- <span class="fs-5">February 23, 1985</span> -->
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <p class="fs-5 px-2 fw-bold">PHN (Personal Health Number)</p>
              </div>
              <div class="col-6">
                <span
                  class="fs-5"
                  data-cy="reviewTablePatientPhn"
                  >{{ patient.phn }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFormStore } from "@/stores/formData";
import { formatDateDisplay } from "../helpers/date.js";
import pageStateService from "../services/page-state-service.js";
import { IconPencil, RadioComponent } from "common-lib-vue";
import { routes } from "../router/index.js";
import {
  scrollTo,
  // scrollToError,
  // getTopScrollPosition,
} from "../helpers/scroll";
</script>

<script>
export default {
  name: "ReviewTable",
  components: {},
  props: {
    showEditButtons: {
      type: Boolean,
      default: false,
    },
  },
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
    radioOptionsDocumentsCategory() {
      return [
        {
          id: "documents-category-claim",
          label: "Claims document(s)",
          value: "claims",
        },
        {
          id: "documents-category-pre-auth",
          label: "Pre-authorization document(s)",
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

    // upload
    this.upload.note = this.store.formFields["upload"]["uploadNote"];
    this.upload.patientSupportDocuments =
      this.store.formFields["upload"]["patientSupportDocuments"].length;

    //review
    this.review.isDeclarationAccuracy = this.store.formFields["review"]["isDeclarationAccuracy"];
  },
  methods: {
    Edit(toPath) {
      //Navigate to path.
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo(0);
    },
  },
};
</script>
