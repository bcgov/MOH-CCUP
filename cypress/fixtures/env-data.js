import * as fixtureDataTest from "./data-test";
import * as fixtureDataDev from "./data-dev";

//api intercepts should always be enabled in the local environment so the build pipeline doesn't fail due to an API issue
//api intercepts are disabled in DEV/TEST by default
//this way these tests can actually check whether the APIs are working or not

const testYear = new Date().getFullYear() - 25;

const envData = {
  //Practitioner data will be assigned later
  //but the data will look a bit like this:
  // pracFirstName: "prac-first-name",
  // pracLastName: "prac-last-name",
  // pracNumber: "A1111",
  // payeeNumber: "B1111",

  //There will also be a property for enableIntercepts
  //enableIntercepts: false

  //one patient for before data clear, one for after data clear
  patients: [
    {
      adjFirstName: "adj-first-name",
      adjLastName: "adj-last-name",
      patientFirstInitial: "p",
      patientLastName: "patient-last-name",
      patientBirthdateMonth: "1",
      patientBirthdateDay: "11",
      patientBirthdateYear: testYear,
      patientPhn: "9999999998",
      uploadNote: "comment",
      //patientPhnFormatted: "9999 999 998" //this is programmatically assigned later
    },
    {
      adjFirstName: "new-adj-first-name",
      adjLastName: "new-adj-last-name",
      patientFirstInitial: "n",
      patientLastName: "new-patient-l-name",
      patientBirthdateMonth: "2",
      patientBirthdateDay: "22",
      patientBirthdateYear: testYear,
      patientPhn: "9999999966",
      uploadNote: "new comment",
      //patientPhnFormatted: "9999 999 998" //this is programmatically assigned later
    },
  ],
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

//add formatted Phn to the data for review table checks
envData.patients[0].patientPhnFormatted = formatPhn(envData.patients[0].patientPhn);
envData.patients[1].patientPhnFormatted = formatPhn(envData.patients[1].patientPhn);

export default envData;
