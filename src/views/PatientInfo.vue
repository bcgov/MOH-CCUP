<template>
  <main>
    <ProgressBar
      :routes="stepRoutes"
      :current-path="$route.path"
    />
    <PageContent>
      <main class="container pt-3 pt-sm-5 mb-5">
        <h1>Claims: Patient information</h1>
        <hr />
        <h2>Patient</h2>
        <p>Please provide the patient information required for this claim.</p>
        <hr />
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
// import { useFormStore } from "@/stores/formData";
import { PageContent, ContinueBar } from "common-lib-vue";
// const store = useFormStore();
import ProgressBar from "../components/ProgressBar.vue";
import { stepRoutes, routes } from "../router/index.js";
import pageStateService from "../services/page-state-service.js";
</script>

<script>
export default {
  methods: {
    nextPage() {
      console.log("nextPage function called");
      // Navigate to next path.
      const toPath = routes.UPLOAD_DOCUMENTS.path;
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
    },
  },
};
</script>
