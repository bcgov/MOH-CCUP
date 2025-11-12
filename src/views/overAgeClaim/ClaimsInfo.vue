<template>
  <PageContent>
    <main class="container pt-3 pt-sm-5 mb-5">
      <h1 class="mb-0">Claims information</h1>
      <hr class="mt-0" />
      <h2>Claims detail</h2>
      <p class="mb-0">Please provide the details of your claim.</p>
      <br />
      <ul>
        <li>
          If your claim is <span class="bold">less than 90 days old</span>, you can resubmit it
          using submission code <span class="bold">“R”.</span>
        </li>
        <li>
          If your claim is between <span class="bold">90 days and 18 months old,</span> you can use
          this form to <span class="bold">request approval for an over-age claim.</span>
        </li>
        <li>
          If your claim is <span class="bold">older than 18 months,</span> the submission window has
          expired and it <span class="bold">cannot be submitted.</span>
        </li>
      </ul>
      <RadioComponent
        id="date-type"
        v-model="dateType"
        class="mt-3"
        label="Select a type of date for your claim"
        aria-labelledby="dateType"
        name="date-type"
        :required="true"
        :items="radioOptionsDateType"
        cypress-id="date-type"
        :model-value="dateType"
        @input="handleAPIValidationReset"
        @change="handleChangeField(v$.dateType, $event, formFieldParent, store)"
      />

      <div
        v-if="v$.dateType.$dirty && v$.dateType.$invalid"
        class="text-danger error"
        aria-live="assertive"
      >
        <p>Date type is required.</p>
      </div>

      <div v-if="dateType == 'date'">
        <DateInput
          id="claim-service-date"
          v-model="claimServiceDate"
          label="Date of service"
          class="mt-3"
          :required="true"
          @input="handleChangeDate(v$.claimServiceDate, $event, formFieldParent, store)"
        />
      </div>

      <div
        v-if="v$.claimServiceDate.$dirty && v$.claimServiceDate.required.$invalid"
        class="text-danger error"
        aria-live="assertive"
      >
        <p>Date of service is required.</p>
      </div>

      <div v-if="dateType == 'range'">
        <DateInput
          id="claim-date-range-from"
          v-model="claimDateRangeFrom"
          label="From"
          class="mt-3"
          :required="true"
          @change="handleChangeDate(v$.claimDateRangeFrom, $event, formFieldParent, store)"
        />

        <div
          v-if="v$.claimDateRangeFrom.$dirty && v$.claimDateRangeFrom.required.$invalid"
          class="text-danger error"
          aria-live="assertive"
        >
          <p>This field is required.</p>
        </div>

        <DateInput
          id="claim-date-range-to"
          v-model="claimDateRangeTo"
          label="To"
          class="mt-3"
          :required="true"
          @change="handleChangeDate(v$.claimDateRangeTo, $event, formFieldParent, store)"
        />

        <div
          v-if="v$.claimDateRangeTo.$dirty && v$.claimDateRangeTo.required.$invalid"
          class="text-danger error"
          aria-live="assertive"
        >
          <p>This field is required.</p>
        </div>
      </div>

      <NumberInput
        id="approximate-claim-number"
        v-model="approximateClaimNumber"
        class="mt-3"
        maxlength="6"
        label="Approximate number of claims"
        aria-labelledby="approximateClaimNumber"
        name="approximate-claim-number"
        :required="true"
        cypress-id="approximate-claim-number"
        :input-style="smallStyles"
        @input="handleAPIValidationReset"
        @change="handleChangeField(v$.approximateClaimNumber, $event, formFieldParent, store)"
      />

      <div
        v-if="v$.approximateClaimNumber.$dirty && v$.approximateClaimNumber.$invalid"
        class="text-danger error"
        aria-live="assertive"
      >
        <p>Approximate number of claims is required.</p>
      </div>

      <CurrencyInput
        id="approximate-dollar-value"
        v-model="approximateDollarValue"
        class="mt-3"
        maxlength="6"
        label="Approximate dollar value of claims"
        aria-labelledby="approximateDollarValue"
        name="approximate-dollar-value"
        :required="true"
        cypress-id="approximate-dollar-value"
        :input-style="smallStyles"
        @input="handleAPIValidationReset"
        @change="handleChangeField(v$.approximateDollarValue, $event, formFieldParent, store)"
      />

      <div
        v-if="v$.approximateDollarValue.$dirty && v$.approximateDollarValue.$invalid"
        class="text-danger error"
        aria-live="assertive"
      >
        <p>Approximate dollar value of claims is required.</p>
      </div>

      <Textarea
        id="fee-items"
        v-model="feeItems"
        cypress-id="fee-items"
        label="Fee item(s) involved (use a comma to separate each item)"
        :maxlength="'250'"
        :required="true"
        class="mt-3"
        :input-style="extraLargeStyles"
        @input="handleAPIValidationReset"
        @blur="handleChangeField(v$.feeItems, $event, formFieldParent, store)"
      />

      <div
        v-if="v$.feeItems.$dirty && v$.feeItems.required.$invalid"
        class="text-danger error"
        aria-live="assertive"
      >
        <p>Fee item(s) required.</p>
      </div>

      <div
        v-if="
          v$.feeItems.$dirty &&
          !v$.feeItems.required.$invalid &&
          v$.feeItems.numericCommaValidator.$invalid
        "
        class="text-danger error"
        aria-live="assertive"
      >
        <p>
          Fee item field cannot include alphabetical characters or special characters except commas.
        </p>
      </div>

      <div
        v-if="
          v$.feeItems.$dirty &&
          !v$.feeItems.required.$invalid &&
          !v$.feeItems.numericCommaValidator.$invalid &&
          v$.feeItems.feeItemValidator.$invalid
        "
        class="text-danger error"
        aria-live="assertive"
      >
        <p>
          Each fee item must contain exactly 5 numbers and be separated from the next fee item by a
          comma.
        </p>
      </div>

      <p class="mt-3">
        <span class="bold">
          Please provide a detailed explanation for late submission of claim(s).
        </span>
      </p>

      <Textarea
        id="detailed-explanation"
        v-model="detailedExplanation"
        cypress-id="detailed-explanation"
        label="Note: Administrative issues such as staffing problems, clerical errors, lost or forgotten claims, system or service bureau problems do not qualify for exemption."
        :maxlength="'400'"
        :required="true"
        :input-style="extraLargeStyles"
        @input="handleAPIValidationReset"
        @blur="handleChangeField(v$.detailedExplanation, $event, formFieldParent, store)"
      />

      <div
        v-if="v$.detailedExplanation.$dirty && v$.detailedExplanation.$invalid"
        class="text-danger error"
        aria-live="assertive"
      >
        <p>Detailed explanation is required.</p>
      </div>

      <p class="mt-3">
        For verification purposes, please provide the following claims information for up to ten
        individuals.
      </p>

      <div
        v-for="(data, index) in storeIndividuals"
        :key="index"
        class="mt-3"
      >
        <hr class="mt-0" />
        <p class="bold">Individual {{ index + 1 }}</p>
        <OverAgeClaimsIndividual
          :prop-data="data"
          :index="index"
          :total-claims="storeIndividuals.length"
        />
      </div>

      <hr class="mt-3" />
      <ButtonComponent
        v-if="storeIndividuals.length < 10"
        label="Add individual"
        @click="handleAddIndividual"
      />

      <h2 class="mt-3">Upload support document(s) (optional)</h2>

      <p>
        Upload any suppport document(s) for your claims. <br />Please provide any additional
        comments on your document(s) below.
      </p>

      <hr class="mt-3" />

      <div class="row">
        <div class="col-md-7">
          <FileUploader
            id="claim-support-documents"
            v-model="claimSupportDocuments"
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

      <Textarea
        id="claim-comment"
        v-model="claimComment"
        cypress-id="claimComment"
        label="Comments (optional)"
        class="mt-3"
        :maxlength="'400'"
        :input-style="extraLargeStyles"
        @blur="handleChangeField(v$.claimComment, $event, formFieldParent, store)"
      />
    </main>
  </PageContent>
  <ContinueBar
    :button-label="'Continue'"
    :has-loader="isLoading"
    cypress-id="continue-bar"
    @continue="validatePage()"
  />
