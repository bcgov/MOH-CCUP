import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "/ccup/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
  },
  server: {
    // proxy: {
    //   "/ccup/api": {
    //     target: "TODO: change to Openshift for API development, eg. https://itrf-web-3f9283-dev.apps.silver.devops.gov.bc.ca/",
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
  },
});
