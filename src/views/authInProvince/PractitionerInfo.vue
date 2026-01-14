<template>
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
        :maxlength="firstNameMaxLength"
        :required="true"
        class="mt-3"
        :input-style="mediumStyles"
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
        cypress-id="prac-last-name"
        label="Last name"
        :maxlength="lastNameMaxLength"
        :required="true"
        class="mt-3"
        :input-style="mediumStyles"
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
        cypress-id="prac-number"
        class="mt-3"
        :input-style="extraSmallStyles"
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
    </main>
  </PageContent>
  <ContinueBar
    :button-label="'Continue'"
    cypress-id="continue-bar"
    @continue="validatePage()"
  />
</template>

<script setup>
import { PageContent, ContinueBar, InputComponent, PractitionerNumberInput } from "common-lib-vue";
import { firstNameMaxLength, lastNameMaxLength } from "@/constants/html-validations.js";
import { extraSmallStyles, mediumStyles } from "@/constants/input-styles";
import { useVuelidate } from "@vuelidate/core";
import { handleChangeField } from "@/helpers/handler.js";
import { useAuthInProvinceStore } from "@/stores/authInProvinceStore.js";
import { required } from "@vuelidate/validators";
import { nameValidator, valueLengthValidator } from "@/helpers/validators.js";
import { routes } from "@/router/index.js";
import pageStateService from "@/services/page-state-service.js";
import { scrollTo, scrollToError } from "@/helpers/scroll";
</script>

<script>
export default {
  name: "PractitionerInfo",
  data() {
    return {
      v$: useVuelidate(),
      store: useAuthInProvinceStore(),
      formFieldParent: "practitionerInfo",
      pracFirstName: null,
      pracLastName: null,
      pracNumber: null,
    };
  },
  created() {
    this.assignDataFromStore();
  },
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
    };
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
      this.v$.$validate();
    },
    assignDataFromStore() {
      this.pracFirstName = this.store.formFields[this.formFieldParent]["pracFirstName"];
      this.pracLastName = this.store.formFields[this.formFieldParent]["pracLastName"];
      this.pracNumber = this.store.formFields[this.formFieldParent]["pracNumber"];
    },
  },
};
</script>
<style></style>
