import { createRouter, createWebHistory } from "vue-router";
import GetStarted from "../views/GetStarted.vue";
import PractitionerInfo from "../views/PractitionerInfo.vue";
import PatientInfo from "../views/PatientInfo.vue";
import UploadDocuments from "../views/UploadDocuments.vue";
import ReviewPage from "../views/ReviewPage.vue";
import SubmissionPage from "../views/SubmissionPage.vue";
import PractitionerUploadTool from "../views/PractitionerUploadTool.vue";

export const routes = {
  GET_STARTED: {
    path: "/",
    title: "Get Started",
    name: "GetStarted",
    component: GetStarted,
  },
  PRACTITIONER_INFO: {
    path: "/practitioner-info",
    title: "Practitioner Info",
    name: "PractitionerInfo",
    component: PractitionerInfo,
  },
  PRACTITIONER_UPLOAD_TOOL: {
    path: "/practitioner-upload-tool",
    title: "Practitioner Upload Tool",
    name: "PractitionerUploadTool",
    component: PractitionerUploadTool,
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
  { ...routes.GET_STARTED },
  { ...routes.PRACTITIONER_INFO },
  { ...routes.PRACTITIONER_UPLOAD_TOOL },
  { ...routes.PATIENT_INFO },
  { ...routes.UPLOAD_DOCUMENTS },
  { ...routes.REVIEW_PAGE },
  { ...routes.SUBMISSION_PAGE },
];

export const routeStepOrder = [
  routes.GET_STARTED,
  routes.PRACTITIONER_INFO,
  routes.PRACTITIONER_UPLOAD_TOOL,
  routes.PATIENT_INFO,
  routes.UPLOAD_DOCUMENTS,
  routes.REVIEW_PAGE,
  routes.SUBMISSION_PAGE,
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: "/",
    //   name: "home",
    //   component: HomeView,
    // },
    // {
    //   path: "/about",
    //   name: "about",
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import("../views/AboutView.vue"),
    // },
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
      path: "/practitioner-upload-tool",
      name: "PractitionerUploadTool",
      component: () => import("../views/PractitionerUploadTool.vue"),
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

export default router;
