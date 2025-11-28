import { BASE_URL } from "../../../src/globalServices/API";

/// <reference types="cypress" />

describe('HU15 - Registro de datos de tickets comprados', () => {
  const email = 'clara1@mail.com';
  const password = 'hash31';

  beforeEach(() => {
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

  it('debe registrar correctamente los datos de los tickets y continuar al pago', () => {
    cy.visit('/home');

    cy.contains('Login').click();
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/home');
    cy.wait('@getDepartamentos', { timeout: 10000 });
    cy.wait(2000);

    cy.contains('.card-title', 'Partido Cusco')
      .should('be.visible')
      .parents('.card')
      .within(() => {
        cy.contains('COMPRAR').click();
      });

    cy.url({ timeout: 10000 }).should('include', '/ticket-purchase/3');
    cy.contains('Comprar ticket', { timeout: 10000 }).should('be.visible');
    cy.contains('Periodos disponibles').should('be.visible');
    cy.wait(3000);

    // ZONA
    cy.contains('h2', 'Zona').parent().as('zonaSection');
    cy.get('@zonaSection').find('button.dropdown-toggle').click();
    cy.get('@zonaSection').find('.dropdown-menu.show').should('be.visible');
    cy.get('@zonaSection').find('.dropdown-item').contains('E3 - Norte').click();
    cy.wait(800);

    // TIPO ENTRADA
    cy.contains('h2', 'Tipo Entrada').parent().as('tipoSection');
    cy.get('@tipoSection').find('button.dropdown-toggle').click();
    cy.get('@tipoSection').find('.dropdown-menu.show').should('be.visible');
    cy.get('@tipoSection').find('.dropdown-item').contains('Adulto').click();
    cy.wait(800);

    // FUNCIÓN
    cy.contains('h2', 'Funciones').parent().as('funcionSection');
    cy.get('@funcionSection').find('button.dropdown-toggle').click();
    cy.get('@funcionSection').find('.dropdown-menu.show').should('be.visible');
    cy.get('@funcionSection').find('.dropdown-item').contains('2026-01-22 15:00:00').click();
    cy.wait(800);

    // CANTIDAD
    cy.contains('Cantidad de entradas', { timeout: 5000 }).should('be.visible');
    
    for (let i = 0; i < 3; i++) {
      cy.contains('Cantidad de entradas').parent().find('button').contains('+').click();
      cy.wait(300);
    }

    cy.contains('Cantidad de entradas').parent().should('contain', '4');

    // AGREGAR
    cy.contains('button', 'Agregar').click();
    cy.wait(1500);

    // VERIFICAR DENTRO DE #list_purchase ESPECÍFICAMENTE
    cy.get('#list_purchase').should('be.visible');
    cy.get('#list_purchase').should('contain', 'E3 - Norte');
    
    // Verificar Monto Final en el área de info del evento
    cy.get('#info-event-ticket').should('contain', 'Monto Final');

    // CONTINUAR
    cy.contains('button', 'Continuar').click();
    cy.url({ timeout: 10000 }).should('eq', `${BASE_URL}/ticket-pay`);

    cy.log('✅ Prueba completada exitosamente');
  });
});