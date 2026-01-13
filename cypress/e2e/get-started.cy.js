import envData from "../fixtures/env-data.js";

describe("get started", () => {
  it("goes to the get started page when the user visits /", () => {
    if (envData.enableIntercepts) {
      console.log("intercepted captcha calls with 200 OK response");
      cy.intercept("POST", "/ccup/api/captcha/captcha", {
        statusCode: 200,
        body: {
          nonce: "1234567890",
          captcha: "captcha",
          testfield: "This is a stubbed test response from Cypress",
        },
      });

      cy.intercept("POST", "/ccup/api/captcha/verify/captcha", {
        statusCode: 200,
        body: {
          valid: true,
          jwt: "1234567890",
          testfield: "This is a stubbed test response from Cypress",
        },
      });

      console.log("intercepted logging calls with 200 OK response");
      cy.intercept("POST", "/ccup/api/logging", {
        statusCode: 200,
        body: {
          returnCode: "success",
          testfield: "This is a stubbed test response from Cypress",
        },
      });

      console.log("intercepted env calls with 200 OK response");
      cy.intercept("POST", "/ccup/api/env", {
        statusCode: 200,
        body: {
          returnCode: "success",
          testfield: "This is a stubbed test response from Cypress",
        },
      });
    }
    cy.visit("/");
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ccup/");
    });
    cy.completeCaptcha();

    // Should navigate to Auth in Province form
    cy.get("[data-cy=upload-portal-optionsupload-portal-auth-in-prov]").click({
      force: true,
    });
    cy.get("[data-cy=continue-bar]").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ccup/auth-in-province-medical-info");
    });

    // Should navigate to Over Age Claims form
    cy.go(-1);
    cy.get("[data-cy=upload-portal-optionsupload-portal-over-age-claims]").click({
      force: true,
    });
    cy.get("[data-cy=continue-bar]").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ccup/over-age-practitioner");
    });

    // Should navigate to Pre Auth and Claims form
    cy.go(-1);
    cy.get("[data-cy=upload-portal-optionsupload-portal-pre-auth-and-claims]").click({
      force: true,
    });
    cy.get("[data-cy=continue-bar]").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ccup/practitioner-info");
    });
  });
});
