<template>
  <ProgressBar
    :routes="nitaopRoutes"
    :current-path="$route.path"
  />
  <PageContent>
    <main class="container pt-3 pt-sm-5 mb-5">
      <h1 class="mb-0">Practitioner information</h1>
      <hr class="mt-0" />
      <h2>Practitioner</h2>
      <p class="mb-0">Please provide the necessary information about the practitioner.</p>
      <hr class="mt-0" />
      <InputComponent
        id="prac-first-name"
        v-model="pracFirstName"
        cypress-id="prac-first-name"
        label="First name"
        :maxlength="nitaopNameMaxLength"
        :required="true"
        class="mt-3"
        :input-style="mediumStyles"
        @input="handleAPIValidationReset"
        @blur="handleChangeField(v$.pracFirstName, $event, formFieldParent, store)"
      />
      <div
        v-if="v$.pracFirstName.$dirty && v$.pracFirstName.$invalid"
        class="text-danger error"
        aria-live="assertive"
      >
        {{
          v$.pracFirstName.required.$invalid
            ? "First name is required."
            : v$.pracFirstName.nameValidator.$invalid
              ? `First name must begin with a letter and cannot include special
              characters except hyphens, periods, apostrophes and blank characters.`
              : null
        }}
      </div>
      <InputComponent
        id="prac-last-name"
        v-model="pracLastName"
        cypress-id="prac-last-name"
        label="Last name"
        :maxlength="nitaopNameMaxLength"
        :required="true"
        class="mt-3"
        :input-style="mediumStyles"
        @input="handleAPIValidationReset"
        @blur="handleChangeField(v$.pracLastName, $event, formFieldParent, store)"
      />
      <div
        v-if="v$.pracLastName.$dirty && v$.pracLastName.$invalid"
        class="text-danger error"
        aria-live="assertive"
      >
        {{
          v$.pracLastName.required.$invalid
            ? "Last name is required."
            : v$.pracLastName.nameValidator.$invalid
              ? `Last name must begin with a letter and cannot include special
              characters except hyphens, periods, apostrophes and blank characters.`
              : null
        }}
      </div>

      <PractitionerNumberInput
        id="prac-number"
        v-model="pracNumber"
        cypress-id="prac-number"
        label="MSP practitioner number"
        :required="true"
        class="mt-3"
        :input-style="extraSmallStyles"
        @input="handleAPIValidationReset"
        @blur="handleChangeField(v$.pracNumber, $event, formFieldParent, store)"
      />
      <div
        v-if="v$.pracNumber.$dirty && v$.pracNumber.$invalid"
        class="text-danger error"
        aria-live="assertive"
      >
        {{
          v$.pracNumber.required.$invalid
            ? "MSP practitioner number is required."
            : v$.pracNumber.valueLengthValidator.$invalid
              ? "MSP practitioner number must be 5 characters long."
              : null
        }}
      </div>

      <PractitionerNumberInput
        id="payment-number"
        v-model="paymentNumber"
        cypress-id="payment-number"
        label="MSP payment number"
        :required="true"
        class="mt-3"
        :input-style="extraSmallStyles"
        @blur="handleChangeField(v$.paymentNumber, $event, formFieldParent, store)"
      />
      <div
        v-if="v$.paymentNumber.$dirty && v$.paymentNumber.$invalid"
        class="text-danger error"
        aria-live="assertive"
      >
        {{
          v$.paymentNumber.required.$invalid
            ? "MSP payment number is required."
            : v$.paymentNumber.valueLengthValidator.$invalid
              ? "MSP payment number must be 5 characters long."
              : null
        }}
      </div>

      <InputComponent
        id="specialty"
        v-model="specialty"
        cypress-id="specialty"
        :maxlength="'100'"
        label="Specialty (if applicable)"
        class="mt-3"
        :input-style="mediumStyles"
        @blur="handleChangeField(v$.specialty, $event, formFieldParent, store)"
      />

      <PhoneNumberInput
        id="contact-phone-number"
        v-model="contactPhoneNumber"
        cypress-id="contact-phone-number"
        label="Contact phone number"
        :required="true"
        class="mt-3"
        :input-style="smallStyles"
        @blur="handleChangeField(v$.contactPhoneNumber, $event, formFieldParent, store)"
      />
      <div
        v-if="v$.contactPhoneNumber.$dirty && v$.contactPhoneNumber.$invalid"
        class="text-danger error"
        aria-live="assertive"
      >
        {{
          v$.contactPhoneNumber.required.$invalid
            ? "Contact phone number is required."
            : v$.contactPhoneNumber.phoneValidator.$invalid
              ? "Contact phone number does not appear to be valid."
              : null
        }}
      </div>

      <InputComponent
        id="email"
        v-model="email"
        cypress-id="email"
        :maxlength="'254'"
        label="Email address"
        :required="true"
        class="mt-3"
        :input-style="mediumStyles"
        @blur="handleChangeField(v$.email, $event, formFieldParent, store)"
      />
      <div
        v-if="v$.email.$dirty && v$.email.$invalid"
        class="text-danger error"
        aria-live="assertive"
      >
        {{
          v$.email.required.$invalid
            ? "Email address is required."
            : v$.email.emailValidator.$invalid
              ? "Email address does not appear to be valid."
              : null
        }}
      </div>

      <h2 class="mt-5">Address</h2>
      <p class="mb-0">
        Enter the departure address - that's the address from which your trip departed.
      </p>
      <hr class="mt-0" />
      <Textarea
        id="street-address"
        v-model="streetAddress"
        cypress-id="street-address"
        label="Full street address"
        :maxlength="'254'"
        :required="true"
        class="mt-3"
        :input-style="largeStyles"
        @blur="handleChangeField(v$.streetAddress, $event, formFieldParent, store)"
      />
      <div
        v-if="v$.streetAddress.$dirty && v$.streetAddress.$invalid"
        class="text-danger error"
        aria-live="assertive"
      >
        Full street address is required.
      </div>

      <InputComponent
        id="city"
        v-model="city"
        cypress-id="city"
        :maxlength="'100'"
        label="City"
        :required="true"
        class="mt-3"
        :input-style="mediumStyles"
        @blur="handleChangeField(v$.city, $event, formFieldParent, store)"
      />
      <div
        v-if="v$.city.$dirty && v$.city.$invalid"
        class="text-danger error"
        aria-live="assertive"
      >
        City is required.
      </div>

      <InputComponent
        id="province"
        v-model="province"
        cypress-id="province"
        :maxlength="'100'"
        label="Province"
        :required="true"
        class="mt-3"
        :input-style="mediumStyles"
        @blur="handleChangeField(v$.province, $event, formFieldParent, store)"
      />
      <div
        v-if="v$.province.$dirty && v$.province.$invalid"
        class="text-danger error"
        aria-live="assertive"
      >
        Province is required.
      </div>

      <PostalCodeInput
        id="postal-code"
        v-model="postalCode"
        cypress-id="postal-code"
        label="Postal code"
        :required="true"
        class="mt-3"
        :input-style="smallStyles"
        @blur="handleChangeField(v$.postalCode, $event, formFieldParent, store)"
      />
      <div
        v-if="v$.postalCode.$dirty && v$.postalCode.$invalid"
        class="text-danger error"
        aria-live="assertive"
      >
        {{
          v$.postalCode.required.$invalid
            ? "Postal code is required."
            : v$.postalCode.postalCodeFormatValidator.$invalid
              ? "Postal code does not appear to be valid."
              : null
        }}
      </div>

      <RadioComponent
        id="has-other-funding"
        v-model="hasOtherFunding"
        class="mt-3"
        label="Are you receiving funding for travel expenses or time from any other source for this visit or for providing service under the rural locum programs?"
        name="has-other-funding"
        :required="true"
        :items="yesNoOptions"
        cypress-id="has-other-funding"
        @change="handleChangeField(v$.hasOtherFunding, $event, formFieldParent, store)"
      />
      <div
        v-if="v$.hasOtherFunding.$dirty && v$.hasOtherFunding.$invalid"
        class="text-danger error"
        aria-live="assertive"
      >
        Select Yes or No.
      </div>

      <div v-if="isOtherFundingYes">
        <Textarea
          id="other-funding-source"
          v-model="otherFundingSource"
          cypress-id="other-funding-source"
          :label="'If &quot;Yes&quot;, from where? (e.g. RGPLP, RSLP, RGPALP, APP, HA)'"
          :maxlength="'254'"
          :required="true"
          class="mt-3"
          :input-style="largeStyles"
          @blur="handleChangeField(v$.otherFundingSource, $event, formFieldParent, store)"
        />
        <div
          v-if="v$.otherFundingSource.$dirty && v$.otherFundingSource.$invalid"
          class="text-danger error"
          aria-live="assertive"
        >
          Funding source is required.
        </div>
      </div>

      <RadioComponent
        id="is-on-call"
        v-model="isOnCall"
        class="mt-3"
        label="Are you scheduled to be on call?"
        name="is-on-call"
        :required="true"
        :items="yesNoOptions"
        cypress-id="is-on-call"
        @change="handleChangeField(v$.isOnCall, $event, formFieldParent, store)"
      />
      <div
        v-if="v$.isOnCall.$dirty && v$.isOnCall.$invalid"
        class="text-danger error"
        aria-live="assertive"
      >
        Select Yes or No.
      </div>

      <div
        v-if="isSystemUnavailable"
        class="text-danger error my-4"
        aria-live="assertive"
      >
        Unable to continue, system unavailable. Please try again later.
      </div>
      <div
        v-if="isAPIValidationErrorShown"
        class="text-danger error my-4"
        aria-live="assertive"
      >
        Practitioner information does not match our records.
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
  PageContent,
  RadioComponent,
  ContinueBar,
  InputComponent,
  Textarea,
  PractitionerNumberInput,
  PhoneNumberInput,
  PostalCodeInput,
  phoneValidator,
} from "common-lib-vue";
import { nitaopNameMaxLength } from "@/constants/html-validations.js";
import { extraSmallStyles, largeStyles, mediumStyles, smallStyles } from "@/constants/input-styles";
import { useVuelidate } from "@vuelidate/core";
import { handleChangeField } from "@/helpers/handler.js";
import { toRaw } from "vue";
import { useCaptchaStore } from "@/stores/captchaStore";
import { useNitaopStore } from "@/stores/nitaopStore";
import { required } from "@vuelidate/validators";
import {
  nameValidator,
  valueLengthValidator,
  emailValidator,
  postalCodeFormatValidator,
} from "@/helpers/validators.js";
import { nitaopRoutes, routes } from "@/router/index.js";
import ProgressBar from "@/components/ProgressBar.vue";
import pageStateService from "@/services/page-state-service.js";
import { scrollTo, scrollToError } from "@/helpers/scroll";
import apiService from "@/services/api-service";
import logService from "@/services/log-service.js";
</script>

