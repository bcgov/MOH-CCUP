import { createRouter, createWebHistory } from "vue-router";
import pageStateService from "../services/page-state-service";

export const PRE_AUTH_AND_CLAIMS_BASE_URL = "/pre-auth-and-claims";
export const OVER_AGE_BASE_URL = "/over-age";
export const AUTH_IN_PROV_BASE_URL = "/auth-in-province";
export const CCUP_TITLE = "Claims Correspondence Upload Portal";
export const PRE_AUTH_AND_CLAIMS_TITLE = "Documents to support pre-authorization and claims";
export const OVER_AGE_TITLE = "Request for approval of over-age claims (HLTH 2943)";
export const AUTH_IN_PROV_TITLE =
  "Application for pre-authorization of payment: surgery for alteration of appearance (HLTH 2769)";

export const routes = {
  GET_STARTED: {
    path: "/",
    title: "Get Started",
    name: "GetStarted",
    component: () => import("@/views/GetStarted.vue"),
  },
  PRACTITIONER_INFO: {
    path: "/pre-auth-and-claims/practitioner-info",
    title: "Practitioner information",
    name: "PractitionerInfo",
    component: () => import("@/views/PractitionerInfo.vue"),
  },
  PATIENT_INFO: {
    path: "/pre-auth-and-claims/patient-info",
    title: "Patient Info",
    name: "PatientInfo",
    component: () => import("@/views/PatientInfo.vue"),
  },
  UPLOAD_DOCUMENTS: {
    path: "/pre-auth-and-claims/upload-documents",
    title: "Upload Documents",
    name: "UploadDocuments",
    component: () => import("@/views/UploadDocuments.vue"),
  },
  REVIEW_PAGE: {
    path: "/pre-auth-and-claims/review-page",
    title: "Review Page",
    name: "ReviewPage",
    component: () => import("@/views/ReviewPage.vue"),
  },
  SUBMISSION_PAGE: {
    path: "/pre-auth-and-claims/submission-page",
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
    title: "Documents upload",
    name: "OverAgeClaims",
    component: () => import("@/views/overAgeClaim/ClaimsInfo.vue"),
  },
  OVER_AGE_REVIEW_PAGE: {
    path: "/over-age-review",
    title: "Review and declaration",
    name: "OverAgeReview",
    component: () => import("@/views/overAgeClaim/ReviewPage.vue"),
  },
  OVER_AGE_SUBMISSION: {
    path: "/over-age-submission",
    title: "Submission",
    name: "OverAgeSubmission",
    component: () => import("@/views/overAgeClaim/SubmissionPage.vue"),
  },
  AUTH_IN_PROV_PATIENT_INFO: {
    path: "/auth-in-province-patient-info",
    title: "Patient Information",
    name: "AuthInProvincePatientInfo",
    component: () => import("@/views/authInProvince/PatientInfo.vue"),
  },
  AUTH_IN_PROV_MEDICAL: {
    path: "/auth-in-province-medical-info",
    title: "Medical Information",
    name: "AuthInProvinceMedicalInfo",
    component: () => import("@/views/authInProvince/MedicalInfo.vue"),
  },
  AUTH_IN_PROV_PRACTITIONER_INFO: {
    path: "/auth-in-province-practitioner-info",
    title: "Practitioner Information",
    name: "AuthInProvincePractitionerInfo",
    component: () => import("@/views/authInProvince/PractitionerInfo.vue"),
  },
  AUTH_IN_PROV_REVIEW_PAGE: {
    path: "/auth-in-province-review",
    title: "Review and declaration",
    name: "AuthInProvinceReview",
    component: () => import("@/views/authInProvince/ReviewPage.vue"),
  },
  AUTH_IN_PROV_SUBMISSION: {
    path: "/auth-in-province-submission",
    title: "Submission",
    name: "AuthInProvinceSubmission",
    component: () => import("@/views/authInProvince/SubmissionPage.vue"),
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

export const authInProvRoutes = [
  { ...routes.AUTH_IN_PROV_PATIENT_INFO },
  { ...routes.AUTH_IN_PROV_MEDICAL },
  { ...routes.AUTH_IN_PROV_PRACTITIONER_INFO },
  { ...routes.AUTH_IN_PROV_REVIEW_PAGE },
  { ...routes.AUTH_IN_PROV_SUBMISSION },
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

export const authInProvStepOrder = [
  routes.AUTH_IN_PROV_PATIENT_INFO,
  routes.AUTH_IN_PROV_MEDICAL,
  routes.AUTH_IN_PROV_PRACTITIONER_INFO,
  routes.AUTH_IN_PROV_REVIEW_PAGE,
  routes.AUTH_IN_PROV_SUBMISSION,
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
      path: "/pre-auth-and-claims/practitioner-info",
      name: "PractitionerInfo",
      component: () => import("../views/PractitionerInfo.vue"),
    },
    {
      path: "/pre-auth-and-claims/patient-info",
      name: "PatientInfo",
      component: () => import("../views/PatientInfo.vue"),
    },
    {
      path: "/pre-auth-and-claims/upload-documents",
      name: "UploadDocuments",
      component: () => import("../views/UploadDocuments.vue"),
    },
    {
      path: "/pre-auth-and-claims/review-page",
      name: "ReviewPage",
      component: () => import("../views/ReviewPage.vue"),
    },
    {
      path: "/pre-auth-and-claims/submission-page",
      name: "SubmissionPage",
      component: () => import("../views/SubmissionPage.vue"),
    },
    {
      path: "/over-age-practitioner",
      title: "Practitioner information",
      name: "OverAgePractitioner",
      component: () => import("@/views/overAgeClaim/PractitionerInfo.vue"),
    },
    {
      path: "/over-age-claims",
      title: "Documents upload",
      name: "OverAgeClaims",
      component: () => import("@/views/overAgeClaim/ClaimsInfo.vue"),
    },
    {
      path: "/over-age-review",
      title: "Review and declaration",
      name: "OverAgeReview",
      component: () => import("@/views/overAgeClaim/ReviewPage.vue"),
    },
    {
      path: "/over-age-submission",
      title: "Submission",
      name: "OverAgeSubmission",
      component: () => import("@/views/overAgeClaim/SubmissionPage.vue"),
    },
    {
      path: "/auth-in-province-patient-info",
      title: "Pre-authorization of Payment Patient Information",
      name: "AuthInProvincePatientInfo",
      component: () => import("@/views/authInProvince/PatientInfo.vue"),
    },
    {
      path: "/auth-in-province-medical-info",
      title: "Pre-authorization of Payment Medical Information",
      name: "AuthInProvinceMedicalInfo",
      component: () => import("@/views/authInProvince/MedicalInfo.vue"),
    },
    {
      path: "/auth-in-province-practitioner-info",
      title: "Pre-authorization of Payment Practitioner Information",
      name: "AuthInProvincePractitionerInfo",
      component: () => import("@/views/authInProvince/PractitionerInfo.vue"),
    },
    {
      path: "/auth-in-province-review",
      title: "Pre-authorization of Payment Review",
      name: "AuthInProvinceReview",
      component: () => import("@/views/authInProvince/ReviewPage.vue"),
    },
    {
      path: "/auth-in-province-submission",
      title: "Pre-authorization of Payment Submission",
      name: "AuthInProvinceSubmission",
      component: () => import("@/views/authInProvince/SubmissionPage.vue"),
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

export const isAuthInProvPath = (toPath, fromPath) => {
  for (let i = 0; i < authInProvStepOrder.length; i++) {
    if (authInProvStepOrder[i].path === fromPath) {
      return false;
    } else if (authInProvStepOrder[i].path === toPath) {
      return true;
    }
  }
  return false;
};

pageStateService.importPageRoutes(routes);

router.beforeEach((to, from, next) => {
  // If navigation destination is maintenance page, allow it
  if (to.path === routes.MAINTENANCE_PAGE.path) {
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
