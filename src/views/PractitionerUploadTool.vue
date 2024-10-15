<template>
  <main>
    <ProgressBar
      :routes="stepRoutes"
      :current-path="$route.path"
    />
    <PageContent>
      <main class="container mb-5">
        <h2 class="my-0">Review</h2>
        <hr class="mt-2" />
        <div class="m-0 row">
          <div class="col-sm-6">
            <div class="card border-0">
              <div class="card-header fw-bold px-0">Practitioner information</div>
              <div class="card-body bg-gray">
                <div>
                  <h5 class="row-title">Document Type</h5>

                  <div class="row h-100">
                    <div class="col-6 py-2">
                      <span class="px-2 text-muted fs-5">Document</span>
                    </div>
                    <div class="col-6">
                      <RadioComponent
                        id="documents-category"
                        v-model="documentsCategory"
                        class="fs-5"
                        aria-labelledby="documentsCategory"
                        name="documents-category"
                        :required="true"
                        :items="radioOptionsDocumentsCategory"
                        cypress-id="documents-category"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h5 class="row-title">Practitioner</h5>
                  <div class="row px-2">
                    <div class="col-6">
                      <span class="fs-5">First name</span>
                    </div>
                    <div class="col-6">
                      <span class="text-muted fs-5">Janet</span>
                    </div>
                  </div>
                  <div class="row px-2">
                    <div class="col-6">
                      <span class="fs-5">Last name</span>
                    </div>
                    <div class="col-6">
                      <span class="text-muted fs-5">Doe</span>
                    </div>
                  </div>
                  <div class="row px-2">
                    <div class="col-6">
                      <span class="fs-5">Practitioner number</span>
                    </div>
                    <div class="col-6">
                      <span class="text-muted fs-5">A8546</span>
                    </div>
                  </div>
                  <div class="row px-2">
                    <div class="col-6">
                      <span class="fs-5">Payee number</span>
                    </div>
                    <div class="col-6">
                      <span class="text-muted fs-5">87546</span>
                    </div>
                  </div>
                  <h5 class="row-title mt-3">Adjudicator</h5>
                  <div class="row px-2">
                    <div class="col-6">
                      <span class="fs-5">First name</span>
                    </div>
                    <div class="col-6">
                      <span class="text-muted fs-5">James</span>
                    </div>
                  </div>
                  <div class="row px-2">
                    <div class="col-6">
                      <span class="fs-5">Last name</span>
                    </div>
                    <div class="col-6">
                      <span class="text-muted fs-5">Smith</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-sm-6">
            <div class="row h-50">
              <div class="px-0 card border-0">
                <div class="px-0 card-header fw-bold">Patient information</div>
                <div class="card-body bg-gray">
                  <div class="row row-details">
                    <div class="col-6">
                      <p class="fs-5">First Initial</p>
                    </div>
                    <div class="col-6 mb-3">
                      <p class="text-muted fs-5">S</p>
                    </div>
                  </div>
                  <div class="row row-details">
                    <div class="col-6">
                      <p class="fs-5">Last name</p>
                    </div>
                    <div class="mb-3 col-6">
                      <p class="text-muted fs-5">Jones</p>
                    </div>
                  </div>
                  <div class="row row-details">
                    <div class="col-6">
                      <p class="fs-5">Birthdate</p>
                    </div>
                    <div class="col-6">
                      <p class="text-muted fs-5">September 7, 1979</p>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-6">
                      <p class="fs-5">PHN (Personal Health Number)</p>
                    </div>
                    <div class="col-6">
                      <p class="text-muted fs-5">9999999998</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="py-3 row pb-0 h-50">
              <div class="px-0 card border-0">
                <div class="px-0 card-header fw-bold">Document upload</div>
                <div class="card-body bg-gray">
                  <div>
                    <div class="row">
                      <div class="col-6">
                        <span class="fs-5">Document uploaded</span>
                      </div>
                      <div class="col-6">
                        <span class="text-muted fs-5">1</span>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-6">
                        <span class="fs-5">Note</span>
                      </div>
                      <div class="col-6 col-6 text-muted fs-5">
                        Included is a description document of the procedure performed by the Dr.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-5 row">
          <h2 class="my-0">Declaration of accuracy and validity</h2>
          <hr class="mt-2" />
          <p>
            I hereby declare that the information provided through this web form is accurate,
            complete, and truthful to the best of my knowledge. I confirm that all information
            provided pertains to a single patient and is valid for a single claim or
            pre-authorization. I understand that any false, misleading, or omitted information may
            result in the rejection of my submission and could have legal consequences.
          </p>
          <p>
            By submitting this form, I affirm that I have personally completed all sections and that
            the information I have provided is a true and honest representation of the facts. I
            acknowledge that it is my responsibility to update any changes to this information
            promptly.
          </p>
        </div>
      </main>
    </PageContent>
  </main>
  <ContinueBar
    :button-label="'Continue'"
    cypress-id="continue-bar"
    @continue="nextPage()"
  />
</template>
<script setup>
// import { smallStyles, mediumStyles } from "@/constants/input-styles";
// import { useFormStore } from "@/stores/formData";
// const store = useFormStore();

import { PageContent, ContinueBar, RadioComponent } from "common-lib-vue";
import { stepRoutes, routes } from "../router/index.js";
import ProgressBar from "../components/ProgressBar.vue";
import pageStateService from "../services/page-state-service.js";
</script>

<script>
export default {
  data() {
    return {
      documentsCategory: null,
    };
  },

  computed: {
    pageTitle: function () {
      return this.$route.title;
    },
    radioOptionsDocumentsCategory() {
      return [
        {
          id: "documents-category-claim",
          label: "Claims document(s)",
          value: "claim",
        },
        {
          id: "documents-category-pre-auth",
          label: "Pre-authorization document(S)",
          value: "pre-auth",
        },
      ];
    },
  },

  methods: {
    nextPage() {
      console.log("nextPage function called");
      // Navigate to next path.
      const toPath = routes.PATIENT_INFO.path;
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
    },
  },
};
</script>

<style>
.row-details {
  height: 30px;
  padding-bottom: 0.5rem !important;
}
.row-title {
  margin-bottom: 9px;
}

div.card-body.bg-gray {
  background-color: #f4f4f4;
}

div.card-header {
  background-color: white;
  border-color: #d9d9d9;
  border-width: 3px;
}

hr {
  background-color: #313132;
}
</style>
