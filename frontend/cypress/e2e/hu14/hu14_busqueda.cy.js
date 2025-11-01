/// <reference types="cypress" />

describe('HU14 - Búsqueda de eventos por nombre', () => {
  const email = 'clara1@mail.com';
  const password = 'hash31';

  beforeEach(() => {
    // Mock para obtener la lista de eventos
    cy.intercept('GET', '**/api/evento**', {
      statusCode: 200,
      body: [
        {
          idEvento: 1,
          nombre: 'Concierto Rock Lima',
          direccion: 'Estadio Nacional, Lima',
          urlImagen: 'maps/rock.png',
          funciones: [{ fechaInicio: '2025-01-10' }],
          ciudad: { dpto: { nombre: 'Lima' } }
        },
        {
          idEvento: 2,
          nombre: 'Teatro Clásico Arequipa',
          direccion: 'Teatro Municipal, Arequipa',
          urlImagen: 'maps/teatro.png',
          funciones: [{ fechaInicio: '2026-02-05' }],
          ciudad: { dpto: { nombre: 'Arequipa' } }
        },
        {
          idEvento: 3,
          nombre: 'Partido Cusco',
          direccion: 'Estadio Garcilaso, Cusco',
          urlImagen: 'maps/futbol.png',
          funciones: [{ fechaInicio: '2026-01-22' }],
          ciudad: { dpto: { nombre: 'Cusco' } }
        },
        {
          idEvento: 4,
          nombre: 'Festival Gastronómico Piura',
          direccion: 'Centro de Piura',
          urlImagen: 'maps/festival.png',
          funciones: [{ fechaInicio: '2026-01-05' }],
          ciudad: { dpto: { nombre: 'Piura' } }
        }
      ]
    }).as('getEventos');
  });

  it('debe mostrar solo el evento buscado al escribir en la barra de búsqueda', () => {
    cy.visit('/home');

    // Login
    cy.contains('Login').click();
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/home');

    // Esperar a que se carguen los eventos
    cy.wait('@getEventos', { timeout: 10000 });

    // Verificar que inicialmente se muestran todos los eventos
    cy.contains('Concierto Rock Lima').should('be.visible');
    cy.contains('Teatro Clásico Arequipa').should('be.visible');
    cy.contains('Partido Cusco').should('be.visible');
    cy.contains('Festival Gastronómico Piura').should('be.visible');

    // Buscar el evento específico en la barra de búsqueda
    cy.get('input[placeholder="Encuentra eventos..."]')
      .should('be.visible')
      .clear()
      .type('Concierto Rock Lima');

    // Esperar un momento para que el filtro se aplique
    cy.wait(500);

    // Verificar que solo se muestra el evento buscado
    cy.contains('Concierto Rock Lima').should('be.visible');

    // Verificar que los demás eventos NO se muestran
    cy.contains('Teatro Clásico Arequipa').should('not.exist');
    cy.contains('Partido Cusco').should('not.exist');
    cy.contains('Festival Gastronómico Piura').should('not.exist');

    // Verificar que la tarjeta del evento tiene la información correcta
    cy.contains('Concierto Rock Lima')
      .parent()
      .parent()
      .within(() => {
        cy.contains('Estadio Nacional, Lima').should('be.visible');
        cy.contains('2025-01-10').should('be.visible');
        cy.contains('COMPRAR').should('be.visible');
      });
  });
});