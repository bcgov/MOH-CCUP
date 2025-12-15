<template>
  <PageContent>
    <main class="container pt-3 pt-sm-5 mb-5">
      <h1 class="mb-0">Medical information</h1>
      <hr class="mt-0" />
      <h2>Patient's medical information</h2>
      <p class="mb-0">
        Please provide the necessary information about the medical information of the patient.
      </p>
      <hr class="mt-0" />

      <Textarea
        id="proposed-procedure"
        v-model="proposedProcedure"
        cypress-id="proposed-procedure"
        label="Proposed surgical procedure"
        :maxlength="'250'"
        :required="true"
        class="mt-3"
        :input-style="extraLargeStyles"
        @input="handleAPIValidationReset"
        @blur="handleChangeField(v$.proposedProcedure, $event, formFieldParent, store)"
      />

      <div
        v-if="v$.proposedProcedure.$dirty && v$.proposedProcedure.required.$invalid"
        class="text-danger error"
        aria-live="assertive"
      >
        Proposed surgical procedure is required.
      </div>

      <InputComponent
        id="fee-items"
        v-model="feeItems"
        cypress-id="fee-items"
        label="Fee item(s) (use commas to separate different items)"
        :maxlength="'250'"
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
        Fee item(s) required.
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

      <DateInput
        id="previous-surgery-date"
        v-model="previousSurgeryDate"
        cypress-id="previousSurgeryDate"
        label="Previous surgery date (optional)"
        :use-invalid-state="true"
        class-name="mt-3"
        @process-date="
          handleChangeDate(
            v$.previousSurgeryDate,
            $event,
            formFieldParent,
            store,
            'previousSurgeryDate'
          )
        "
        @input="handleAPIValidationReset"
      />

      <div
        v-if="v$.previousSurgeryDate.$dirty && v$.previousSurgeryDate.dateDataValidator.$invalid"
        class="text-danger error"
        aria-live="assertive"
      >
        Previous surgery date must be a valid date.
      </div>

      <div
        v-if="
          v$.previousSurgeryDate.$dirty &&
          !v$.previousSurgeryDate.dateDataValidator.$invalid &&
          v$.previousSurgeryDate.beforeTodayValidator.$invalid
        "
        class="text-danger error"
        aria-live="assertive"
      >
        Previous surgery date must be in the past.
      </div>

      <DateInput
        id="trauma-date"
        v-model="traumaDate"
        cypress-id="traumaDate"
        label="Trauma date (optional)"
        :use-invalid-state="true"
        class-name="mt-3"
        @process-date="
          handleChangeDate(v$.traumaDate, $event, formFieldParent, store, 'traumaDate')
        "
        @input="handleAPIValidationReset"
      />

      <div
        v-if="v$.traumaDate.$dirty && v$.traumaDate.dateDataValidator.$invalid"
        class="text-danger error"
        aria-live="assertive"
      >
        Trauma date must be a valid date.
      </div>

      <div
        v-if="
          v$.traumaDate.$dirty &&
          !v$.traumaDate.dateDataValidator.$invalid &&
          v$.traumaDate.beforeTodayValidator.$invalid
        "
        class="text-danger error"
        aria-live="assertive"
      >
        Trauma date must be in the past.
      </div>

      <h4 class="mt-5">Attach consultation report or description of medical condition(s).</h4>
      <hr />

      <div class="row mt-3">
        <div class="col-md-7">
          <FileUploader
            id="consultation-report"
            v-model="consultationReport"
          />
        </div>

        <div class="col-md-5">
          <div class="tip-container rounded p-3">
            <p>
              <span class="bold">For blepharoplasty:</span> Please indicate whether the patient
              meets the criteria for “impairment of vision” as defined in the Payment Schedule.
            </p>
            <p>
              <span class="bold">For gender reassignment surgery:</span> please indicate whether the
              patient meets the criteria for the treatment of “gender dysphoria” as defined in the
              Payment Schedule.
            </p>
          </div>
        </div>
      </div>

      <Textarea
        id="description"
        v-model="description"
        cypress-id="description"
        label="Description of medical condition(s)"
        :maxlength="'400'"
        :required="true"
        class="mt-3"
        :input-style="extraLargeStyles"
        @input="handleAPIValidationReset"
        @blur="handleChangeField(v$.description, $event, formFieldParent, store)"
      />

      <div
        v-if="v$.description.$dirty && v$.reportOrDescriptionValidator.$invalid"
        class="text-danger error"
        aria-live="assertive"
      >
        Either a consultation report or a description is required.
      </div>
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
  InputComponent,
  PageContent,
  ContinueBar,
  DateInput,
  Textarea,
  FileUploader,
  optionalValidator,
} from "common-lib-vue";
import { extraLargeStyles } from "@/constants/input-styles";
import { useVuelidate } from "@vuelidate/core";
import { handleChangeField } from "@/helpers/handler.js";
import { useCaptchaStore } from "@/stores/captchaStore";
import { useAuthInProvinceStore } from "@/stores/authInProvinceStore";
import { scrollToError } from "@/helpers/scroll";
import { required } from "@vuelidate/validators";
import {
  feeItemValidator,
  numericCommaValidator,
  dateDataValidator,
  beforeTodayValidator,
  reportOrDescriptionValidator,
} from "@/helpers/validators.js";
</script>

<script>
export default {
  name: "ClaimsInfo",
  components: {},
  data() {
    return {
      v$: useVuelidate(),
      captchaStore: useCaptchaStore(),
      store: useAuthInProvinceStore(),
      formFieldParent: "medicalInfo",
      proposedProcedure: null,
      feeItems: null,
      previousSurgeryDate: null,
      traumaDate: null,
      consultationReport: [],
      description: null,

      isLoading: false,
      isSystemUnavailable: false,
      isAPIValidationErrorShown: false,
    };
  },
  created() {
    this.assignDataFromStore();
  },
  validations() {
    const validations = {
      proposedProcedure: {
        required,
      },
      feeItems: {
        required,
        numericCommaValidator,
        feeItemValidator,
      },
      previousSurgeryDate: {
        dateDataValidator: optionalValidator(dateDataValidator),
        beforeTodayValidator: optionalValidator(beforeTodayValidator),
      },
      traumaDate: {
        dateDataValidator: optionalValidator(dateDataValidator),
        beforeTodayValidator: optionalValidator(beforeTodayValidator),
      },
      consultationReport: {},
      description: {},
      reportOrDescriptionValidator,
    };
    return validations;
  },
  methods: {
    validatePage() {
      if (!this.consultationReport || this.consultationReport.length == 0) {
        // show error message
        scrollToError();
      } else {
        this.store.updateFormField("medicalInfo", "consultationReport", this.consultationReport);
      }
      this.v$.$touch();
      console.log("validations: ", this.v$);
      console.log("store: ", this.store.formFields.medicalInfo);
      console.log("local data:", this.previousSurgeryDate);
      // TO-DO: add navigation, block if validations fail
    },
    handleAPIValidationReset() {
      this.isAPIValidationErrorShown = false;
      this.isSystemUnavailable = false;
    },
    handleAddIndividual() {
      this.store.addIndividual();
    },
    handleChangeDate(validationObject, newValue, formFieldParent, store, dataField) {
      this[dataField] = newValue.date;
      if (validationObject) {
        validationObject.$touch();

        if (!validationObject.$invalid && newValue != null && formFieldParent) {
          store.updateFormField(formFieldParent, validationObject.$path, newValue);
        }
      }
    },
    assignDataFromStore() {
      // this.dateType = this.store.formFields[this.formFieldParent]["dateType"];
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