<script>
export default {
  name: "NitaopPractitionerInfo",
  components: {
    ProgressBar,
  },
  data() {
    return {
      v$: useVuelidate(),
      captchaStore: useCaptchaStore(),
      store: useNitaopStore(),
      formFieldParent: "practitioner",
      pracFirstName: null,
      pracLastName: null,
      pracNumber: null,
      paymentNumber: null,
      specialty: null,
      contactPhoneNumber: null,
      email: null,
      streetAddress: null,
      city: null,
      province: null,
      postalCode: null,
      hasOtherFunding: null,
      otherFundingSource: null,
      isOnCall: null,
      isLoading: false,
      isSystemUnavailable: false,
      isAPIValidationErrorShown: false,
    };
  },
  computed: {
    yesNoOptions() {
      return [
        { id: "yes", label: "Yes", value: "yes" },
        { id: "no", label: "No", value: "no" },
      ];
    },
    isOtherFundingYes() {
      return this.hasOtherFunding === "yes";
    },
  },
  created() {
    this.assignDataFromStore();
  },
  validations() {
    const validations = {
      pracFirstName: { required, nameValidator },
      pracLastName: { required, nameValidator },
      pracNumber: { required, valueLengthValidator },
      paymentNumber: { required, valueLengthValidator },
      specialty: {},
      contactPhoneNumber: { required, phoneValidator },
      email: { required, emailValidator },
      streetAddress: { required },
      city: { required },
      province: { required },
      postalCode: { required, postalCodeFormatValidator },
      hasOtherFunding: { required },
      otherFundingSource: {},
      isOnCall: { required },
    };

    if (this.isOtherFundingYes) {
      validations.otherFundingSource.required = required;
    }
    return validations;
  },
  methods: {
    validatePage() {
      this.v$.$validate();

      if (this.v$.$error) {
        return scrollToError();
      }

      this.validatePractitioner();
    },
    validatePractitioner() {
      this.isLoading = true;
      this.isSystemUnavailable = false;
      this.isAPIValidationErrorShown = false;

      const practitioner = toRaw(this.store.formFields.practitioner);
      apiService
        .validatePractitioner(practitioner, this.captchaStore)
        .then((response) => {
          this.isLoading = false;

          switch (response.data.returnCode) {
            case "0":
              logService.logInfo(this.captchaStore.applicationUuid, {
                event: "validation success (validatePractitioner)",
                response: response.data,
              });
              this.nextPage();
              break;
            case "1":
              this.isAPIValidationErrorShown = true;
              logService.logInfo(this.captchaStore.applicationUuid, {
                event: "validation failure (validatePractitioner)",
                response: response.data,
              });
              scrollToError();
              break;
            default:
              this.isSystemUnavailable = true;
              logService.logError(this.captchaStore.applicationUuid, {
                event: "validation failure (validatePractitioner endpoint unavailable)",
                response: response.data,
              });
              scrollToError();
              break;
          }
        })
        .catch((error) => {
          this.isLoading = false;
          this.isSystemUnavailable = true;
          logService.logError(this.captchaStore.applicationUuid, {
            event: "HTTP error (validatePractitioner unexpected problem)",
            status: error.response?.status,
          });
          scrollToError();
        });
    },
    handleAPIValidationReset() {
      this.isAPIValidationErrorShown = false;
      this.isSystemUnavailable = false;
    },
    nextPage() {
      const toPath = routes.NITAOP_STEP_2.path;
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo(0);
    },
    assignDataFromStore() {
      Object.keys(this.store.formFields[this.formFieldParent]).forEach((key) => {
        this[key] = this.store.formFields[this.formFieldParent][key];
      });
    },
  },
};
</script>
