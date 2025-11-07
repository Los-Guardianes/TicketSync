/// <reference types="cypress" />

describe('HU14 - Redirección a página de compra de tickets', () => {
  const email = 'clara1@mail.com';
  const password = 'hash31';

  beforeEach(() => {
    // Mock de departamentos
    cy.intercept('GET', '**/api/dpto**', {
      statusCode: 200,
      body: [
        { idDpto: '01', nombre: 'Lima' },
        { idDpto: '02', nombre: 'Arequipa' },
        { idDpto: '03', nombre: 'Cusco' },
        { idDpto: '04', nombre: 'Piura' }
      ]
    }).as('getDepartamentos');
  });

  it('debe redirigir a la página de compra al presionar el botón COMPRAR de Partido Cusco', () => {
    cy.visit('/home');

    // Login
    cy.contains('Login').click();
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/home');

    // Esperar a que se carguen los departamentos
    cy.wait('@getDepartamentos', { timeout: 10000 });

    // Esperar a que se carguen los eventos reales
    cy.wait(2000);

    // Verificar que hay eventos en pantalla
    cy.get('.card', { timeout: 10000 }).should('have.length.greaterThan', 0);

    // Buscar la tarjeta del evento "Partido Cusco"
    cy.contains('.card-title', 'Partido Cusco')
      .should('be.visible')
      .parents('.card')
      .within(() => {
        // Verificar que el botón COMPRAR existe
        cy.contains('COMPRAR').should('be.visible');
        
        // Hacer click en el botón COMPRAR
        cy.contains('COMPRAR').click();
      });

    // Verificar que se redirige a la página de compra de tickets con el ID correcto
    cy.url({ timeout: 10000 }).should('eq', 'http://localhost:5173/ticket-purchase/3');

    // Verificación adicional: que la página de compra cargó correctamente
    cy.contains('Comprar', { timeout: 10000 }).should('exist');
  });
});