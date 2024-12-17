import { createRouter, createWebHistory } from "vue-router";
import PractitionerInfo from "../views/PractitionerInfo.vue";
import PatientInfo from "../views/PatientInfo.vue";
import UploadDocuments from "../views/UploadDocuments.vue";
import ReviewPage from "../views/ReviewPage.vue";
import SubmissionPage from "../views/SubmissionPage.vue";
import pageStateService from "../services/page-state-service";

export const routes = {
  PRACTITIONER_INFO: {
    path: "/",
    title: "Practitioner information",
    name: "PractitionerInfo",
    component: PractitionerInfo,
  },
  PATIENT_INFO: {
    path: "/patient-info",
    title: "Patient Info",
    name: "PatientInfo",
    component: PatientInfo,
  },
  UPLOAD_DOCUMENTS: {
    path: "/upload-documents",
    title: "Upload Documents",
    name: "UploadDocuments",
    component: UploadDocuments,
  },
  REVIEW_PAGE: {
    path: "/review-page",
    title: "Review Page",
    name: "ReviewPage",
    component: ReviewPage,
  },
  SUBMISSION_PAGE: {
    path: "/submission-page",
    title: "Submission Page",
    name: "SubmissionPage",
    component: SubmissionPage,
  },
};

export const stepRoutes = [
  { ...routes.PRACTITIONER_INFO },
  { ...routes.PATIENT_INFO },
  { ...routes.UPLOAD_DOCUMENTS },
  { ...routes.REVIEW_PAGE },
  { ...routes.SUBMISSION_PAGE },
];

export const routeStepOrder = [
  routes.PRACTITIONER_INFO,
  routes.PATIENT_INFO,
  routes.UPLOAD_DOCUMENTS,
  routes.REVIEW_PAGE,
  routes.SUBMISSION_PAGE,
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "PractitionerInfo",
      component: () => import("../views/PractitionerInfo.vue"),
    },
    {
      path: "/patient-info",
      name: "PatientInfo",
      component: () => import("../views/PatientInfo.vue"),
    },
    {
      path: "/upload-documents",
      name: "UploadDocuments",
      component: () => import("../views/UploadDocuments.vue"),
    },
    {
      path: "/review-page",
      name: "ReviewPage",
      component: () => import("../views/ReviewPage.vue"),
    },
    {
      path: "/submission-page",
      name: "SubmissionPage",
      component: () => import("../views/SubmissionPage.vue"),
    },
  ],
});

export const isPastPath = (toPath, fromPath) => {
  for (let i = 0; i < routeStepOrder.length; i++) {
    if (routeStepOrder[i].path === fromPath) {
      return false;
    } else if (routeStepOrder[i].path === toPath) {
      return true;
    }
  }
  return false;
};

pageStateService.importPageRoutes(routes);

router.beforeEach((to, from, next) => {
  // Home redirects.
  if (to.path !== routes.PRACTITIONER_INFO.path && !pageStateService.isPageVisited(to.path)) {
    next({ path: routes.PRACTITIONER_INFO.path });
  } else {
    // Catch-all (navigation).
    next();
  }
});

export default router;
