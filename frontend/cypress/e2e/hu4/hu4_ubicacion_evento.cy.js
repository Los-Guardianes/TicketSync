/// <reference types="cypress" />

describe('HU4 - Ubicación del evento (completo hasta create-ticket)', () => {
  const email = 'clara1@mail.com';
  const password = 'hash31';

  beforeEach(() => {
    // Mocks (ajusta si tus endpoints tienen rutas diferentes)
    cy.intercept('GET', '**/cateventos**', {
      statusCode: 200,
      body: [
        { idCategoria: 1, nombre: 'Conciertos' },
        { idCategoria: 2, nombre: 'Teatro' }
      ]
    }).as('getCateventos');

    cy.intercept('GET', '**/departamentos**', {
      statusCode: 200,
      body: [
        { idDpto: '01', nombre: 'Lima' },
        { idDpto: '02', nombre: 'Cusco' }
      ]
    }).as('getDepartamentos');

    cy.intercept('GET', '**/ciudades**', {
      statusCode: 200,
      body: [
        { idCiudad: 101, nombre: 'Lima Metropolitana' },
        { idCiudad: 102, nombre: 'Callao' }
      ]
    }).as('getCiudades');
  });

  it('flujo completo: Detalles -> Ubicación -> create-ticket', () => {
    cy.visit('/home');

    // login
    cy.contains('Login').click();
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/home');
    cy.contains('Crear Evento').click();

    // esperar select de categorias poblado
    cy.get('#idCategoria', { timeout: 15000 }).should('be.visible');
    cy.get('#idCategoria option').should('have.length.greaterThan', 1);

    // completar Detalles
    cy.get('#nombre').clear().type('Una noche de salsa 14');
    cy.get('#idCategoria').select('Conciertos');

    cy.get('.funcion').within(() => {
      cy.get('input[name="fechaInicio"]').clear().type('2025-12-01');
      cy.get('input[name="horaInicio"]').clear().type('20:00');
      cy.get('input[name="fechaFin"]').clear().type('2025-12-02');
      cy.get('input[name="horaFin"]').clear().type('00:00');
    });

    cy.get('#restricciones').clear().type('Apto para mayores de 18 años. Menores de 14 acompañados.');
    cy.get('#descripcion').clear().type('Descripción de prueba para Una noche de salsa 14');

    // avanzar a Ubicación
    cy.get('button.next').click();
    cy.url({ timeout: 10000 }).should('include', '/ubicacion-evento');
    cy.contains('Ubicación').should('be.visible');

    // completar Ubicación con los datos de la imagen
    cy.get('#departamento').should('be.visible').select('Lima');

    // esperar que el select de ciudad esté listo (no disabled)
    cy.get('#idCiudad', { timeout: 10000 }).should('not.be.disabled');
    cy.get('#idCiudad option').should('have.length.greaterThan', 1);
    cy.get('#idCiudad').select('Lima Metropolitana');

    cy.get('#direccion').clear().type('C. José Díaz s/n, Lima 15046');

    // avanzar y verificar create-ticket
    cy.get('button.next').click();
    cy.url({ timeout: 10000 }).should('eq', Cypress.config().baseUrl + '/create-ticket');
  });
});
