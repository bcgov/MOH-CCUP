<template>
  <PageContent>
    <main class="container pt-3 pt-sm-5 mb-5">
      <div class="mb-0 row align-items-end">
        <div class="col-9">
          <h1 class="mb-0">Confirmation of submission</h1>
        </div>
        <PrintPage class="print-page mb-0" />
      </div>
      <hr class="mt-0" />
      <p class="heading">Date submitted: {{ submitDate }}</p>
      <ValidationMessage class="mb-5">
        Your Pre-authorization of Payment documents have been received.<br />Reference number is:
        {{ store.formFields.review.referenceNumber }}
      </ValidationMessage>

      <h2 class="mb-0">Next steps</h2>
      <hr class="mt-0" />
      <p class="heading">
        <a
          href="javascript:void(0)"
          @click="printPage()"
        >
          Print or save
        </a>
        this page for your records.
      </p>
      <!-- make print or save sentence bold-->
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras blandit ante et augue ornare
        lacinia nec eget dolor. Cras gravida mi in accumsan luctus. Quisque at ex quis ligula
        euismod sagittis. Pellentesque ut felis vel nisl mollis faucibus. In placerat a ligula nec
        tincidunt. Aliquam in vestibulum erat. Suspendisse eget metus tempor, luctus ante tincidunt,
        posuere ipsum. Nullam eu mi in neque tempor convallis. Cras facilisis et quam non semper.
        Vivamus lectus purus, venenatis nec aliquam ac, viverra ut nulla. Phasellus nisl tortor,
        ultricies eget sapien eu, posuere gravida nunc. Duis sit amet scelerisque elit. Ut vitae
        euismod augue. Aenean condimentum, risus vitae porttitor pulvinar, odio lacus eleifend
        libero, vel blandit velit felis semper urna.
      </p>
      <p class="heading">Important.</p>
      <p>After printing or saving this page, please close the browser page.</p>
      <h2 class="mt-5 mb-0">Approval of over-age claims information</h2>
      <hr class="mt-0" />
      <AuthInProvReviewTable :show-edit-buttons="false" />
      <h2 class="mt-5 mb-0">Declaration of accuracy and validity</h2>
      <hr class="mt-0" />
      <p>
        {{ declarations.inProv.declarationAccuracy }}
      </p>
      <p>
        {{ declarations.inProv.declarationValidity }}
      </p>
      <CheckboxComponent
        id="pratitioner-declaration-accuracy"
        v-model="review.isDeclarationAccuracy"
        :label="pracFullName"
        :disabled="true"
      />
      <h2 class="mt-5 mb-0">When pre-authorization of payment has been granted</h2>
      <hr class="mt-0" />
      <ul>
        <li>
          Any pre-authorization granted is subject to the patient having coverage with the Medical
          Services Plan (MSP) at the time of surgery. MSP coverage can be verified by calling the
          Claims Coverage Enquiry Unit at 604 456-6950 (Vancouver) or 1 866 456-6950 (rest of BC).
        </li>
        <li>
          Please provide a copy of this form to the hospital when booking this surgery. This form
          may also serve as authorization for coverage of hospital charges when the patient is
          admitted to an acute care hospital as an inpatient or daycare patient when MSP has granted
          pre-authorization of payment.
        </li>
        <li>
          Any payment pre-authorization is limited to the fee item(s) indicated on this form. If any
          additional surgical procedures are undertaken at the same time, without pre-authorization
          from MSP, the patient should be advised that he/she is responsible for payment of any
          hospital services related to such a procedure.
        </li>
      </ul>
      <h2 class="mt-5 mb-0">When pre-authorization of payment has not been granted</h2>
      <hr class="mt-0" />
      <ul>
        <li>
          The information provided does not indicate sufficient medical necessity to enable us to
          grant authorization for the proposed surgery as an insured benefit of MSP. If you would
          like to request a review of this decision, write to the address below, being sure to
          provide any additional details that you feel may be pertinent to this case.
        </li>
        <li>
          Please be sure to advise your patient that if they proceed with this surgery without
          pre-authorization from MSP, they will be responsible for all costs including any costs for
          hospital services.
        </li>
      </ul>
    </main>
  </PageContent>
</template>

<script setup>
import { PageContent, CheckboxComponent, ValidationMessage, PrintPage } from "common-lib-vue";
import { formatDateDisplay } from "@/helpers/date.js";
import { useCaptchaStore } from "@/stores/captchaStore";
import { useAuthInProvinceStore } from "@/stores/authInProvinceStore";
import beforeRouteLeaveHandler from "@/helpers/beforeRouteLeaveHandler.js";
import AuthInProvReviewTable from "@/components/AuthInProvReviewTable.vue";
import { declarations } from "@/constants/declarations.js";
</script>

<script>
export default {
  beforeRouteLeave(to, from, next) {
    beforeRouteLeaveHandler(to, from, next);
  },
  data() {
    return {
      captchaStore: useCaptchaStore(),
      store: useAuthInProvinceStore(),
      formFieldPractitioner: "practitionerInfo",
      isDeclarationAccuracy: null,
      pracFullName: null,
      practitionerInfo: {
        pracFirstName: null,
        pracLastName: null,
      },
      review: {
        isDeclarationAccuracy: null,
      },
    };
  },

  computed: {
    submitDate() {
      return formatDateDisplay(new Date());
    },
  },
  created() {
    this.review.isDeclarationAccuracy = this.store.formFields["review"]["isDeclarationAccuracy"];
    this.practitionerInfo.pracFirstName =
      this.store.formFields[this.formFieldPractitioner]["pracFirstName"];
    this.practitionerInfo.pracLastName =
      this.store.formFields[this.formFieldPractitioner]["pracLastName"];
    this.pracFullName =
      this.practitionerInfo.pracFirstName != null && this.practitionerInfo.pracLastName != null
        ? this.practitionerInfo.pracFirstName + " " + this.practitionerInfo.pracLastName
        : "";

    // TODO: Add log service
  },

  methods: {
    nextPage() {
      // Reset captcha token so the database doesn't receive duplicate submission uuids
      this.captchaStore.resetCaptchaToken();

      // TODO: Add resetting all of the pages
    },
    printPage() {
      window.print();
    },
  },
};
</script>

<style>
.heading {
  font-weight: bold;
}
</style>
