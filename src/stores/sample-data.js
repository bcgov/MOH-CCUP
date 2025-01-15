const sampleData = {
  practitioner: {
    pracFirstName: "RVWUJY",
    pracLastName: "ABABML",
    pracNumber: "J5868",
    payeeNumber: "J5868",
  },
  patient: {
    documentsCategory: "claims",
    patientBirthdate: new Date("2000-01-01"),
    patientFirstInitial: "a",
    patientLastName: "patient-last-name",
    patientPhn: "9999 999 998",
    adjFirstName: "adj-first-name",
    adjLastName: "adj-last-name",
  },
  upload: {
    uploadNote: "upload-note",
    patientSupportDocuments: [{}],
  },
  review: {
    isDeclarationAccuracy: null,
  },
};

export default sampleData;
