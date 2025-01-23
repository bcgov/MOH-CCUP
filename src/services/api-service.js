import axios from "axios";
import {
  formatISODate,
  stripSpaces,
  //   replaceSpecialCharacters,
} from "common-lib-vue";
// import { firstNameMaxLength, lastNameMaxLength } from "@/constants/html-validations.js";
import { v4 as uuidv4 } from "uuid";

const BASE_API_PATH = "/ccup/api";
const VALIDATE_PRACTITIONER_URL = `${BASE_API_PATH}/claims.supportDocIntegration/validatePractitioner`;
const VALIDATE_PATIENT_URL = `${BASE_API_PATH}/claims.supportDocIntegration/validatePerson`;

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
