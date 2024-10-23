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
            <div class="row h-50">
              <div class="card border-0">
                <div class="card-header fw-bold px-0 py-0">
                  <div class="row">
                    <div class="col-8">Practitioner information</div>
                    <div class="col-4 icon-align-right">
                      <a
                        href="/ccup/practitioner-info"
                        class="link-icon"
                        @click.prevent="Edit(routes.PRACTITIONER_INFO.path)"
                      >
                        edit&nbsp;&nbsp;<IconPencil
                          class="icon-style"
                          color="#1a5a96"
                      /></a>
                    </div>
                  </div>
                </div>
                <div class="card-body bg-gray">
                  <div class="row row-details">
                    <div class="col-6">
                      <span class="fs-5 fw-bold">First name</span>
                    </div>
                    <div class="col-6 mb-3">
                      <span class="fs-5">Jane</span>
                    </div>
                  </div>
                  <div class="row row-details">
                    <div class="col-6">
                      <span class="fs-5 fw-bold">Last name</span>
                    </div>
                    <div class="mb-3 col-6">
                      <span class="fs-5">Doe</span>
                    </div>
                  </div>
                  <div class="mb-0 row">
                    <div class="col-6">
                      <p class="mb-0 fs-5 fw-bold">Practitioner number</p>
                    </div>
                    <div class="col-6">
                      <span class="fs-5">A8765</span>
                    </div>
                  </div>
                  <div class="row row-details">
                    <div class="col-6">
                      <span class="fs-5 fw-bold">Payee number</span>
                    </div>
                    <div class="col-6">
                      <span class="fs-5">87546</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="py-3 row pb-0 h-50">
              <div class="card border-0">
                <div class="card-header fw-bold px-0 py-0">
                  <div class="row">
                    <div class="col-8">Documents upload</div>
                    <div class="col-4 icon-align-right">
                      <a
                        href="javascript:void(0)"
                        class="link-icon"
                        @click.prevent="Edit(routes.UPLOAD_DOCUMENTS.path)"
                        >edit&nbsp;&nbsp;<IconPencil
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
                        <span class="fs-5 fw-bold">Document uploaded</span>
                      </div>
                      <div class="col-6">
                        <span class="fs-5">1</span>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-6">
                        <span class="fs-5 fw-bold">Note</span>
                      </div>
                      <div class="col-6 col-6 fs-5">
                        <p>
                          Included is a description document of the procedure performed by the Dr.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-sm-6">
            <div class="card border-0">
              <div class="card-header fw-bold px-0 py-0">
                <div class="row">
                  <div class="col-8">Patient information</div>
                  <div class="col-4 icon-align-right">
                    <a
                      href="javascript:void(0)"
                      class="link-icon"
                      @click.prevent="Edit(routes.PATIENT_INFO.path)"
                      >edit&nbsp;&nbsp;<IconPencil
                        class="icon-style"
                        color="#1a5a96"
                    /></a>
                  </div>
                </div>
              </div>
              <div class="card-body bg-gray">
                <div class="row">
                  <h5 class="row-title">Document Type</h5>

                  <div class="row h-100">
                    <div class="col-6 pt-2">
                      <span class="px-2 fs-5 fw-bold">Document</span>
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
                        :disabled="true"
                        :model-value="pre - auth"
                      />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <h5 class="row-title">Adjudicator</h5>
                  <div class="row row-details">
                    <div class="col-6">
                      <span class="fs-5 px-2 fw-bold">First name</span>
                    </div>
                    <div class="col-6">
                      <span class="fs-5">Alice</span>
                    </div>
                  </div>
                  <div class="row row-details">
                    <div class="col-6">
                      <span class="fs-5 px-2 fw-bold">Last name</span>
                    </div>
                    <div class="col-6">
                      <span class="fs-5">Johnson</span>
                    </div>
                  </div>
                </div>
                <div class="row mt-3 mb-3">
                  <h5 class="row-title">Patient</h5>
                  <div class="row row-details">
                    <div class="col-6">
                      <span class="fs-5 px-2 fw-bold">First initial</span>
                    </div>
                    <div class="col-6">
                      F
                      <span class="fs-5"></span>
                    </div>
                  </div>
                  <div class="row row-details">
                    <div class="col-6">
                      <span class="fs-5 px-2 fw-bold">Last name</span>
                    </div>
                    <div class="col-6">
                      <span class="fs-5">Martinez</span>
                    </div>
                  </div>
                  <div class="row row-details">
                    <div class="col-6">
                      <span class="fs-5 px-2 fw-bold">Birthdate</span>
                    </div>
                    <div class="col-6">
                      <span class="fs-5">February 23, 1985</span>
                    </div>
                  </div>
                  <div class="row row-details">
                    <div class="col-6">
                      <p class="fs-5 px-2 fw-bold">PHN (Personal Health Number)</p>
                    </div>
                    <div class="col-6">
                      <span class="fs-5">1234567890</span>
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
        <div class="row px-3 fs-5">
          <CheckboxComponent
            id="pratitioner-declaration-accuracy"
            label="Jane Doe"
          />
        </div>
      </main>
    </PageContent>
  </main>
  <ContinueBar
    :button-label="'Submit'"
    cypress-id="continue-bar"
    @continue="nextPage()"
  />
</template>
<script setup>
// import { smallStyles, mediumStyles } from "@/constants/input-styles";
// import { useFormStore } from "@/stores/formData";
// const store = useFormStore();
import { IconPencil } from "common-lib-vue";
import { PageContent, ContinueBar, RadioComponent, CheckboxComponent } from "common-lib-vue";
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
      // Navigate to next path.
      const toPath = routes.SUBMISSION_PAGE.path;
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
    },
    Edit(toPath) {
      //Navigate to path.
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
    },
  },
};
</script>

<style>
.icon-style {
  width: 16px;
}
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

.icon-align-right {
  display: flex;
  justify-content: flex-end;
}

a.link-icon {
  text-decoration: none;
}
</style>
