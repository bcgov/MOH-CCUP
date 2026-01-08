import * as fixtureDataTest from "./data-test";
import * as fixtureDataDev from "./data-dev";

//api intercepts should always be enabled in the local environment so the build pipeline doesn't fail due to an API issue
//api intercepts are disabled in DEV/TEST by default
//this way these tests can actually check whether the APIs are working or not

const envData = {
  //Data-dev or data-test data will be assigned here

  //There will also be a property for enableIntercepts
  //enableIntercepts: false

  dataCenterNumber: "11111",
  contactPhoneNumber: "2501111111",
  preferredContactMethod: "fax",
  faxNumber: "2502222222",
  approximateClaimNumber: "2",
  approximateDollarValue: "200",
  feeItems: "11111, 22222",
  detailedExplanation: "aaaaa",
  individualPhn: "9999999998",
  individualServiceDate: "aaa",
  individualFeeItem: "222",
  claimComment: "comment",
};

if (Cypress.env("environment") === "test") {
  Object.assign(envData, fixtureDataTest);
  envData.enableIntercepts = false;
} else if (Cypress.env("environment") === "dev") {
  Object.assign(envData, fixtureDataDev);
  envData.enableIntercepts = false;
} else {
  //local environment
  Object.assign(envData, fixtureDataDev);
  envData.enableIntercepts = true;
}

//uncomment to force intercepts on or off (eg. while testing an API in local development )
// envData.enableIntercepts = false;

const formatPhn = (phn) => {
  const result = phn.substring(0, 4) + " " + phn.substring(4, 7) + " " + phn.substring(7, 10);

  return result;
};

const formatContactPhone = (phone) => {
  const result =
    "(" + phone.substring(0, 3) + ") " + phone.substring(4, 7) + "-" + phone.substring(7, 10);

  return result;
};

//add formatted Phn to the data for review table checks
envData.patients[0].patientPhnFormatted = formatPhn(envData.patients[0].patientPhn);
envData.patients[1].patientPhnFormatted = formatPhn(envData.patients[1].patientPhn);
envData.contactPhoneNumberFormatted = formatContactPhone(envData.contactPhoneNumber);

export default envData;
