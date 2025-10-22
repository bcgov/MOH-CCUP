<template>
  <div>
    <PageContent>
      <div class="container pt-3 pt-sm-5 mb-5">
        <h1>Maintenance Mode</h1>
        <hr />
        <p data-cy="maintenance-message">{{ maintenanceMessage }}</p>
      </div>
    </PageContent>
  </div>
</template>

<script>
import { PageContent } from "common-lib-vue";
import { useCaptchaStore } from "@/stores/captchaStore";
import { routes } from "../router/index.js";
import logService from "../services/log-service.js";

export default {
  name: "MaintenancePage",
  components: {
    PageContent,
  },
  data: () => {
    return {
      maintenanceMessage:
        "This application is currently unavailable due to maintenance. Please try again later.",
      captchaStore: useCaptchaStore(),
    };
  },
  created() {
    logService.logNavigation(
      this.captchaStore.applicationUuid,
      routes.MAINTENANCE_PAGE.path,
      routes.MAINTENANCE_PAGE.title
    );
    if (this && this.captchaStore && this.captchaStore.maintenanceMessage) {
      this.maintenanceMessage = this.captchaStore.maintenanceMessage;
    }
  },
};
</script>
