import envData from "../fixtures/env-data.js";

const samplePDF = "cypress/fixtures/sample.pdf";
// NOTE: using cy.fixture for the sample pdf multiple times has issues, using dir works better with selectFile

const testDate = new Date();
const testYear = testDate.getFullYear() - 1;
const testMonth = testDate.getMonth();

describe("happy path doc submission", () => {
  it("completes the happy path for document submission", () => {
    // Get Started Page
    cy.visit("/");
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ccup/");
    });
    cy.completeCaptcha();
    cy.get("[data-cy=upload-portal-optionsupload-portal-over-age-claims]").click({
      force: true,
    });
    cy.get("[data-cy=continue-bar]").click();

    // Practitioner information
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ccup/over-age-practitioner");
    });
    cy.get("[data-cy=pracFirstName]").type(envData.pracFirstName);
    cy.get("[data-cy=pracLastName]").type(envData.pracLastName);
    cy.get("[data-cy=pracNumber]").type(envData.pracNumber);
    cy.get("[data-cy=payeeNumber]").type(envData.payeeNumber);
    cy.get("[data-cy=dataCenterNumber]").type(envData.dataCenterNumber);
    cy.get("[data-cy=contactPhoneNumber]").type(envData.contactPhoneNumber);
    cy.get("[data-cy=preferred-contact-methodpreferred-contact-method-fax]").click({
      force: true,
    });
    cy.get("[data-cy=faxNumber]").type(envData.faxNumber);
    cy.get("[data-cy=continue-bar]").click();

    //Claims information
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ccup/over-age-claims");
    });
    cy.get("[data-cy=date-typedate-type-date]").click({
      force: true,
    });
    cy.get("select")
      .find(`option[data-cy=claim-service-dateMonth${testMonth}]`)
      .then(($el) => $el.get(0).setAttribute("selected", "selected"))
      .parent()
      .trigger("change");
    cy.get("[data-cy=claim-service-dateDay]").type("11");
    cy.get("[data-cy=claim-service-dateYear]").type(testYear);
    cy.get("[data-cy=date-typedate-type-range]").click({
      force: true,
    });
    cy.get("select")
      .find(`option[data-cy=claim-from-dateMonth${testMonth}]`)
      .then(($el) => $el.get(0).setAttribute("selected", "selected"))
      .parent()
      .trigger("change");
    cy.get("[data-cy=claim-from-dateDay]").type("12");
    cy.get("[data-cy=claim-from-dateYear]").type(testYear);
    cy.get("select")
      .find(`option[data-cy=claim-to-dateMonth${testMonth}]`)
      .then(($el) => $el.get(0).setAttribute("selected", "selected"))
      .parent()
      .trigger("change");
    cy.get("[data-cy=claim-to-dateDay]").type("13");
    cy.get("[data-cy=claim-to-dateYear]").type(testYear);
    cy.get("[data-cy=approximate-claim-number]").type(envData.approximateClaimNumber);
    cy.get("[data-cy=approximate-dollar-value]").type(envData.approximateDollarValue);
    cy.get("[data-cy=fee-items]").type(envData.feeItems);
    cy.get("[data-cy=detailed-explanation]").type(envData.detailedExplanation);
    cy.get("[data-cy=phn-0]").type("9999999998");
    cy.get("select")
      .find(`option[data-cy=individual-service-date-0Month${testMonth}]`)
      .then(($el) => $el.get(0).setAttribute("selected", "selected"))
      .parent()
      .trigger("change");
    cy.get("[data-cy=individual-service-date-0Day]").type("12");
    cy.get("[data-cy=individual-service-date-0Year]").type(testYear);
    cy.get("[data-cy=fee-item-0]").type("111");
    cy.get("[data-cy=add-individual]").click();
    cy.get("[data-cy=phn-1]").type(envData.individualPhn);
    cy.get("select")
      .find(`option[data-cy=individual-service-date-1Month${testMonth}]`)
      .then(($el) => $el.get(0).setAttribute("selected", "selected"))
      .parent()
      .trigger("change");
    cy.get("[data-cy=individual-service-date-1Day]").type("14");
    cy.get("[data-cy=individual-service-date-1Year]").type(testYear);
    cy.get("[data-cy=fee-item-1]").type(envData.individualFeeItem);
    cy.get("[data-cy=delete-individual-0]").click();
    cy.get("input#claim-support-documents").selectFile(samplePDF, { force: true });
    cy.get("#claim-support-documents")
      .parent()
      .within(() => {
        cy.get(".thumbnail-image-container", { timeout: 30000 }).first().should("exist");
      });
    cy.get("[data-cy=claim-comment]").type(envData.claimComment);
    cy.get("[data-cy=continue-bar]").click();

    //Review page
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ccup/over-age-review");
    });

    //Review page-- Practitioner information
    cy.get("[data-cy=reviewTablePracFirstName]").should("contain", envData.pracFirstName);
    cy.get("[data-cy=reviewTablePracLastName]").should("contain", envData.pracLastName);
    cy.get("[data-cy=reviewTablePracNumber]").should("contain", envData.pracNumber);
    cy.get("[data-cy=reviewTablePayeeNumber]").should("contain", envData.payeeNumber);
    cy.get("[data-cy=reviewTableDataCenterNumber]").should("contain", envData.dataCenterNumber);
    cy.get("[data-cy=reviewTableContactPhoneNumber]").should(
      "contain",
      envData.contactPhoneNumberFormatted
    );
    cy.get("[data-cy=reviewTablePreferredContactMethod]").should(
      "contain",
      envData.preferredContactMethod
    );

    //Review page-- Claims information
    cy.get("[data-cy=reviewTableDateType]").should("contain", "range");

    //Review page-- check service date
    cy.get("body").find("[data-cy=reviewTableServiceDate]").should("not.exist");
    cy.get("[data-cy=reviewTableClaimFromDate]").should(
      "contain",
      new Date(testYear, testMonth, 12).toDateString()
    );
    cy.get("[data-cy=reviewTableClaimToDate]").should(
      "contain",
      new Date(testYear, testMonth, 13).toDateString()
    );

    //go back to previous page to update service date
    cy.get("[data-cy=backButton]").click();
    cy.get("[data-cy=date-typedate-type-date]").click({
      force: true,
    });
    cy.get("[data-cy=continue-bar]").click();

    cy.get("body").find("[data-cy=reviewTableClaimFromDate]").should("not.exist");
    cy.get("body").find("[data-cy=reviewTableClaimToDate]").should("not.exist");
    // date-typedate-type-date

    cy.get("[data-cy=reviewTableServiceDate]").should(
      "contain",
      new Date(testYear, testMonth, 11).toDateString()
    );
    cy.get("[data-cy=reviewTableApproximateClaimNumber]").should(
      "contain",
      envData.approximateClaimNumber
    );
    cy.get("[data-cy=reviewTableApproximateDollarValue]").should(
      "contain",
      envData.approximateDollarValue
    );
    cy.get("[data-cy=reviewTableFeeItems]").should("contain", envData.feeItems);
    cy.get("[data-cy=reviewTableDetailedExplanation]").should(
      "contain",
      envData.detailedExplanation
    );
    cy.get("[data-cy=individual-phn-0]").should("contain", envData.individualPhnFormatted);
    cy.get("[data-cy=individual-service-date-0]").should(
      "contain",
      new Date(testYear, testMonth, 14).toDateString()
    );
    cy.get("[data-cy=individual-fee-item-0]").should("contain", envData.individualFeeItem);
    cy.get("[data-cy=reviewTableClaimSupportDocuments]").should("contain", "2");
    cy.get("[data-cy=reviewTableClaimComment]").should("contain", envData.claimComment);
    cy.get("[data-cy=isDeclarationAccuracy]").check({ force: true });
    cy.get("[data-cy=continue-bar]").click();

    //Submission page
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ccup/over-age-submission");
    });

    //Submission page-- Practitioner information
    cy.get("[data-cy=reviewTablePracFirstName]").should("contain", envData.pracFirstName);
    cy.get("[data-cy=reviewTablePracLastName]").should("contain", envData.pracLastName);
    cy.get("[data-cy=reviewTablePracNumber]").should("contain", envData.pracNumber);
    cy.get("[data-cy=reviewTablePayeeNumber]").should("contain", envData.payeeNumber);
    cy.get("[data-cy=reviewTableDataCenterNumber]").should("contain", envData.dataCenterNumber);
    cy.get("[data-cy=reviewTableContactPhoneNumber]").should(
      "contain",
      envData.contactPhoneNumberFormatted
    );
    cy.get("[data-cy=reviewTablePreferredContactMethod]").should(
      "contain",
      envData.preferredContactMethod
    );

    //Submission page-- Claims information
    cy.get("[data-cy=reviewTableDateType]").should("contain", "date");

    cy.get("[data-cy=reviewTableServiceDate]").should(
      "contain",
      new Date(testYear, testMonth, 11).toDateString()
    );
    cy.get("body").find("[data-cy=reviewTableClaimFromDate]").should("not.exist");
    cy.get("body").find("[data-cy=reviewTableClaimToDate]").should("not.exist");

    cy.get("[data-cy=reviewTableApproximateClaimNumber]").should(
      "contain",
      envData.approximateClaimNumber
    );
    cy.get("[data-cy=reviewTableApproximateDollarValue]").should(
      "contain",
      envData.approximateDollarValue
    );
    cy.get("[data-cy=reviewTableFeeItems]").should("contain", envData.feeItems);
    cy.get("[data-cy=reviewTableDetailedExplanation]").should(
      "contain",
      envData.detailedExplanation
    );
    cy.get("[data-cy=individual-phn-0]").should("contain", envData.individualPhnFormatted);
    cy.get("[data-cy=individual-service-date-0]").should(
      "contain",
      new Date(testYear, testMonth, 14).toDateString()
    );
    cy.get("[data-cy=individual-fee-item-0]").should("contain", envData.individualFeeItem);
    cy.get("[data-cy=reviewTableClaimSupportDocuments]").should("contain", "2");
    cy.get("[data-cy=reviewTableClaimComment]").should("contain", envData.claimComment);
  });
});
