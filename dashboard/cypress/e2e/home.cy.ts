describe('Home page', () => {
    it('displays Join us on GitHub button', () => {
      cy.visit('/');
      cy.contains('Join us on GitHub').should('be.visible');
    });
  });
  