// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//

const samplePDF = "cypress/fixtures/sample.pdf";

Cypress.Commands.add("completeCaptcha", () => {
  cy.get("[data-cy=captchaInput]").type("irobot");
  cy.get("[data-cy=consentCheckbox]").click();
  cy.get("[data-cy=consentContinue]", {
    timeout: 20000,
  }).should("be.enabled");
  cy.get("[data-cy=consentContinue]").click();
});

Cypress.Commands.add("fillPatient", (patientData) => {
  cy.get("[data-cy=documents-categorydocuments-category-claim]").click({
    force: true,
  });
  cy.get("[data-cy=adjFirstName]").type(patientData.adjFirstName);
  cy.get("[data-cy=adjLastName]").type(patientData.adjLastName);

  cy.get("[data-cy=patientFirstInitial]").type(patientData.patientFirstInitial);
  cy.get("[data-cy=patientLastName]").type(patientData.patientLastName);
  cy.get("select")
    .find(`option[data-cy=patientBirthdateMonth${patientData.patientBirthdateMonth - 1}]`)
    .then(($el) => $el.get(0).setAttribute("selected", "selected"))
    .parent()
    .trigger("change");
  cy.get("[data-cy=patientBirthdateDay]").type(patientData.patientBirthdateDay);
  cy.get("[data-cy=patientBirthdateYear]").type(patientData.patientBirthdateYear);
  cy.get("[data-cy=patientPhn]").type(patientData.patientPhn);
});

Cypress.Commands.add("checkPatientPageDoesNotContain", (patientData) => {
  cy.get("[data-cy=adjFirstName]").should("not.have.value", patientData.adjFirstName);
  cy.get("[data-cy=adjLastName]").should("not.have.value", patientData.adjLastName);

  cy.get("[data-cy=patientFirstInitial]").should("not.have.value", patientData.patientFirstInitial);
  cy.get("[data-cy=patientLastName]").should("not.have.value", patientData.patientLastName);

  //skipping patient birth month for now because verifying selected drop downs gave me trouble in Cypress

  cy.get("[data-cy=patientBirthdateDay]").should("not.have.value", patientData.patientBirthdateDay);
  cy.get("[data-cy=patientBirthdateYear]").should(
    "not.have.value",
    patientData.patientBirthdateYear
  );
  cy.get("[data-cy=patientPhn]").should("not.have.value", patientData.patientPhn);
});

Cypress.Commands.add("checkUploadPageDoesContain", (patientData) => {
  cy.get("[data-cy=patientFirstInitial]").should("have.value", patientData.patientFirstInitial);
  cy.get("[data-cy=patientLastName]").should("have.value", patientData.patientLastName);
  cy.get("[data-cy=patientBirthdateDay]").should("have.value", patientData.patientBirthdateDay);
  cy.get("[data-cy=patientBirthdateYear]").should("have.value", patientData.patientBirthdateYear);
  cy.get("[data-cy=patientPhn]").should("have.value", patientData.patientPhnFormatted);
});

Cypress.Commands.add("uploadDocument", () => {
  cy.get("input#patient-support-documents").selectFile(samplePDF, { force: true });
  cy.get("#patient-support-documents")
    .parent()
    .within(() => {
      cy.get(".thumbnail-image-container", { timeout: 20000 }).first().should("exist");
    });
});

Cypress.Commands.add("checkReviewTable", (envData, patientIndex) => {
  //patient index should be 0 for the first time
  //then 1 for the second time after the data clear

  cy.get("[data-cy=reviewTablePracFirstName]").contains(envData.pracFirstName);
  cy.get("[data-cy=reviewTablePracLastName]").contains(envData.pracLastName);
  cy.get("[data-cy=reviewTablePayeeNumber]").contains(envData.payeeNumber);
  cy.get("[data-cy=reviewTablePatientSupportDocuments]").contains(2);
  cy.get("[data-cy=reviewTableUploadNote]").contains(envData.patients[patientIndex].uploadNote);
  //current state just checks that any radio button is checked
  //could refactor later if desired
  cy.get("[data-cy=documents-categorydocuments-category-claim]")
    .parent()
    .find("input")
    .should("be.checked");
  cy.get("[data-cy=reviewTableAdjFirstName]").contains(envData.patients[patientIndex].adjFirstName);
  cy.get("[data-cy=reviewTableAdjLastName]").contains(envData.patients[patientIndex].adjLastName);
  cy.get("[data-cy=reviewTablePatientFirstInitial]").contains(
    envData.patients[patientIndex].patientFirstInitial
  );
  cy.get("[data-cy=reviewTablePatientLastName]").contains(
    envData.patients[patientIndex].patientLastName
  );
  //birth date checks for length so it's not flaky if we change the date formatting later
  cy.get("[data-cy=reviewTablePatientBirthdate]").should("have.length.greaterThan", 0);
  cy.get("[data-cy=reviewTablePatientPhn]").contains(
    envData.patients[patientIndex].patientPhnFormatted
  );
});

// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
