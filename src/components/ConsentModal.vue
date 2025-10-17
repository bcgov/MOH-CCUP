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
              Personal information is collected under the authority of the
              <span class="i">Medicare Protection Act</span> and section 26 (a), (c) and (e) of the
              <span class="i">Freedom of Information and Protection of Privacy Act (FIPPA)</span>
              for the purposes of administration of the Medical Services Plan. If you have any
              questions about the collection and use of your personal information, please contact
              the Health Insurance BC Chief Privacy Office at Health Insurance BC, Chief Privacy
              Office, PO Box 9035 STN Prov Govt, Victoria BC V8W 9E3 or call 604-683-7151
              (Vancouver) or 1-800-663-7100 (toll free).
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
              <CheckboxComponent
                id="is-terms-accepted"
                v-model="isTermsAccepted"
                class="is-terms-accepted"
                cypress-id="consentCheckbox"
                :required="true"
                label="I have read and understand this information"
              />
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
import { useDocSubmissionStore } from "../stores/docSubmissionStore";
import { ButtonComponent, CaptchaComponent, CheckboxComponent } from "common-lib-vue";
export default {
  name: "ConsentModal",
  components: {
    ButtonComponent,
    CaptchaComponent,
    CheckboxComponent,
  },
  emits: ["close"],
  data: () => {
    return {
      store: useDocSubmissionStore(),
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
      setTimeout(() => {
        this.focusableEls = this.getFocusableEls();
      }, 0);
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
.i {
  font-style: italic;
}
.is-terms-accepted {
  font-weight: bold;
}
.text-success {
  color: #3c7b37 !important;
}
</style>
