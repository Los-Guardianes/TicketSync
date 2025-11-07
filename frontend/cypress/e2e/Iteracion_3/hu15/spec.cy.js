/// <reference types="cypress" />

describe('HU15 - Realizar pago de entradas', () => {
  const email = 'mario1@mail.com';
  const password = 'hash11';

  beforeEach(() => {
    cy.intercept('GET', '**/api/dpto**', {
      statusCode: 200,
      body: [
        { idDpto: '01', nombre: 'Lima' }
      ]
    }).as('getDepartamentos');

    // Mock del POST de orden de compra
    cy.intercept('POST', '**/api/orden**', {
      statusCode: 201,
      body: {
        idOrdenCompra: 12345,
        mensaje: 'Orden creada exitosamente'
      }
    }).as('postOrden');
  });

  it('debe permitir al cliente realizar el pago de las entradas seleccionadas', () => {
    cy.visit('/home');

    // Login como cliente
    cy.contains('Login').click();
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/home');
    cy.wait('@getDepartamentos', { timeout: 10000 });
    cy.wait(2000);

    // Seleccionar un evento para comprar (usar evento existente en BD)
    cy.contains('.card-title', 'Teatro Clásico Arequipa') // Ajustar al evento en tu BD
      .should('be.visible')
      .parents('.card')
      .within(() => {
        cy.contains('COMPRAR').click();
      });

    // Verificar que estamos en la pantalla de compra
    cy.url({ timeout: 10000 }).should('include', '/ticket-purchase/');
    cy.contains('Continuar al pago', { timeout: 10000 }).should('be.visible');
    cy.wait(3000);

    // Seleccionar zona, tipo de entrada y función
    // Seleccionar zona
    cy.get('select[name="zona"]').should('be.visible').select('Zona 1'); // Ajusta el valor según las opciones disponibles
    cy.wait(500);

    // Seleccionar tipo de entrada
    cy.get('select[name="tipoEntrada"]').should('be.visible').select('Entrada General'); // Ajusta el valor según las opciones disponibles
    cy.wait(500);

    // Seleccionar función
    cy.get('select[name="funcion"]').should('be.visible').select('Función 1'); // Ajusta el valor según las opciones disponibles
    cy.wait(500);

    // Agregar al carrito
    cy.contains('button', 'Agregar a carrito').click();
    cy.wait(1500);

    // Verificar que se agregó al carrito
    cy.get('.ticket-purchase-sidebar').should('be.visible');

    // Continuar al pago
    cy.contains('button', 'Continuar al pago').click();

    // Verificar que estamos en la pantalla de pago
    cy.url({ timeout: 10000 }).should('eq', 'http://localhost:5173/ticket-pay');
    cy.contains('Pasarela de Pagos', { timeout: 5000 }).should('be.visible');

    // Verificar que aparece el resumen de compra
    cy.contains('Resumen de Compra').should('be.visible');
    cy.contains('Total a pagar').should('be.visible');

    // === COMPLETAR DATOS DE PAGO ===
    
    // Número de Tarjeta
    cy.get('#CardNumber').should('be.visible').clear().type('1234567890123456');
    
    // CVV
    cy.get('#CVV').should('be.visible').clear().type('123');
    
    // Vencimiento
    cy.get('#fechaVencimiento').should('be.visible').clear().type('0830');
    
    // Método de pago
    cy.get('#metodoPago').should('be.visible').clear().type('Visa');

    // === PRESIONAR PAGAR ===
    cy.contains('button', 'Pagar').click();

    // Esperar la respuesta del mock
    cy.wait('@postOrden', { timeout: 15000 });

    // Verificar que se redirige a la página de pago exitoso
    cy.url({ timeout: 10000 }).should('eq', 'http://localhost:5173/happy-pay');

    // Verificar mensaje de éxito
    cy.contains('¡Pago Exitoso!', { timeout: 10000 }).should('be.visible');

    // Verificar que aparecen los botones esperados
    cy.contains('button', 'Descargar informe').should('be.visible');
    cy.contains('button', 'Volver a inicio').should('be.visible');

    cy.log('✅ Pago realizado exitosamente');
  });
});