import axios from "axios";
import {
  formatISODate,
  stripSpaces,
  //   replaceSpecialCharacters,
} from "common-lib-vue";
// import { firstNameMaxLength, lastNameMaxLength } from "@/constants/html-validations.js";
import { v4 as uuidv4 } from "uuid";
import { declarationAccuracy, declarationValidity } from "@/constants/declarations.js";

const BASE_API_PATH = "/ccup/api";
const VALIDATE_PRACTITIONER_URL = `${BASE_API_PATH}/claims.supportDocIntegration/validatePractitioner`;
const VALIDATE_PATIENT_URL = `${BASE_API_PATH}/claims.supportDocIntegration/validatePerson`;
const SUBMIT_FORM_URL = `${BASE_API_PATH}/claims.supportDocIntegration/submitForm`;

class ApiService {
  validatePractitioner(formStore) {
    const applicationUuid = formStore.captcha.applicationUuid;
    const captchaToken = formStore.captcha.captchaToken;

    const jsonPayload = {
      applicationUuid: applicationUuid,
      requestUuid: uuidv4(),
      firstName: formStore.formFields.practitioner.pracFirstName,
      lastName: formStore.formFields.practitioner.pracLastName,
      number: formStore.formFields.practitioner.pracNumber,
      doctor: true,
    };
    const headers = this._getHeaders(captchaToken);

    return this._sendPostRequest(
      `${VALIDATE_PRACTITIONER_URL}/${applicationUuid}`,
      jsonPayload,
      headers
    );
  }

  validatePatient(formStore) {
    const applicationUuid = formStore.captcha.applicationUuid;
    const captchaToken = formStore.captcha.captchaToken;

    const jsonPayload = {
      uuid: applicationUuid,
      person: {
        lastName: formStore.formFields.patient.patientLastName,
        firstName: formStore.formFields.patient.patientFirstInitial,
        phn: stripSpaces(formStore.formFields.patient.patientPhn),
        birthDate: formatISODate(formStore.formFields.patient.patientBirthdate),
      },
    };
    const headers = this._getHeaders(captchaToken);

    return this._sendPostRequest(
      `${VALIDATE_PATIENT_URL}/${applicationUuid}`,
      jsonPayload,
      headers
    );
  }

  submitForm(formStore) {
    const applicationUuid = formStore.captcha.applicationUuid;
    const captchaToken = formStore.captcha.captchaToken;

    const jsonPayload = {
      applicationId: applicationUuid,
      submissionDate: formatISODate(new Date()),
      practitionerFirstName: formStore.formFields.practitioner.pracFirstName,
      practitionerLastName: formStore.formFields.practitioner.pracLastName,
      practitionerNumber: formStore.formFields.practitioner.pracNumber,
      practitionerPayeeNumber: formStore.formFields.practitioner.payeeNumber,
      patientFirstInitial: formStore.formFields.patient.patientFirstInitial[0],
      patientLastName: formStore.formFields.patient.patientLastName,
      patientPhn: stripSpaces(formStore.formFields.patient.patientPhn),
      patientBirthDate: formatISODate(formStore.formFields.patient.patientBirthdate),
      adjudicatorFirstName: formStore.formFields.patient.adjFirstName,
      adjudicatorLastName: formStore.formFields.patient.adjLastName,
      declaration1: declarationAccuracy,
      declaration2: declarationValidity,
      supportingDocumentsFor: formStore.formFields.patient.documentsCategory,
    };
    const headers = this._getHeaders(captchaToken);

    return this._sendPostRequest(`${SUBMIT_FORM_URL}/${applicationUuid}`, jsonPayload, headers);
  }

  _getHeaders(token) {
    return {
      "Content-Type": "application/json",
      "Response-Type": "application/json",
      "X-Authorization": "Bearer " + token,
    };
  }
  _sendPostRequest(url, payload, headers) {
    return axios.post(url, payload, { headers });
  }
}

export default new ApiService();
