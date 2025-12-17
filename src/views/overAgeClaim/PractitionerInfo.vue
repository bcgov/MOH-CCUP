<template>
  <ProgressBar
    :routes="overAgeRoutes"
    :current-path="$route.path"
  />
  <PageContent>
    <main class="container pt-3 pt-sm-5 mb-5">
      <h1 class="mb-0">Practitioner information</h1>
      <hr class="mt-0" />
      <p class="mb-0">Please provide the necessary information about the practitioner.</p>
      <InputComponent
        id="prac-first-name"
        v-model="pracFirstName"
        cypress-id="pracFirstName"
        label="First name"
        :maxlength="firstNameMaxLength"
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
              ? "First name must begin with a letter and cannot include special characters except hyphens, periods, apostrophes and blank characters."
              : null
        }}
      </div>
      <InputComponent
        id="prac-last-name"
        v-model="pracLastName"
        cypress-id="pracLastName"
        label="Last name"
        :maxlength="lastNameMaxLength"
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
              ? "Last name must begin with a letter and cannot include special characters except hyphens, periods, apostrophes and blank characters."
              : null
        }}
      </div>

      <PractitionerNumberInput
        id="prac-number"
        v-model="pracNumber"
        label="Practitioner number"
        cypress-id="pracNumber"
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
            ? "Practitioner number is required."
            : v$.pracNumber.valueLengthValidator.$invalid
              ? "Practitioner number must be 5 charactes long."
              : null
        }}
      </div>

      <!-- Using PractitionerNumberInput because payee number has the same format as a practitioner number -->
      <PractitionerNumberInput
        id="payee-number"
        v-model="payeeNumber"
        label="Payee number"
        cypress-id="payeeNumber"
        class="mt-3"
        :input-style="extraSmallStyles"
        @input="handleAPIValidationReset"
        @blur="handleChangeField(v$.payeeNumber, $event, formFieldParent, store)"
      />

      <div
        v-if="v$.payeeNumber.$dirty && v$.payeeNumber.$invalid"
        class="text-danger error"
        aria-live="assertive"
      >
        {{
          v$.payeeNumber.required.$invalid
            ? "Payee number is required."
            : v$.payeeNumber.valueLengthValidator.$invalid
              ? "Payee number must be 5 charactes long."
              : null
        }}
      </div>

      <!-- Using PractitionerNumberInput because data center number has the same format as a practitioner number -->
      <InputComponent
        id="data-center-number"
        v-model="dataCenterNumber"
        label="Data center number (optional)"
        cypress-id="dataCenterNumber"
        class="mt-3"
        :maxlength="'5'"
        :input-style="extraSmallStyles"
        @input="handleAPIValidationReset"
        @blur="handleChangeField(v$.dataCenterNumber, $event, formFieldParent, store)"
      />
      <div
        v-if="v$.dataCenterNumber.$dirty && v$.dataCenterNumber.$invalid"
        class="text-danger error"
        aria-live="assertive"
      >
        {{
          v$.dataCenterNumber.valueLengthValidator.$invalid
            ? "Data center number must be 5 charactes long."
            : null
        }}
      </div>

      <PhoneNumberInput
        id="contact-phone-number"
        v-model="contactPhoneNumber"
        label="Phone number (optional)"
        class="mt-3"
        :input-style="smallStyles"
        @blur="handleChangeField(v$.contactPhoneNumber, $event, formFieldParent, store)"
      />

      <div
        v-if="v$.contactPhoneNumber.$dirty && v$.contactPhoneNumber.$invalid"
        class="text-danger error"
        aria-live="assertive"
      >
        <p>Phone number does not appear to be valid.</p>
      </div>

      <RadioComponent
        id="preferred-contact-method"
        v-model="preferredContactMethod"
        class="mt-3"
        label="Preferred contact method"
        aria-labelledby="preferredContactMethod"
        name="preferred-contact-method"
        :required="true"
        :items="radioOptionsPreferredContactMethod"
        cypress-id="preferred-contact-method"
        :model-value="preferredContactMethod"
        @input="handleAPIValidationReset"
        @change="handleChangeField(v$.preferredContactMethod, $event, formFieldParent, store)"
      />

      <div
        v-if="v$.preferredContactMethod.$dirty && v$.preferredContactMethod.$invalid"
        class="text-danger error"
        aria-live="assertive"
      >
        <p>Preferred contact method is required.</p>
      </div>

      <div v-if="isPreferredContactMethodFax">
        <PhoneNumberInput
          id="fax-phone-number"
          v-model="faxNumber"
          label="Fax phone number"
          class="mt-3"
          :input-style="smallStyles"
          @blur="handleChangeField(v$.faxNumber, $event, formFieldParent, store)"
        />
        <div
          v-if="v$.faxNumber.$dirty && v$.faxNumber.$invalid"
          class="text-danger error"
          aria-live="assertive"
        >
          {{
            v$.faxNumber.required.$invalid
              ? "Fax number is required."
              : v$.faxNumber.phoneValidator.$invalid
                ? "Fax number does not appear to be valid."
                : null
          }}
        </div>
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
  PractitionerNumberInput,
  PhoneNumberInput,
  optionalValidator,
  phoneValidator,
} from "common-lib-vue";
import { firstNameMaxLength, lastNameMaxLength } from "@/constants/html-validations.js";
import { extraSmallStyles, mediumStyles, smallStyles } from "@/constants/input-styles";
import { useVuelidate } from "@vuelidate/core";
import { handleChangeField } from "@/helpers/handler.js";
import { useCaptchaStore } from "@/stores/captchaStore";
import { useOverAgeClaimStore } from "@/stores/overAgeClaimStore";
import { required } from "@vuelidate/validators";
import { nameValidator, valueLengthValidator } from "@/helpers/validators.js";
import { overAgeRoutes, routes } from "@/router/index.js";
import ProgressBar from "@/components/ProgressBar.vue";
import pageStateService from "@/services/page-state-service.js";
import { scrollTo, scrollToError } from "@/helpers/scroll";
</script>

