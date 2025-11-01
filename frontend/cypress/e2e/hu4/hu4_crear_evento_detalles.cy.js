/// <reference types="cypress" />

describe('HU4 - Prueba 1: Creación de evento (Detalles del evento)', () => {
  // Credenciales de prueba (me las diste)
  const email = 'clara1@mail.com';
  const password = 'hash31';

  before(() => {
    // Si quieres ejecutar algo antes de todo (por ejemplo limpiar), agregar aquí.
  });

  it('loguea, abre crear evento, completa detalles y avanza a ubicación', () => {
    // 1) Ir a home
    cy.visit('/home');

    // 2) Abrir pantalla de login
    // Supongo que el botón tiene texto "Login"
    cy.contains('Login').should('be.visible').click();

    // --- Si tu botón de login es distinto, cambia la línea anterior:
    // cy.get('[data-cy=btn-login]').click();

    // 3) En la pantalla de login: llenar credenciales
    // Supongo input[type="email"] y input[type="password"] y button[type="submit"]
    cy.get('input[type="email"]').should('be.visible').type(email);
    cy.get('input[type="password"]').should('be.visible').type(password);

    // Enviar el formulario de login
    cy.get('button[type="submit"]').click();

    // Si tu login usa otro selector, sustituir:
    // cy.get('[data-cy=login-submit]').click();

    // Esperar hasta volver a /home y que el botón Crear Evento exista
    cy.url().should('include', '/home');
    cy.contains('Crear Evento').should('be.visible').click();

    // 4) Ahora estamos en la pantalla "Detalles del evento"
    // Verificamos que el título esté presente (según tu JSX)
    cy.contains('Detalles del evento').should('be.visible');

    // 5) Completar campos según la prueba
    // Nombre del evento
    cy.get('#nombre')
      .should('be.visible')
      .clear()
      .type('Una noche de salsa 14');

    // Categoría: seleccionamos la opción por texto (Conciertos)
    // Nota: si el <select> tiene opciones cargadas por API, select por label funcionará
    cy.get('#idCategoria')
      .should('be.visible')
      .select('Conciertos'); // si falla, cambia a .select('1') con el value correcto

    // Funciones: rellenamos fecha/hora inicio y fin para la función actual
    // Observación: input[type=date] espera yyyy-mm-dd
    cy.get('.funcion').within(() => {
      cy.get('input[name="fechaInicio"]').should('be.visible').clear().type('2025-12-01');
      cy.get('input[name="horaInicio"]').should('be.visible').clear().type('20:00');

      cy.get('input[name="fechaFin"]').should('be.visible').clear().type('2025-12-02');
      cy.get('input[name="horaFin"]').should('be.visible').clear().type('00:00');
    });

    // Restricciones
    cy.get('#restricciones')
      .should('be.visible')
      .clear()
      .type('Apto para mayores de 18 años. Menores de edad a partir de 14 años acompañados.');

    // Información adicional / descripción
    cy.get('#descripcion')
      .should('be.visible')
      .clear()
      .type('Descripción de prueba para Una noche de salsa 14');

    // No subimos imagen (me dijiste que no por ahora)
    // cy.get('input[type="file"]').attachFile('UnaNocheDeSalsa14.jpg') // si decidieras hacerlo en el futuro

    // 6) Presionar Siguiente
    cy.get('button.next').should('be.visible').click();

    // 7) Assert final: la URL debe cambiar a /ubicacion-evento
    cy.url({ timeout: 10000 }).should('eq', Cypress.config().baseUrl + '/ubicacion-evento');

    // Si prefieres verificar por fragmento:
    // cy.url().should('include', '/ubicacion-evento');

    // También podrías verificar que exista el título de la página ubicación:
    // cy.contains('Ubicación del evento').should('be.visible');
  });
});
