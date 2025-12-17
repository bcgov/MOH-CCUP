import envData from "../fixtures/env-data.js";
// NOTE: using cy.fixture for the sample pdf multiple times has issues, using dir works better with selectFile

describe("navigation guards", () => {
  it("successfully navigates to the correct page in different circumstances", () => {
    cy.visit("/");
    cy.location().should((loc) => {
      expect(loc.href).to.eq(Cypress.config("baseUrl"));
      expect(loc.pathname).to.eq("/ccup/");
    });

    cy.visit("/practitioner-info");
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ccup/");
    });

    cy.visit("/patient-info");
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ccup/");
    });

    cy.visit("/upload-documents");
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ccup/");
    });

    cy.visit("/review-page");
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ccup/");
    });

    cy.visit("/submission-page");
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ccup/");
    });

    cy.visit("/over-age-practitioner");
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ccup/");
    });

    cy.visit("/over-age-claims");
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ccup/");
    });

    cy.visit("/over-age-review");
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ccup/");
    });

    cy.visit("/over-age-submission");
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ccup/");
    });

    cy.visit("/auth-in-province-medical-info");
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ccup/");
    });

    // Choosing Pre Auth and Claims form
    cy.completeCaptcha();
    cy.get("[data-cy=upload-portal-optionsupload-portal-pre-auth-and-claims]").click({
      force: true,
    });
    cy.get("[data-cy=continue-bar]").click();

    //Practitoner info
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ccup/practitioner-info");
    });
    cy.get("[data-cy=pracFirstName]").type(envData.pracFirstName);
    cy.get("[data-cy=pracLastName]").type(envData.pracLastName);
    cy.get("[data-cy=pracNumber]").type(envData.pracNumber);
    cy.get("[data-cy=payeeNumber]").type(envData.payeeNumber);

    if (envData.enableIntercepts) {
      console.log("intercepted validatePractitioner call with 200 OK response");
      cy.intercept("POST", "/ccup/api/claims.supportDocIntegration/validatePractitioner/*", {
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

    if (envData.enableIntercepts) {
      console.log("intercepted validatePerson call with 200 OK response");
      cy.intercept("POST", "/ccup/api/claims.supportDocIntegration/validatePerson/*", {
        statusCode: 200,
        body: {
          returnCode: "success",
          testfield: "This is a stubbed test response from Cypress",
        },
      });
    }

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

    if (envData.enableIntercepts) {
      console.log("intercepted submit-attachment call with 200 OK response");
      cy.intercept("POST", "/ccup/api/submit-attachment/**", {
        statusCode: 200,
        body: {
          returnCode: "success",
          testfield: "This is a stubbed test response from Cypress",
        },
      });
    }

    if (envData.enableIntercepts) {
      console.log("intercepted validatePerson call with 200 OK response");
      cy.intercept("POST", "/ccup/api/claims.supportDocIntegration/submitForm/*", {
        statusCode: 200,
        body: {
          returnCode: "success",
          testfield: "This is a stubbed test response from Cypress",
        },
      });
    }
    cy.get("[data-cy=continue-bar]").click();

    //Submission page
    cy.location({ timeout: 30000 }).should((loc) => {
      expect(loc.pathname).to.eq("/ccup/submission-page");
    });

    // Verify successful navigation going backwards
    cy.go(-1);
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ccup/review-page");
    });

    cy.get("[data-cy=backButton]").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ccup/upload-documents");
    });

    cy.get("[data-cy=backButton]").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ccup/patient-info");
    });

    cy.get("[data-cy=backButton]").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ccup/practitioner-info");
    });

    // // The rest of these tests only work if you temporarily add RouterLinks to the application
    // // This is because Cypress reloads the page when you use cy.visit()-- not compatible with single page applications
    // // Here's what I put in the App.vue file:
    // <RouterLink to="/" data-cy="cucumber1"> Go to 1</RouterLink>
    // <RouterLink to="/patient-info" data-cy="cucumber2"> Go to 2</RouterLink>
    // <RouterLink to="/upload-documents" data-cy="cucumber3"> Go to 3</RouterLink>
    // <RouterLink to="/review-page" data-cy="cucumber4">Go to 4</RouterLink>
    // <RouterLink to="/submission-page" data-cy="cucumber5">Go to 5</RouterLink>

    // // Check forward guard one more time
    // cy.get("[data-cy=cucumber1]").click();
    // cy.go(-3);
    // cy.location().should((loc) => {
    //   expect(loc.pathname).to.eq("/ccup/");
    // });

    // // cy.get("[data-cy=cucumber2]").click();
    // cy.location().should((loc) => {
    //   expect(loc.pathname).to.eq("/ccup/");
    // });
    // // cy.get("[data-cy=cucumber3]").click();
    // cy.location().should((loc) => {
    //   expect(loc.pathname).to.eq("/ccup/");
    // });
    // // cy.get("[data-cy=cucumber4]").click();
    // cy.location().should((loc) => {
    //   expect(loc.pathname).to.eq("/ccup/");
    // });
    // // cy.get("[data-cy=cucumber5]").click();
    // cy.location().should((loc) => {
    //   expect(loc.pathname).to.eq("/ccup/");
    // });

    // //Navigate back to final page for clearData link
    // cy.get("[data-cy=continue-bar]").click();
    // cy.location().should((loc) => {
    //   expect(loc.pathname).to.eq("/ccup/patient-info");
    // });
    // cy.get("[data-cy=continue-bar]").click();
    // cy.location().should((loc) => {
    //   expect(loc.pathname).to.eq("/ccup/upload-documents");
    // });
    // cy.get("[data-cy=continue-bar]").click();
    // cy.location().should((loc) => {
    //   expect(loc.pathname).to.eq("/ccup/review-page");
    // });
    // cy.get("[data-cy=continue-bar]").click();
    // cy.location().should((loc) => {
    //   expect(loc.pathname).to.eq("/ccup/submission-page");
    // });

    // //Clear patient data
    // cy.get("[data-cy=UploadNewPatient]").click();

    // //After Clear -- Patient Info
    // cy.location().should((loc) => {
    //   expect(loc.pathname).to.eq("/ccup/patient-info");
    // });

    // //After Clear -- Can navigate back to page 1 from page 2
    // cy.get("[data-cy=cucumber1]").click();
    // cy.location().should((loc) => {
    //   expect(loc.pathname).to.eq("/ccup/");
    // });
    // cy.get("[data-cy=continue-bar]").click();
    // cy.location().should((loc) => {
    //   expect(loc.pathname).to.eq("/ccup/patient-info");
    // });

    // //After Clear -- Navigating to pages 3,4, and 5 from page 2 should fail
    // cy.get("[data-cy=cucumber3]").click();
    // cy.location().should((loc) => {
    //   expect(loc.pathname).to.eq("/ccup/patient-info");
    // });
    // cy.get("[data-cy=cucumber4]").click();
    // cy.location().should((loc) => {
    //   expect(loc.pathname).to.eq("/ccup/patient-info");
    // });
    // cy.get("[data-cy=cucumber5]").click();
    // cy.location().should((loc) => {
    //   expect(loc.pathname).to.eq("/ccup/patient-info");
    // });

    // //After Clear -- Fill patient page
    // cy.fillPatient(envData.patients[1]);
    // cy.get("[data-cy=continue-bar]").click();
    // cy.location().should((loc) => {
    //   expect(loc.pathname).to.eq("/ccup/upload-documents");
    // });

    // //After Clear -- Navigating to pages 4 and 5 from page 3 should fail
    // cy.get("[data-cy=cucumber4]").click();
    // cy.location().should((loc) => {
    //   expect(loc.pathname).to.eq("/ccup/upload-documents");
    // });
    // cy.get("[data-cy=cucumber5]").click();
    // cy.location().should((loc) => {
    //   expect(loc.pathname).to.eq("/ccup/upload-documents");
    // });

    // //After Clear -- Fill Upload Documents page
    // cy.uploadDocument();

    // cy.get("[data-cy=uploadNote]").type(envData.patients[0].uploadNote);
    // cy.get("[data-cy=continue-bar]").click();
    // cy.location().should((loc) => {
    //   expect(loc.pathname).to.eq("/ccup/review-page");
    // });

    // //After Clear -- Navigating to page 5 from page 4 should fail
    // cy.get("[data-cy=cucumber5]").click();
    // cy.location().should((loc) => {
    //   expect(loc.pathname).to.eq("/ccup/review-page");
    // });

    // //After Clear -- Finish Review Page
    // cy.get("[data-cy=isDeclarationAccuracy]").check({ force: true });
    // cy.get("[data-cy=continue-bar]").click();
    // cy.location().should((loc) => {
    //   expect(loc.pathname).to.eq("/ccup/submission-page");
    // });

    // //Verify backwards navigation one more time
    // cy.get("[data-cy=cucumber5]").click();
    // cy.location().should((loc) => {
    //   expect(loc.pathname).to.eq("/ccup/submission-page");
    // });

    // cy.get("[data-cy=cucumber4]").click();
    // cy.location().should((loc) => {
    //   expect(loc.pathname).to.eq("/ccup/review-page");
    // });

    // cy.get("[data-cy=cucumber3]").click();
    // cy.location().should((loc) => {
    //   expect(loc.pathname).to.eq("/ccup/upload-documents");
    // });

    // cy.get("[data-cy=cucumber2]").click();
    // cy.location().should((loc) => {
    //   expect(loc.pathname).to.eq("/ccup/patient-info");
    // });

    // cy.get("[data-cy=cucumber1]").click();
    // cy.location().should((loc) => {
    //   expect(loc.pathname).to.eq("/ccup/");
    // });
  });
});
