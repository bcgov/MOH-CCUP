import axios from "axios";
import { formatISODate, stripSpaces, stripPhoneFormatting } from "common-lib-vue";
import { v4 as uuidv4 } from "uuid";
import { declarationAccuracy, declarationValidity } from "@/constants/declarations.js";

const BASE_API_PATH = "/ccup/api";
const VALIDATE_PRACTITIONER_URL = `${BASE_API_PATH}/claims.supportDocIntegration/validatePractitioner`;
const VALIDATE_PATIENT_URL = `${BASE_API_PATH}/claims.supportDocIntegration/validatePerson`;
const SUBMIT_FORM_URL = `${BASE_API_PATH}/claims.supportDocIntegration/submitForm`;
const SUBMIT_OVERAGE_FORM_URL = `${BASE_API_PATH}/claims.supportDocIntegration/submitFormA`;
const SUBMIT_ATTACHMENT_URL = `${BASE_API_PATH}/submit-attachment`;

class ApiService {
  validatePractitioner(formStore, captchaStore) {
    const applicationUuid = captchaStore.applicationUuid;
    const captchaToken = captchaStore.captchaToken;

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

  validatePatient(formStore, captchaStore) {
    const applicationUuid = captchaStore.applicationUuid;
    const captchaToken = captchaStore.captchaToken;

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

  sendAttachments(documents, captchaStore) {
    //create an array containing individual promises for each image upload
    const promises = [];

    documents.forEach((image) => {
      promises.push(this._sendAttachment(image, captchaStore));
    });

    //then try to resolve them all at once in one promise
    //if any of the promises reject, the whole sendAttachments() call will trigger an error
    return Promise.all(promises);
  }

  _formatIndividuals(individuals) {
    let results = [];
    if (!individuals || individuals.length === 0) {
      return results;
    }

    for (const individual of individuals) {
      results.push({
        individualClaimDate: formatISODate(individual.individualServiceDate),
        phn: stripSpaces(individual.phn),
        // feeItem: individual.individualFeeItem,
      });
    }

    return results;
  }

  _formatAttachments(attachments) {
    const formattedAttachments = [];

    if (!attachments || attachments.length === 0) {
      return formattedAttachments;
    }

    for (let i = 0; i < attachments.length; i++) {
      formattedAttachments.push({
        attachmentDocumentType: "SUPPORTDOCUMENT",
        attachmentUuid: attachments[i].uuid,
        attachmentOrder: i,
      });
    }

    return formattedAttachments;
  }

  /**
   * Submit OverAge claims
   *
   * @param {*} formStore
   * @param {*} captchaStore
   * @returns
   */
  submitOverAgeForm(formFields, captchaStore) {
    const captchaToken = captchaStore.captchaToken;

    const attachments = this._formatAttachments(formFields.claimsInformation.claimSupportDocuments);
    const individuals = this._formatIndividuals(formFields.claimsInformation.individuals);

    const dateType = formFields.claimsInformation.dateType;
    let claimFromDate = formatISODate(formFields.claimsInformation.claimFromDate) || null;
    let claimToDate = formatISODate(formFields.claimsInformation.claimToDate) || null;
    const claimServiceDate = formatISODate(formFields.claimsInformation.claimServiceDate);
    claimFromDate = dateType == "date" ? claimServiceDate : claimFromDate;
    claimToDate = dateType == "date" ? claimServiceDate : claimToDate;

    const payload = {
      applicationId: captchaStore.applicationUuid,
      submissionDate: formatISODate(new Date()),

      practitionerFirstName: formFields.practitioner.pracFirstName,
      practitionerLastName: formFields.practitioner.pracLastName,
      practitionerNumber: formFields.practitioner.pracNumber,
      practitionerPayeeNumber: formFields.practitioner.payeeNumber,
      dataCenterNumber: formFields.practitioner.dataCenterNumber || undefined,
      contactPhoneNumber:
        stripPhoneFormatting(formFields.practitioner.contactPhoneNumber) || undefined,
      preferredContactMethod: formFields.practitioner.preferredContactMethod || undefined,
      faxNumber: stripPhoneFormatting(formFields.practitioner.faxNumber) || undefined,

      dateType: formFields.claimsInformation.dateType || undefined,
      claimFromDate,
      claimToDate,

      approximateClaimNumber: formFields.claimsInformation.approximateClaimNumber || undefined,
      approximateDollarValue: formFields.claimsInformation.approximateDollarValue || undefined,
      feeItems: formFields.claimsInformation.feeItems || undefined,
      detailedExplanation: formFields.claimsInformation.detailedExplanation || undefined,

      declaration1: declarationAccuracy,
      declaration2: declarationValidity,
      // signature: "Y",
      supportingDocumentsFor: "OVERAGE",

      individuals,
      attachments,
    };

    const headers = this._getHeaders(captchaToken);
    return this._sendPostRequest(
      `${SUBMIT_OVERAGE_FORM_URL}/${captchaStore.applicationUuid}`,
      payload,
      headers
    );
  }

  /*
   * Submit Pre-auth & Regular Claims
   *
   * @param {*} formStore
   * @param {*} captchaStore
   * @returns
   */
  submitForm(formStore, captchaStore) {
    const captchaToken = captchaStore.captchaToken;

    //the database stored procedure checks for these two keywords in order to sort documents
    //so the API payloads need to match them exactly
    let supportingDocumentsCode;
    if (formStore.formFields.patient.documentsCategory === "pre-auth") {
      supportingDocumentsCode = "PREAUTHORIZATION";
    } else {
      supportingDocumentsCode = "CORRESPONDENCE";
    }

    const finalAttachments = this._formatAttachments(
      formStore.formFields.upload.patientSupportDocuments
    );

    const jsonPayload = {
      applicationId: captchaStore.applicationUuid,
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
      supportingDocumentsFor: supportingDocumentsCode,
      attachments: finalAttachments,
    };
    const headers = this._getHeaders(captchaToken);

    return this._sendPostRequest(
      `${SUBMIT_FORM_URL}/${captchaStore.applicationUuid}`,
      jsonPayload,
      headers
    );
  }

  _sendAttachment(image, captchaStore) {
    const programArea = "claims";
    const docType = "SupportDocument";

    const url = `${SUBMIT_ATTACHMENT_URL}/${captchaStore.applicationUuid}/attachments/${image.uuid}?programarea=${programArea}&attachmentDocumentType=${docType}&contentType=image/jpeg&imageSize=${image.size}`;
    const headers = this._getAttachmentHeaders(captchaStore.captchaToken);
    let blob;

    //the file uploader component stores the uploaded image data in the Vue store data as a JSON string
    //this code converts that string to a blob so the API can handle it

    if (image && typeof image.source === "string") {
      const binary = atob(image.source.split(",")[1]);
      const chars = [];
      for (let i = 0; i < binary.length; i++) {
        chars.push(binary.charCodeAt(i));
      }
      blob = new Blob([new Uint8Array(chars)], {
        type: "image/jpeg",
      });
    }

    //then we return a promise that resolves if the image upload call is successful
    //or rejects if it catches an error or receives a returnCode other than "success"

    return new Promise((resolve, reject) => {
      this._sendPostRequest(url, blob, headers)
        .then((response) => {
          if (response && response.data && response.data.returnCode === "success") {
            resolve(response.data);
          } else {
            reject({
              imageUuid: image && image.uuid,
              size: image && image.size,
              programArea,
              docType,
              token: captchaStore.captchaToken,
              // getting status in ReviewPage.vue depends on response.data.response being under error.response
              response: response && response.data && response.data.response,
              // actual response from individual post request for extra detail
              _response: response,
            });
          }
        })
        .catch((error) => {
          reject({
            imageUuid: image && image.uuid,
            size: image && image.size,
            programArea,
            docType,
            token: captchaStore.captchaToken,
            error,
          });
        });
    });
  }

  _getHeaders(token) {
    return {
      "Content-Type": "application/json",
      "Response-Type": "application/json",
      "X-Authorization": "Bearer " + token,
    };
  }

  _getAttachmentHeaders(token) {
    return {
      "Content-Type": "image/jpeg",
      "Response-Type": "application/json",
      "X-Authorization": "Bearer " + token,
    };
  }

  _sendPostRequest(url, payload, headers) {
    return axios.post(url, payload, { headers });
  }
}

export default new ApiService();
