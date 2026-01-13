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
                @click.prevent="Edit(routes.OVER_AGE_PRACTITIONER_PAGE.path, $event)"
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
                    data-cy="review-table-prac-first-name"
                  >
                    {{ practitioner.pracFirstName }}
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
                    {{ practitioner.pracLastName }}
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
                    >{{ practitioner.pracNumber }}
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
                    data-cy="review-table-payee-number"
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
                    data-cy="review-table-data-center-number"
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
                    data-cy="review-table-contact-phone-number"
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
                    data-cy="review-table-preferred-contact-method"
                  >
                    {{ practitioner.preferredContactMethod }}
                  </span>
                </div>
              </div>

              <!-- Fax number-->
              <div
                v-if="practitioner.preferredContactMethod === 'fax'"
                class="row"
              >
                <div class="col-6">
                  <span class="fs-5 fw-bold"> Fax number</span>
                </div>
                <div class="col-6 mb-3">
                  <span
                    class="fs-5"
                    data-cy="review-table-fax-number"
                  >
                    {{ practitioner.faxNumber }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Claims Info -->
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
                @click.prevent="Edit(routes.OVER_AGE_CLAIMS_INFO.path, $event)"
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
                  data-cy="review-table-date-type"
                >
                  {{ claimsInformation.dateType }}
                </span>
              </div>
            </div>

            <!-- Service date -->
            <div
              v-if="claimsInformation.dateType === 'date'"
              class="row"
            >
              <div class="col-6">
                <span class="fs-5 fw-bold">Date of service</span>
              </div>
              <div class="col-6">
                <span
                  class="fs-5"
                  data-cy="review-table-service-date"
                >
                  {{ formatDate(claimsInformation.claimServiceDate) }}
                </span>
              </div>
            </div>
            <!-- Service date -->
            <div
              v-if="claimsInformation.dateType === 'range'"
              class="row"
            >
              <div class="col-6">
                <span class="fs-5 fw-bold">Range of dates (from)</span>
              </div>
              <div class="col-6">
                <span
                  class="fs-5"
                  data-cy="review-table-claim-from-date"
                >
                  {{ formatDate(claimsInformation.claimFromDate) }}
                </span>
              </div>
            </div>
            <!-- Service date -->
            <div
              v-if="claimsInformation.dateType === 'range'"
              class="row"
            >
              <div class="col-6">
                <span class="fs-5 fw-bold">Range of dates (to)</span>
              </div>
              <div class="col-6">
                <span
                  class="fs-5"
                  data-cy="review-table-claim-to-date"
                >
                  {{ formatDate(claimsInformation.claimToDate) }}
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
                  data-cy="review-table-approximate-claim-number"
                >
                  {{ claimsInformation.approximateClaimNumber }}
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
                  data-cy="review-table-approximate-dollar-value"
                >
                  {{ claimsInformation.approximateDollarValue }}
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
                data-cy="review-table-fee-items"
              >
                <p>
                  {{ claimsInformation.feeItems }}
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
                data-cy="review-table-detailed-explanation"
              >
                <p>
                  {{ claimsInformation.detailedExplanation }}
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
              v-for="(individual, index) in claimsInformation.individuals"
              :key="index"
              class="row"
            >
              <!-- Individual's PHN -->
              <div class="col-6">
                <span class="fs-5 fw-bold ms-5">PHN</span>
              </div>
              <div class="col-6">
                <span
                  class="fs-5"
                  :data-cy="'individual-phn-' + index"
                >
                  {{ individual.phn }}
                </span>
              </div>
              <!-- Individual's Service Date -->
              <div class="col-6">
                <span class="fs-5 fw-bold ms-5">Date of service</span>
              </div>
              <div class="col-6">
                <span
                  class="fs-5"
                  :data-cy="'individual-service-date-' + index"
                >
                  {{ formatDate(individual.individualServiceDate) }}
                </span>
              </div>
              <!-- Individual's Fee Item -->
              <div class="col-6">
                <span class="fs-5 fw-bold ms-5">Fee item</span>
              </div>
              <div class="col-6">
                <span
                  class="fs-5"
                  :data-cy="'individual-fee-item-' + index"
                >
                  {{ individual.individualFeeItem }}
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
                id="claim-support-documents"
                href="javascript:void(0)"
                class="link-icon"
                @click.prevent="Edit(routes.OVER_AGE_CLAIMS_INFO.path, $event)"
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
                <span class="fs-5 fw-bold">Documents uploaded</span>
              </div>
              <div class="col-6">
                <span
                  class="fs-5"
                  data-cy="review-table-claim-support-documents"
                >
                  {{ claimsInformation.claimSupportDocuments.length }}
                </span>
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <span class="fs-5 fw-bold">Note</span>
              </div>
              <div
                class="col-6 fs-5"
                data-cy="review-table-claim-comment"
              >
                <p>
                  {{ claimsInformation.claimComment }}
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
import pageStateService from "../services/page-state-service.js";
import { IconPencil } from "common-lib-vue";
import { routes } from "../router/index.js";
import { scrollTo } from "../helpers/scroll";
import { useOverAgeClaimStore } from "../stores/overAgeClaimStore.js";
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
      store: useOverAgeClaimStore(),
      formFieldPractitioner: "practitioner",
      formFieldClaims: "claimsInformation",

      practitioner: {
        pracFirstName: null,
        pracLastName: null,
        pracNumber: null,
        payeeNumber: null,
        dataCenterNumber: null,
        contactPhoneNumber: null,
        preferredContactMethod: null,
        faxNumber: null,
      },
      claimsInformation: {
        dateType: null,
        claimServiceDate: null,
        claimFromDate: null,
        claimToDate: null,
        approximateClaimNumber: null,
        approximateDollarValue: null,
        feeItems: null,
        detailedExplanation: null,
        individuals: [
          {
            phn: null,
            individualServiceDate: null,
            individualFeeItem: null,
          },
        ],
        claimSupportDocuments: [],
        claimComment: null,
      },
    };
  },
  computed: {
    isPreferredContactMethodFax() {
      return this.preferredContactMethod == "fax" ? true : false;
    },
    radioOptionsPreferredContactMethod() {
      return [
        {
          id: "preferred-contact-method-fax",
          label: "Fax",
          value: "fax",
        },
        {
          id: "preferred-contact-method-mail",
          label: "Mail",
          value: "mail",
        },
      ];
    },
    radioOptionsDateType() {
      return [
        {
          id: "date-type-date",
          label: "Date of service",
          value: "date",
        },
        {
          id: "date-type-range",
          label: "Range of dates",
          value: "range",
        },
      ];
    },
  },
  created() {
    //practitioner details
    this.practitioner.pracFirstName =
      this.store.formFields[this.formFieldPractitioner]["pracFirstName"];
    this.practitioner.pracLastName =
      this.store.formFields[this.formFieldPractitioner]["pracLastName"];
    this.pracFullName =
      this.practitioner.firstName != null && this.practitioner.lastName != null
        ? this.practitioner.firstName + " " + this.practitioner.lastName
        : "";
    this.practitioner.pracNumber = this.store.formFields[this.formFieldPractitioner]["pracNumber"];
    this.practitioner.payeeNumber =
      this.store.formFields[this.formFieldPractitioner]["payeeNumber"];
    this.practitioner.dataCenterNumber =
      this.store.formFields[this.formFieldPractitioner]["dataCenterNumber"];
    this.practitioner.contactPhoneNumber =
      this.store.formFields[this.formFieldPractitioner]["contactPhoneNumber"];
    this.practitioner.preferredContactMethod =
      this.store.formFields[this.formFieldPractitioner]["preferredContactMethod"];
    this.practitioner.faxNumber = this.store.formFields[this.formFieldPractitioner]["faxNumber"];

    // claims info details
    this.claimsInformation.dateType = this.store.formFields[this.formFieldClaims]["dateType"];
    this.claimsInformation.claimServiceDate =
      this.store.formFields[this.formFieldClaims]["claimServiceDate"];
    this.claimsInformation.claimFromDate =
      this.store.formFields[this.formFieldClaims]["claimFromDate"];
    this.claimsInformation.claimToDate = this.store.formFields[this.formFieldClaims]["claimToDate"];
    this.claimsInformation.approximateClaimNumber =
      this.store.formFields[this.formFieldClaims]["approximateClaimNumber"];
    this.claimsInformation.approximateDollarValue =
      this.store.formFields[this.formFieldClaims]["approximateDollarValue"];
    this.claimsInformation.feeItems = this.store.formFields[this.formFieldClaims]["feeItems"];
    this.claimsInformation.detailedExplanation =
      this.store.formFields[this.formFieldClaims]["detailedExplanation"];
    this.claimsInformation.individuals = this.store.formFields[this.formFieldClaims]["individuals"];
    this.claimsInformation.claimSupportDocuments =
      this.store.formFields[this.formFieldClaims]["claimSupportDocuments"];
    this.claimsInformation.claimComment =
      this.store.formFields[this.formFieldClaims]["claimComment"];
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
    Edit(toPath, event) {
      //Navigate to path.
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      if (event.target.id === "claim-support-documents") {
        this.$nextTick(() => {
          const anchor = document.getElementById(event.target.id);
          anchor.scrollTo({
            top: anchor.scrollHeight,
            behavior: "smooth",
          });
        });
      } else {
        scrollTo(0);
      }
    },
  },
};
</script>
