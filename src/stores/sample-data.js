const sampleData = {
  practitioner: {
    pracFirstName: "RVWUJY",
    pracLastName: "ABABML",
    pracNumber: "J5868",
    payeeNumber: "J5868",
  },
  patient: {
    documentsCategory: "claims",
    patientBirthdate: new Date("1965-05-13 00:00:00"), //timestamp required so the app doesn't subtract a day due to timezones
    patientFirstInitial: "J", //Bazcqt
    patientLastName: "CAFEXD",
    patientPhn: "9373 158 557",
    adjFirstName: "adj-first-name",
    adjLastName: "adj-last-name",
  },
  upload: {
    uploadNote: "upload-note",
    // uncomment this line to auto-fill file uploader
    // patientSupportDocuments: [{}],
  },
  review: {
    isDeclarationAccuracy: null,
  },
};

export default sampleData;
