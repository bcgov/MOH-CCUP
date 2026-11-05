<template>
  <ProgressBar
    :routes="nitaopRoutes"
    :current-path="$route.path"
  />
  <PageContent>
    <main class="container pt-3 pt-sm-5 mb-5">
      <h1 class="mb-0">{{ currentTitle }}</h1>
      <hr class="mt-0" />
      <p>Coming soon.</p>
    </main>
  </PageContent>
</template>

<script setup>
import { PageContent } from "common-lib-vue";
import ProgressBar from "@/components/ProgressBar.vue";
import { nitaopRoutes } from "@/router/index.js";
</script>

<script>
export default {
  name: "NitaopPlaceholderPage",
  computed: {
    currentTitle() {
      return nitaopRoutes.find((route) => route.path === this.$route.path)?.title;
    },
  },
};
</script>
