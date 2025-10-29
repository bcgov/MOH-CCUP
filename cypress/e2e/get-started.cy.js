describe("get started", () => {
  it("goes to the get started page when the user visits /get-started", () => {
    cy.visit("/get-started");
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/ccup/get-started");
    });
    cy.completeCaptcha();
    cy.get("[data-cy=upload-portal-optionsupload-portal-pre-auth-and-claims]").click({
      force: true,
    });
    cy.get("[data-cy=continue-bar]").click();
  });
});
