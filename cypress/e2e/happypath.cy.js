import envData from "../fixtures/env-data.js";
// NOTE: using cy.fixture for the sample pdf multiple times has issues, using dir works better with selectFile

describe("happy path", () => {
  it("completes the happy path", () => {
    cy.visit("/");
    cy.location().should((loc) => {
      expect(loc.href).to.eq(Cypress.config("baseUrl"));
      expect(loc.pathname).to.eq("/ccup/");
    });
    cy.completeCaptcha();

    //Practitoner info
    cy.get("[data-cy=pracFirstName]").type(envData.pracFirstName);
    cy.get("[data-cy=pracLastName]").type(envData.pracLastName);
    cy.get("[data-cy=pracNumber]").type(envData.pracNumber);
    cy.get("[data-cy=payeeNumber]").type(envData.payeeNumber);

    if (envData.enableIntercepts) {
      console.log("intercepted validatePractitioner call with 200 OK response");
      cy.intercept("POST", "/ccup/api/**", {
        statusCode: 200,
        body: {
          returnCode: "0",
          testfield: "This is a stubbed test response from Cypress",
        },
      });
    }

    cy.get("[data-cy=continue-bar]").click();

    //Patient info
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ccup/patient-info");
    });
    cy.fillPatient(envData.patients[0]);
    cy.get("[data-cy=continue-bar]").click();

    //Upload documents
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ccup/upload-documents");
    });
    cy.checkUploadPageDoesContain(envData.patients[0]);
    cy.uploadDocument();

    cy.get("[data-cy=uploadNote]").type(envData.patients[0].uploadNote);
    cy.get("[data-cy=continue-bar]").click();

    //Review page
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ccup/review-page");
    });
    cy.checkReviewTable(envData, 0);
    cy.get("[data-cy=isDeclarationAccuracy]").check({ force: true });
    cy.get("[data-cy=continue-bar]").click();

    //Submission page
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ccup/submission-page");
    });
    cy.checkReviewTable(envData, 0);
    cy.get("[data-cy=UploadNewPatient]").click();

    //After Clear -- Patient Info
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ccup/patient-info");
    });
    cy.checkPatientPageDoesNotContain(envData.patients[0]);
    cy.fillPatient(envData.patients[1]);
    cy.get("[data-cy=continue-bar]").click();

    //After Clear -- Upload documents
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ccup/upload-documents");
    });
    cy.checkUploadPageDoesContain(envData.patients[1]);
    cy.uploadDocument();
    cy.get("[data-cy=uploadNote]").type(envData.patients[1].uploadNote);
    cy.get("[data-cy=continue-bar]").click();

    //Review page
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ccup/review-page");
    });
    cy.checkReviewTable(envData, 1);
    cy.get("[data-cy=isDeclarationAccuracy]").check({ force: true });
    cy.get("[data-cy=continue-bar]").click();

    //Submission page
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ccup/submission-page");
    });
    cy.checkReviewTable(envData, 1);
  });
});
