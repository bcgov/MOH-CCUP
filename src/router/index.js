import { createRouter, createWebHistory } from "vue-router";
import GetStarted from "../views/GetStarted.vue";
import PatientInfo from "../views/PatientInfo.vue";
import UploadDocuments from "../views/UploadDocuments.vue";
import ReviewPage from "../views/ReviewPage.vue";
import SubmissionPage from "../views/SubmissionPage.vue";

export const routes = {
  GET_STARTED: {
    path: "/",
    title: "Practitioner information",
    name: "GetStarted",
    component: GetStarted,
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
  { ...routes.PATIENT_INFO },
  { ...routes.UPLOAD_DOCUMENTS },
  { ...routes.REVIEW_PAGE },
  { ...routes.SUBMISSION_PAGE },
];

export const routeStepOrder = [
  routes.GET_STARTED,
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
