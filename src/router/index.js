import { createRouter, createWebHistory } from "vue-router";
import pageStateService from "../services/page-state-service";

export const routes = {
  GET_STARTED: {
    path: "/",
    title: "Get Started",
    name: "GetStarted",
    component: () => import("@/views/GetStarted.vue"),
  },
  PRACTITIONER_INFO: {
    path: "/practitioner-info",
    title: "Practitioner information",
    name: "PractitionerInfo",
    component: () => import("@/views/PractitionerInfo.vue"),
  },
  PATIENT_INFO: {
    path: "/patient-info",
    title: "Patient Info",
    name: "PatientInfo",
    component: () => import("@/views/PatientInfo.vue"),
  },
  UPLOAD_DOCUMENTS: {
    path: "/upload-documents",
    title: "Upload Documents",
    name: "UploadDocuments",
    component: () => import("@/views/UploadDocuments.vue"),
  },
  REVIEW_PAGE: {
    path: "/review-page",
    title: "Review Page",
    name: "ReviewPage",
    component: () => import("@/views/ReviewPage.vue"),
  },
  SUBMISSION_PAGE: {
    path: "/submission-page",
    title: "Submission Page",
    name: "SubmissionPage",
    component: () => import("@/views/SubmissionPage.vue"),
  },
  OVER_AGE_PRACTITIONER_PAGE: {
    path: "/over-age-practitioner",
    title: "Practitoner information",
    name: "OverAgePractitioner",
    component: () => import("@/views/overAgeClaim/PractitionerInfo.vue"),
  },
  OVER_AGE_CLAIMS_INFO: {
    path: "/over-age-claims",
    title: "Over-age Claims Information",
    name: "OverAgeClaims",
    component: () => import("@/views/overAgeClaim/ClaimsInfo.vue"),
  },
  OVER_AGE_REVIEW_PAGE: {
    path: "/over-age-review",
    title: "Over-age Review",
    name: "OverAgeReview",
    component: () => import("@/views/overAgeClaim/ReviewPage.vue"),
  },
  OVER_AGE_SUBMISSION: {
    path: "/over-age-submission",
    title: "Over-age Submission",
    name: "OverAgeSubmission",
    component: () => import("@/views/overAgeClaim/SubmissionPage.vue"),
  },
  AUTH_IN_PROV_MEDICAL: {
    path: "/auth-in-province-medical-info",
    title: "Pre-authorization of Payment Medical Information",
    name: "AuthInProvinceMedicalInfo",
    component: () => import("@/views/authInProvince/MedicalInfo.vue"),
  },
  AUTH_IN_PROV_PATIENT_INFO: {
    path: "/auth-in-province-patient-info",
    title: "Pre-authorization of Payment Patient Information",
    name: "AuthInProvincePatientInfo",
    component: () => import("@/views/authInProvince/PatientInfo.vue"),
  },
  MAINTENANCE_PAGE: {
    path: "/maintenance-page",
    title: "Maintenance Page",
    name: "MaintenancePage",
    component: () => import("@/views/MaintenancePage.vue"),
  },
};

export const stepRoutes = [
  { ...routes.PRACTITIONER_INFO },
  { ...routes.PATIENT_INFO },
  { ...routes.UPLOAD_DOCUMENTS },
  { ...routes.REVIEW_PAGE },
  { ...routes.SUBMISSION_PAGE },
];

export const overAgeRoutes = [
  { ...routes.OVER_AGE_PRACTITIONER_PAGE },
  { ...routes.OVER_AGE_CLAIMS_INFO },
  { ...routes.OVER_AGE_REVIEW_PAGE },
  { ...routes.OVER_AGE_SUBMISSION },
];

export const routeStepOrder = [
  routes.PRACTITIONER_INFO,
  routes.PATIENT_INFO,
  routes.UPLOAD_DOCUMENTS,
  routes.REVIEW_PAGE,
  routes.SUBMISSION_PAGE,
];

export const overAgeStepOrder = [
  routes.OVER_AGE_PRACTITIONER_PAGE,
  routes.OVER_AGE_CLAIMS_INFO,
  routes.OVER_AGE_REVIEW_PAGE,
  routes.OVER_AGE_SUBMISSION,
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "GetStarted",
      component: () => import("../views/GetStarted.vue"),
    },
    {
      path: "/practitioner-info",
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
    {
      path: "/over-age-practitioner",
      title: "Over-age Practitioner",
      name: "OverAgePractitioner",
      component: () => import("@/views/overAgeClaim/PractitionerInfo.vue"),
    },
    {
      path: "/over-age-claims",
      title: "Over-age Claims Info",
      name: "OverAgeClaims",
      component: () => import("@/views/overAgeClaim/ClaimsInfo.vue"),
    },
    {
      path: "/over-age-review",
      title: "Over-age Review",
      name: "OverAgeReview",
      component: () => import("@/views/overAgeClaim/ReviewPage.vue"),
    },
    {
      path: "/over-age-submission",
      title: "Over-age Submission",
      name: "OverAgeSubmission",
      component: () => import("@/views/overAgeClaim/SubmissionPage.vue"),
    },
    {
      path: "/auth-in-province-medical-info",
      title: "Pre-authorization of Payment Medical Information",
      name: "AuthInProvinceMedicalInfo",
      component: () => import("@/views/authInProvince/MedicalInfo.vue"),
    },
    {
      path: "/auth-in-province-patient-info",
      title: "Pre-authorization of Payment Patient Information",
      name: "AuthInProvincePatientInfo",
      component: () => import("@/views/authInProvince/PatientInfo.vue"),
    },
    {
      path: "/maintenance-page",
      name: "MaintenancePage",
      component: () => import("../views/MaintenancePage.vue"),
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

export const isOverAgePath = (toPath, fromPath) => {
  for (let i = 0; i < overAgeStepOrder.length; i++) {
    if (overAgeStepOrder[i].path === fromPath) {
      return false;
    } else if (overAgeStepOrder[i].path === toPath) {
      return true;
    }
  }
  return false;
};

pageStateService.importPageRoutes(routes);

router.beforeEach((to, from, next) => {
  // If navigation destination is maintenance page, allow it
  if (
    to.path === routes.MAINTENANCE_PAGE.path ||
    to.path === routes.AUTH_IN_PROV_PATIENT_INFO.path
  ) {
    next();
  } else {
    //Otherwise check if page has been visited before allowing navigation
    if (to.path !== routes.GET_STARTED.path && !pageStateService.isPageVisited(to.path)) {
      next({ path: routes.GET_STARTED.path });
    } else {
      // Catch-all (navigation)
      next();
    }
  }
});

export default router;
