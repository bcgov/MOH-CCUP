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
import { useFormStore } from "@/stores/formData";
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
      store: useFormStore(),
    };
  },
  created() {
    logService.logNavigation(
      this.store.captcha.applicationUuid,
      routes.MAINTENANCE_PAGE.path,
      routes.MAINTENANCE_PAGE.title
    );
    if (this && this.store && this.store.maintenanceMessage) {
      this.maintenanceMessage = this.store.maintenanceMessage;
    }
  },
};
</script>
