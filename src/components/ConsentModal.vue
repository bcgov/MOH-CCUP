<template>
  <div ref="modal">
    <div
      id="exampleModal"
      class="modal fade show"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
    >
      <div
        class="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h2
              id="exampleModalLabel"
              class="modal-title"
            >
              Information collection notice
            </h2>
          </div>
          <div class="modal-body">
            <p>
              Your personal information is collected by the Ministry of Health under the authority
              of sections 26(a) and (c) of the Freedom of Information and Protection of Privacy Act
              (FIPPA). It is collected for the purpose of administering Medical Services Plan and
              Supplementary Benefits under the Medicare Protection Act and to determine, verify and
              administer your and your family’s Fair PharmaCare coverage under the Pharmaceutical
              Services Act. If you have questions about the collection of personal information on
              this form, contact the HIBC Chief Privacy Officer at PO Box 9035 STN Prov Govt,
              Victoria BC V8W 9E3; or call 604 683-7151 (Vancouver) or 1 800 663-7100 (toll free).
            </p>
            <CaptchaComponent
              v-if="!isCaptchaValid"
              cypress-id="captcha"
              class="mt-4"
              :api-base-path="captchaAPIBasePath"
              :nonce="applicationUuid"
              @captcha-loaded="handleCaptchaLoaded()"
              @captcha-verified="handleCaptchaVerified($event)"
            />
            <div
              v-if="isCaptchaValid"
              class="text-success"
            >
              Captcha successfully verified.
            </div>
            <div class="mt-3">
              <input
                id="is-terms-accepted"
                v-model="isTermsAccepted"
                type="checkbox"
                data-cy="consentCheckbox"
                class="d-inline"
              />
              <label
                for="is-terms-accepted"
                class="mt-3 ml-2 d-inline"
                ><b class="px-1">I have read and understand this information</b>
              </label>
            </div>
          </div>
          <div class="modal-footer justify-content-center">
            <ButtonComponent
              label="Continue"
              cypress-id="consentContinue"
              :disabled="!isCaptchaValid || !isTermsAccepted"
              @click="closeModal()"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useFormStore } from "../stores/formData";
import { ButtonComponent, CaptchaComponent } from "common-lib-vue";
import apiService from "../services/api-service";
export default {
  name: "ConsentModal",
  components: {
    ButtonComponent,
    CaptchaComponent,
  },
  emits: ["close"],
  data: () => {
    return {
      store: useFormStore(),
      focusableEls: [],
      focusedEl: null,
      applicationUuid: null,
      captchaAPIBasePath: "/ccup/api/captcha",
      isCaptchaValid: false,
      isTermsAccepted: false,
    };
  },
  created() {
    this.applicationUuid = this.store.captcha.applicationUuid;
    window.addEventListener("keydown", this.handleKeyDown);
    document.body.classList.add("no-scroll");
  },
  unmounted() {
    window.removeEventListener("keydown", this.handleKeyDown);
    document.body.classList.remove("no-scroll");
  },
  mounted() {
    this.focusableEls = this.getFocusableEls();
  },
  methods: {
    getFocusableEls() {
      // Create an array of focusable elements from the contents of the modal
      return Array.from(
        this.$refs.modal.querySelectorAll(
          'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button, [tabindex="0"]'
        )
      );
    },
    handleCaptchaLoaded() {
      this.focusableEls = this.getFocusableEls();
    },
    handleCaptchaVerified(captchaToken) {
      this.store.captcha.captchaToken = captchaToken;
      this.isCaptchaValid = true;
      this.logMiddlewareVersion();
      setTimeout(() => {
        this.focusableEls = this.getFocusableEls();
      }, 0);
    },
    logMiddlewareVersion() {
      const captchaToken = this.$store.state.ccupModule.captchaToken;
      apiService.getMiddlewareVersion(captchaToken).then((response) => {
        console.log(`Middleware version: ${response.data}`);
      });
    },
    closeModal() {
      this.$emit("close", true);
    },
    handleKeyDown(event) {
      // Handle tabbing
      if (event.key === "Tab") {
        // Prevent usual tabbing, manually set focus
        event.preventDefault();
        if (event.shiftKey) {
          this.handleTabBackwards();
        } else {
          this.handleTab();
        }
      }
    },
    // Move to next focusable element, if at last element, move to first
    handleTab() {
      if (!this.focusedEl && this.focusableEls.length > 0) {
        this.focusedEl = this.focusableEls[0];
        this.focusedEl.focus();
        return;
      }
      const position = this.focusableEls.indexOf(this.focusedEl);
      if (position === this.focusableEls.length - 1) {
        this.focusedEl = this.focusableEls[0];
      } else {
        this.focusedEl = this.focusableEls[position + 1];
      }
      this.focusedEl.focus();
    },
    // Move to next focusable element, if at last element, move to first
    handleTabBackwards() {
      if (!this.focusedEl && this.focusableEls.length > 0) {
        this.focusedEl = this.focusableEls[this.focusableEls.length - 1];
        this.focusedEl.focus();
        return;
      }
      const position = this.focusableEls.indexOf(this.focusedEl);
      if (position === 0) {
        this.focusedEl = this.focusableEls[this.focusableEls.length - 1];
      } else {
        this.focusedEl = this.focusableEls[position - 1];
      }
      this.focusedEl.focus();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.modal.show {
  display: block;
  background-color: rgba(0, 0, 0, 0.4);
  overflow-y: scroll;
}
.modal-header {
  background: #036;
  color: #fff;
}
</style>
