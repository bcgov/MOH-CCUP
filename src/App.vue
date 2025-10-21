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
    <div
      id="modal-target"
      ref="modal"
      name="modal"
    ></div>
  </div>
</template>

<script>
import project from "/package.json";
import spaEnvService from "@/services/spa-env-service";
import logService from "@/services/log-service.js";
import "@bcgov/bootstrap-v5-theme/css/bootstrap-theme.min.css";
import "common-lib-vue/dist/common-lib-vue.css";
import { HeaderComponent, FooterComponent } from "common-lib-vue";
import { useCaptchaStore } from "@/stores/captchaStore";
import { routes } from "@/router/index.js";
import pageStateService from "@/services/page-state-service.js";

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
      captchaStore: useCaptchaStore(),
    };
  },
  created() {
    spaEnvService
      .loadEnvs()
      .then(() => {
        if (spaEnvService.values && spaEnvService.values.SPA_ENV_CCUP_MAINTENANCE_FLAG === "true") {
          this.captchaStore.maintenanceMessage =
            spaEnvService.values.SPA_ENV_CCUP_MAINTENANCE_MESSAGE;
          const toPath = routes.MAINTENANCE_PAGE.path;
          pageStateService.setPageComplete(toPath);
          pageStateService.visitPage(toPath);
          this.$router.push(toPath);
        }
      })
      .catch((error) => {
        logService.logError(this.captchaStore.applicationUuid, {
          event: "HTTP error getting values from spa-env-server",
          status: error.response.status,
        });
      });
  },
  mounted() {
    this.initModalObserver();
  },
  beforeUnmount() {
    if (this.modalObserver) {
      this.modalObserver.disconnect();
    }
  },
  methods: {
    initModalObserver() {
      const modalObserver = new MutationObserver(() => {
        const modalTargetEl = this.$refs.modal;
        this.isModalOpen = modalTargetEl && modalTargetEl.children.length > 0;
      });
      modalObserver.observe(this.$refs.modal, { childList: true });
      this.modalObserver = modalObserver;
    },
  },
};
</script>
