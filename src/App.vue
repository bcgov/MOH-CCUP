<template>
  <div>
    <div :aria-hidden="isModalOpen">
      <HeaderComponent
        :title="pageTitle"
        image-path="/ccup/images/"
      />

      <RouterView />
      <FooterComponent :version="version" />
    </div>
  </div>
</template>

<script>
import project from "/package.json";
import "@bcgov/bootstrap-v5-theme/css/bootstrap-theme.min.css";
import "common-lib-vue/dist/common-lib-vue.css";
import { HeaderComponent, FooterComponent } from "common-lib-vue";

export default {
  name: "App",
  components: {
    HeaderComponent,
    FooterComponent,
  },
  data: () => {
    return {
      version: project.version,
      pageTitle: "Claims Correspondence Upload Portal",
      isModalOpen: false,
      modalObserver: null,
    };
  },
};
</script>