</template>

<script setup>
import {
  PageContent,
  RadioComponent,
  ContinueBar,
  DateInput,
  NumberInput,
  CurrencyInput,
  Textarea,
  ButtonComponent,
  FileUploader,
} from "common-lib-vue";
import { smallStyles, extraLargeStyles } from "@/constants/input-styles";
import { useVuelidate } from "@vuelidate/core";
import { handleChangeField } from "@/helpers/handler.js";
import { useCaptchaStore } from "@/stores/captchaStore";
import { useOverAgeClaimStore } from "@/stores/overAgeClaimStore";
import { required, requiredIf } from "@vuelidate/validators";
import OverAgeClaimsIndividual from "@/components/OverAgeClaimIndividual.vue";
import { feeItemValidator, numericCommaValidator } from "@/helpers/validators.js";
</script>

<script>
export default {
  name: "ClaimsInfo",
  components: {},
  data() {
    return {
      v$: useVuelidate(),
      captchaStore: useCaptchaStore(),
      store: useOverAgeClaimStore(),
      formFieldParent: "claimsInformation",
      dateType: null,
      claimServiceDate: null,
      claimDateRangeFrom: null,
      claimDateRangeTo: null,
      approximateClaimNumber: null,
      approximateDollarValue: null,
      feeItems: null,
      detailedExplanation: null,
      claimSupportDocuments: [],
      claimComment: null,
      isLoading: false,
      isSystemUnavailable: false,
      isAPIValidationErrorShown: false,
    };
  },
  computed: {
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
    storeIndividuals() {
      return this.store.formFields[this.formFieldParent]["individuals"];
    },
  },
  created() {
    this.assignDataFromStore();
  },
  validations() {
    const validations = {
      dateType: {
        required,
      },
      claimServiceDate: {
        required: requiredIf(this.dateType === "date"),
      },
      claimDateRangeFrom: {
        required: requiredIf(this.dateType === "range"),
      },
      claimDateRangeTo: {
        required: requiredIf(this.dateType === "range"),
      },
      approximateClaimNumber: {
        required,
      },
      approximateDollarValue: {
        required,
      },
      feeItems: {
        required,
        numericCommaValidator,
        feeItemValidator,
      },
      detailedExplanation: {
        required,
      },
      claimSupportDocuments: {},
      claimComment: {},
    };
    return validations;
  },
  methods: {
    validatePage() {
      this.store.updateFormField(
        [this.formFieldParent],
        "claimSupportDocuments",
        this.claimSupportDocuments
      );
      this.v$.$touch();
      console.log("validations: ", this.v$);
      console.log("data: ", this.store.formFields.claimsInformation);
      // TO-DO: add navigation, block if validations fail
    },
    handleAPIValidationReset() {
      this.isAPIValidationErrorShown = false;
      this.isSystemUnavailable = false;
    },
    handleAddIndividual() {
      this.store.addIndividual();
    },
    handleChangeDate(validationObject, newValue, formFieldParent, store) {
      if (validationObject) {
        validationObject.$touch();

        if (!validationObject.$invalid && newValue != null && formFieldParent) {
          store.updateFormField(formFieldParent, validationObject.$path, newValue);
        }
      }
    },
    assignDataFromStore() {
      this.dateType = this.store.formFields[this.formFieldParent]["dateType"];
      this.claimServiceDate = this.store.formFields[this.formFieldParent]["claimServiceDate"];
      this.claimDateRangeFrom = this.store.formFields[this.formFieldParent]["claimDateRangeFrom"];
      this.claimDateRangeTo = this.store.formFields[this.formFieldParent]["claimDateRangeTo"];
      this.approximateClaimNumber =
        this.store.formFields[this.formFieldParent]["approximateClaimNumber"];
      this.approximateDollarValue =
        this.store.formFields[this.formFieldParent]["approximateDollarValue"];
      this.feeItems = this.store.formFields[this.formFieldParent]["feeItems"];
      this.detailedExplanation = this.store.formFields[this.formFieldParent]["detailedExplanation"];
      this.claimSupportDocuments =
        this.store.formFields[this.formFieldParent]["claimSupportDocuments"];
    },
  },
};
</script>

<style scoped>
.bold {
  font-weight: bold;
}
.tip-container {
  background: #f2f2f2;
}
.title {
  font-weight: bold;
}
</style>
