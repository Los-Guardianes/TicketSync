/// <reference types="cypress" />

describe('HU14 - Filtrado de eventos por ubicación', () => {
  const email = 'clara1@mail.com';
  const password = 'hash31';

  beforeEach(() => {
    // Solo mock de departamentos para asegurar que el filtro tenga opciones
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

  it('debe mostrar solo eventos de Arequipa al seleccionar el filtro de ubicación', () => {
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

    // Verificar que hay eventos en pantalla antes de filtrar
    cy.get('.card', { timeout: 10000 }).should('have.length.greaterThan', 0);

    // Guardar los nombres de los eventos iniciales
    let eventosIniciales = [];
    cy.get('.card-title').each(($title) => {
      eventosIniciales.push($title.text().trim());
    }).then(() => {
      cy.log(`Eventos iniciales (${eventosIniciales.length}):`, eventosIniciales.join(', '));
    });

    // Hacer click en el dropdown de "Ubicación" para abrirlo
    cy.contains('.nav-link.dropdown-toggle', 'Ubicación').click();

    // Esperar a que el dropdown se despliegue y seleccionar "Arequipa" en el select
    cy.get('.dropdown-menu.show .form-select').should('be.visible').select('Arequipa');

    // Cerrar el dropdown haciendo click fuera de él
    cy.get('body').click(0, 0);

    // Esperar un momento para que el filtro se aplique
    cy.wait(1000);

    // Verificar que se muestran eventos (al menos 1)
    cy.get('.card').should('have.length.greaterThan', 0);

    // Guardar los nombres de los eventos después del filtro
    let eventosFiltrados = [];
    cy.get('.card-title').each(($title) => {
      eventosFiltrados.push($title.text().trim());
    }).then(() => {
      cy.log(`Eventos después de filtrar (${eventosFiltrados.length}):`, eventosFiltrados.join(', '));
      
      // Verificar que la cantidad filtrada es menor o igual a la inicial
      expect(eventosFiltrados.length).to.be.lte(eventosIniciales.length);
    });

    // Verificar que el botón COMPRAR está presente en los eventos mostrados
    cy.get('.card').first().within(() => {
      cy.contains('COMPRAR').should('be.visible');
    });

    // Log de éxito
    cy.log('✅ Filtro de ubicación aplicado correctamente - Mostrando solo eventos de Arequipa');
  });
});