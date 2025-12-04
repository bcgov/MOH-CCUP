<template>
  <div class="m-0 row">
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
                @click.prevent="Edit(routes.OVER_AGE_PRACTITIONER_PAGE.path)"
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
              <!-- Practitioner's first name -->
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
              <!-- Practitioner's last name -->
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
              <!-- Practitioner number -->
              <div class="row">
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
              <!-- Payee number -->
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
            <div class="col-6">
              <!-- Data center number -->
              <div class="row">
                <div class="col-6">
                  <span class="fs-5 fw-bold"> Data center number</span>
                </div>
                <div class="col-6 mb-3">
                  <span
                    class="fs-5"
                    data-cy="reviewTableDataCenterNumber"
                  >
                    {{ practitioner.dataCenterNumber }}
                  </span>
                </div>
              </div>
              <!-- Contact phone number -->
              <div class="row">
                <div class="col-6">
                  <span class="fs-5 fw-bold"> Contact phone number</span>
                </div>
                <div class="col-6 mb-3">
                  <span
                    class="fs-5"
                    data-cy="reviewTableContactPhoneNumber"
                  >
                    {{ practitioner.contactPhoneNumber }}
                  </span>
                </div>
              </div>
              <!-- Preferred contact method-->
              <div class="row">
                <div class="col-6">
                  <span class="fs-5 fw-bold"> Preferred contact method</span>
                </div>
                <div class="col-6 mb-3">
                  <span
                    class="fs-5"
                    data-cy="reviewTablePreferredContactMethod"
                  >
                    {{ practitioner.preferredContactMethod }}
                  </span>
                </div>
              </div>
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
            <div class="col-8">Claims information</div>
            <div
              v-if="showEditButtons"
              class="col-4 icon-align-right"
            >
              <a
                href="javascript:void(0)"
                class="link-icon"
                @click.prevent="Edit(routes.OVER_AGE_CLAIMS_INFO.path)"
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
            <!-- Claim type of date -->
            <div class="row">
              <div class="col-6">
                <span class="fs-5 fw-bold">Claims type of date</span>
              </div>
              <div class="col-6">
                <span
                  class="fs-5"
                  data-cy="reviewTableClaimsDateType"
                >
                  {{ claims.dateType }}
                </span>
              </div>
            </div>
            <!-- Approximate number of claims -->
            <div class="row">
              <div class="col-6">
                <span class="fs-5 fw-bold">Approximate number of claims</span>
              </div>
              <div class="col-6">
                <span
                  class="fs-5"
                  data-cy="reviewTablePatientSupportDocuments"
                >
                  {{ claims.approximateClaimNumber }}
                </span>
              </div>
            </div>
            <!-- Approximate dollar value of claims-->
            <div class="row">
              <div class="col-6">
                <span class="fs-5 fw-bold">Approximate dollar value of claims</span>
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
            <!-- Fee items involved -->
            <div class="row">
              <div class="col-6">
                <span class="fs-5 fw-bold">Fee items involved</span>
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
            <!-- Explanation for late submission -->
            <div class="row">
              <div class="col-6">
                <span class="fs-5 fw-bold">Explanation for late submission</span>
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
            <!-- Individuals for verification purposes -->
            <div class="row">
              <div class="col-6">
                <span class="fs-5 fw-bold">Individuals for verification purposes</span>
              </div>
            </div>
            <div
              v-for="index in storeIndividuals"
              :key="index"
              class="row"
            >
              <!-- Individual's PHN -->
              <div class="col-6">
                <span class="fs-5 fw-bold">PHN</span>
              </div>
              <div class="col-6">
                <span
                  class="fs-5"
                  :data-cy="'data-phn-' + index"
                >
                  {{ storeIndividuals[index].phn }}
                </span>
              </div>
              <!-- Individual's Service Date -->
              <div class="col-6">
                <span class="fs-5 fw-bold">Date of service</span>
              </div>
              <div class="col-6">
                <span
                  class="fs-5"
                  :data-cy="'data-phn-' + index"
                >
                  {{ storeIndividuals[index].individualServiceDate }}
                </span>
              </div>
              <!-- Individual's Fee Item -->
              <div class="col-6">
                <span class="fs-5 fw-bold">Fee item</span>
              </div>
              <div class="col-6">
                <span
                  class="fs-5"
                  :data-cy="'data-phn-' + index"
                >
                  {{ storeIndividuals[index].individualFeeItem }}
                </span>
              </div>
              <hr />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Documents Upload-->
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
</template>

<script setup>
import { useDocSubmissionStore } from "@/stores/docSubmissionStore";
import { formatDateDisplay } from "../helpers/date.js";
import pageStateService from "../services/page-state-service.js";
import { IconPencil } from "common-lib-vue";
import { routes } from "../router/index.js";
import { scrollTo } from "../helpers/scroll";
</script>

<script>
export default {
  name: "OverAgeReviewTable",
  components: {},
  props: {
    showEditButtons: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      store: useDocSubmissionStore(),
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
