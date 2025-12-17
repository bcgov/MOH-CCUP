describe("get started", () => {
  it("goes to the get started page when the user visits /", () => {
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
