<template>
  <div class="m-0 row">
    <div class="row">
      <!-- Patient information -->
      <div class="col-6 card border-0">
        <div class="card-header fw-bold px-0 py-0">
          <div class="row">
            <div class="col-8">Patient information</div>
            <div
              v-if="showEditButtons"
              class="col-4 icon-align-right"
            >
              <a
                href="/ccup/auth-in-province-patient-info"
                class="link-icon"
                @click.prevent="Edit(routes.AUTH_IN_PROV_PATIENT_INFO.path)"
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
            <div class="col">
              <!-- Patient's first name -->
              <div class="row">
                <div class="col-6">
                  <span class="fs-5 fw-bold"> First name </span>
                </div>
                <div class="col-6 mb-3">
                  <span
                    class="fs-5"
                    data-cy="review-table-patient-first-name"
                  >
                    {{ patientInfo.patientFirstName }}
                  </span>
                </div>
              </div>
              <!-- Patient's last name -->
              <div class="row">
                <div class="col-6">
                  <span class="fs-5 fw-bold">Last name</span>
                </div>
                <div class="mb-3 col-6">
                  <span
                    class="fs-5"
                    data-cy="review-table-patient-last-name"
                  >
                    {{ patientInfo.patientLastName }}
                  </span>
                </div>
              </div>
              <!-- Patient's birthdate-->
              <div class="row">
                <div class="col-6">
                  <p class="mb-0 fs-5 fw-bold">Birthdate</p>
                </div>
                <div class="col-6">
                  <span
                    class="fs-5"
                    data-cy="review-table-patient-birthdate"
                    >{{ formatDate(patientInfo.patientBirthdate) }}
                  </span>
                </div>
              </div>
              <!-- Patient's PHN-->
              <div class="row">
                <div class="col-6">
                  <p class="mb-0 fs-5 fw-bold">PHN (Personal Health Number)</p>
                </div>
                <div class="col-6">
                  <span
                    class="fs-5"
                    data-cy="review-table-patient-phn"
                    >{{ patientInfo.patientPhn }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Practitioner information -->
      <div class="col-6 card border-0">
        <div class="card-header fw-bold px-0 py-0">
          <div class="row">
            <div class="col-8">Practitioner information</div>
            <div
              v-if="showEditButtons"
              class="col-4 icon-align-right"
            >
              <a
                href="/ccup/auth-in-province-practitioner-info"
                class="link-icon"
                @click.prevent="Edit(routes.AUTH_IN_PROV_PRACTITIONER_INFO.path)"
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
            <div class="col">
              <!-- Practitioner's first name -->
              <div class="row">
                <div class="col-6">
                  <span class="fs-5 fw-bold"> First name </span>
                </div>
                <div class="col-6 mb-3">
                  <span
                    class="fs-5"
                    data-cy="review-table-prac-first-name"
                  >
                    {{ practitionerInfo.pracFirstName }}
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
                    data-cy="review-table-prac-last-name"
                  >
                    {{ practitionerInfo.pracLastName }}
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
                    data-cy="review-table-prac-number"
                    >{{ practitionerInfo.pracNumber }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-3 row">
      <!-- Medical information -->
      <div class="col-12 card border-0">
        <div class="card-header fw-bold px-0 py-0">
          <div class="row">
            <div class="col-8">Medical information</div>
            <div
              v-if="showEditButtons"
              class="col-4 icon-align-right"
            >
              <a
                href="/ccup/auth-in-province-medical-info"
                class="link-icon"
                @click.prevent="Edit(routes.AUTH_IN_PROV_MEDICAL_INFO.path)"
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
            <div class="col">
              <!-- Proposed surgical procedure -->
              <div class="row">
                <div class="col-6">
                  <span class="fs-5 fw-bold"> Proposed surgical procedure </span>
                </div>
                <div class="col-6 mb-3">
                  <span
                    class="fs-5"
                    data-cy="review-table-medical-proposed-procedure"
                  >
                    {{ medicalInfo.proposedProcedure }}
                  </span>
                </div>
              </div>
              <!-- Fee item(s) -->
              <div class="row">
                <div class="col-6">
                  <span class="fs-5 fw-bold">Fee item(s)</span>
                </div>
                <div class="mb-3 col-6">
                  <span
                    class="fs-5"
                    data-cy="review-table-medical-fee-items"
                  >
                    {{ medicalInfo.feeItems }}
                  </span>
                </div>
              </div>
              <!-- Previous surgery -->
              <div class="row">
                <div class="col-6">
                  <p class="mb-0 fs-5 fw-bold">Previous surgery</p>
                </div>
                <div class="col-6">
                  <span
                    class="fs-5"
                    data-cy="review-table-medical-previous-surgery"
                    >{{ medicalInfo.previousSurgeryDate }}
                  </span>
                </div>
              </div>
              <!-- Trauma date -->
              <div class="row">
                <div class="col-6">
                  <p class="mb-0 fs-5 fw-bold">Trauma date</p>
                </div>
                <div class="col-6">
                  <span
                    class="fs-5"
                    data-cy="review-table-medical-trauma-date"
                    >{{ formatDate(medicalInfo.traumaDate) }}
                  </span>
                </div>
              </div>
              <!-- Consultation report document(s) -->
              <div class="row">
                <div class="col-6">
                  <p class="mb-0 fs-5 fw-bold">Consultation report document(s)</p>
                </div>
                <div class="col-6">
                  <span
                    class="fs-5"
                    data-cy="review-table-medical-consultation-report"
                    >{{ medicalInfo.consultationReport.length }}
                  </span>
                </div>
              </div>
              <!-- Description of medical condition(s) -->
              <div class="row">
                <div class="col-6">
                  <p class="mb-0 fs-5 fw-bold">Description of medical condition(s)</p>
                </div>
                <div class="col-6">
                  <span
                    class="fs-5"
                    data-cy="review-table-medical-description"
                    >{{ medicalInfo.description }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import pageStateService from "../services/page-state-service.js";
import { IconPencil } from "common-lib-vue";
import { routes } from "../router/index.js";
import { scrollTo } from "../helpers/scroll";
import { useAuthInProvinceStore } from "../stores/authInProvinceStore.js";
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
      store: useAuthInProvinceStore(),
      formFieldPatient: "patientInfo",
      formFieldPractitioner: "practitionerInfo",
      formFieldMedical: "medicalInfo",
      patientInfo: {
        patientFirstName: null,
        patientLastName: null,
        patientBirthdate: null,
        patientPhn: null,
      },
      practitionerInfo: {
        pracFirstName: null,
        pracLastName: null,
        pracNumber: null,
      },
      medicalInfo: {
        proposedProcedure: null,
        feeItems: null,
        previousSurgeryDate: null,
        traumaDate: null,
        consultationReport: [],
        description: null,
      },
    };
  },
  created() {
    // Patient Info
    this.patientInfo.patientFirstName =
      this.store.formFields[this.formFieldPatient]["patientFirstName"];
    this.patientInfo.patientLastName =
      this.store.formFields[this.formFieldPatient]["patientLastName"];
    this.patientInfo.patientBirthdate =
      this.store.formFields[this.formFieldPatient]["patientBirthdate"];
    this.patientInfo.patientPhn = this.store.formFields[this.formFieldPatient]["patientPhn"];

    // Practitioner Info
    this.practitionerInfo.pracFirstName =
      this.store.formFields[this.formFieldPractitioner]["pracFirstName"];
    this.practitionerInfo.pracLastName =
      this.store.formFields[this.formFieldPractitioner]["pracLastName"];
    this.pracFullName =
      this.practitionerInfo.pracFirstName != null && this.practitionerInfo.pracLastName != null
        ? this.practitionerInfo.pracFirstName + " " + this.practitionerInfo.pracLastName
        : "";
    this.practitionerInfo.pracNumber =
      this.store.formFields[this.formFieldPractitioner]["pracNumber"];

    // Medical Info
    this.medicalInfo.proposedProcedure =
      this.store.formFields[this.formFieldMedical]["proposedProcedure"];
    this.medicalInfo.feeItems = this.store.formFields[this.formFieldMedical]["feeItems"];
    this.medicalInfo.previousSurgeryDate =
      this.store.formFields[this.formFieldMedical]["previousSurgeryDate"];
    this.medicalInfo.traumaDate = this.store.formFields[this.formFieldMedical]["traumaDate"];
    this.medicalInfo.consultationReport =
      this.store.formFields[this.formFieldMedical]["consultationReport"];
    this.medicalInfo.description = this.store.formFields[this.formFieldMedical]["description"];
  },
  methods: {
    formatDate(value) {
      //if it's a date, format the date using toDateString()
      //if it's not a date, calling toDateString() will fail, so don't do that
      if (Object.prototype.toString.call(value) === "[object Date]") {
        return value.toDateString();
      } else {
        return value;
      }
    },
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