<script>
export default {
  name: "PatientInfo",
  components: {
    ProgressBar,
  },
  data() {
    return {
      v$: useVuelidate(),
      captchaStore: useCaptchaStore(),
      store: useOverAgeClaimStore(),
      formFieldParent: "practitioner",
      pracFirstName: null,
      pracLastName: null,
      pracNumber: null,
      payeeNumber: null,
      dataCenterNumber: null,
      contactPhoneNumber: null,
      preferredContactMethod: null,
      faxNumber: null,
      isLoading: false,
      isSystemUnavailable: false,
      isAPIValidationErrorShown: false,
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
  },
  created() {},
  validations() {
    const validations = {
      pracFirstName: {
        required,
        nameValidator,
      },
      pracLastName: {
        required,
        nameValidator,
      },
      pracNumber: {
        required,
        valueLengthValidator,
      },
      payeeNumber: {
        required,
        valueLengthValidator,
      },
      dataCenterNumber: {
        valueLengthValidator: optionalValidator(valueLengthValidator),
      },
      contactPhoneNumber: {
        phoneValidator,
      },
      preferredContactMethod: {
        required,
      },
      faxNumber: {
        phoneValidator: optionalValidator(phoneValidator),
      },
    };

    if (this.isPreferredContactMethodFax) {
      validations.faxNumber.required = required;
    }
    return validations;
  },
  methods: {
    validatePage() {
      this.v$.$touch();
      if (!this.v$.$error) {
        this.nextPage();
      } else {
        scrollToError();
      }
    },
    nextPage() {
      //Navigate to next path.
      const toPath = routes.OVER_AGE_CLAIMS_INFO.path;
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo(0);
    },
    handleAPIValidationReset() {
      this.isAPIValidationErrorShown = false;
      this.isSystemUnavailable = false;
    },
  },
};
</script>

<style></style>
