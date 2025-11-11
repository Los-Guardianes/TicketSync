/// <reference types="cypress" />

describe('HU15 - Pago de entradas', () => {
  const email = 'mario1@mail.com';
  const password = 'hash11';
  const nombreUsuario = 'Mario';

  beforeEach(() => {
    // Login
    cy.visit('http://localhost:5173/home');
    cy.contains('Login').should('be.visible').click();
    cy.url().should('include', '/login');
    cy.get('input[type="email"]').should('be.visible').clear().type(email);
    cy.get('input[type="password"]').should('be.visible').clear().type(password);
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 10000 }).should('include', '/home');
    cy.contains(`¡Hola, ${nombreUsuario}!`, { timeout: 10000 }).should('be.visible');
  });

  it('debe permitir completar el proceso de pago de entradas', () => {
    // PASO 1: Ir al evento Teatro Clásico Arequipa
    cy.get('div.card')
      .contains('Teatro Clásico Arequipa') // Seleccionar el evento por texto exacto
      .should('be.visible')
      .parents('div.card') // Asegurarse de que está dentro de la tarjeta correcta
      .find('button')
      .contains('COMPRAR')
      .click();

    cy.url({ timeout: 10000 }).should('include', '/ticket-purchase');
    cy.contains('Tarifas por zona y tipo de entrada').should('be.visible'); // Validar texto
    cy.contains('Selecciona tu ticket').should('be.visible'); // Validar texto

    // PASO 2: Configurar y agregar al carrito
    cy.contains('Periodos disponibles').should('be.visible');
    cy.wait(2000); // Esperar que los datos se carguen
    cy.get('select').eq(0).select('E2 - Preferencial'); // Seleccionar zona
    cy.get('select').eq(1).select('Adulto'); // Seleccionar tipo de entrada
    cy.get('select').eq(2).select('2026-02-05 19:00:00'); // Seleccionar función
    cy.contains('button', 'Agregar a carrito').should('be.visible').click();
    cy.contains('Tu carrito').should('be.visible');

    // PASO 3: Validar precio unitario
    cy.contains('Tu carrito').parent().should('contain', 'S/ 100');

    // PASO 4: Aumentar cantidad a 2
    cy.contains('Tu carrito')
      .parent()
      .find('button')
      .contains('+')
      .should('be.visible')
      .click();
    cy.wait(2000); // Esperar que se actualice
    cy.contains('Tu carrito').parent().should('contain', '2');

    // PASO 5: Validar que los totales se calculen correctamente
    cy.get('aside').contains('h3', 'Total Bruto').next('p').invoke('text').then((text) => {
      const totalBruto = parseFloat(text.replace('S/', '').trim()); // Convertir a número decimal
      expect(totalBruto).to.be.closeTo(200.00, 0.01); // Validar que esté cerca de 200.00
    });

    cy.get('aside').contains('h3', 'Descuento Periodo').next('p').invoke('text').then((text) => {
      const descuentoPeriodo = parseFloat(text.replace('S/', '').trim());
      expect(descuentoPeriodo).to.be.closeTo(10.00, 0.01); // Validar que esté cerca de 10.00
    });

    cy.get('aside').contains('h3', 'Descuento Aplicado').next('p').invoke('text').then((text) => {
      const descuentoAplicado = parseFloat(text.replace('S/', '').trim());
      expect(descuentoAplicado).to.be.closeTo(0.00, 0.01); // Validar que esté cerca de 0.00
    });

    cy.get('aside').contains('h3', 'Total').next('p').invoke('text').then((text) => {
      const total = parseFloat(text.replace('S/', '').trim());
      expect(total).to.be.closeTo(190.00, 0.01); // Validar que esté cerca de 190.00
    });

    // PASO 6: Continuar al pago
    cy.contains('button', 'Continuar al pago').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/ticket-pay');
    cy.contains('Pasarela de Pagos').should('be.visible');

    // PASO 7: Validar resumen de compra
    cy.contains('Total a pagar:').should('be.visible');
    cy.get('div').contains('S/ 190.00').should('be.visible'); // Validar total en pantalla de pago

    // PASO 8: Completar formulario de pago
    cy.get('input#CardNumber').should('be.visible').clear().type('1234567890123456');
    cy.get('input#CVV').should('be.visible').clear().type('123');
    cy.get('input#fechaVencimiento').should('be.visible').clear().type('0830');
    cy.get('input#metodoPago').should('be.visible').clear().type('ABC');

    // PASO 9: Pagar
    cy.contains('button', 'Pagar').should('be.visible').click();

    // PASO 10: Verificar éxito
    cy.url({ timeout: 15000 }).should('include', '/happy-pay');
    cy.contains('¡Pago Exitoso!').should('be.visible');
    cy.contains('Tu compra ha sido procesada correctamente').should('be.visible');
    cy.contains('button', 'Descargar Informe').should('be.visible');
    cy.contains('button', 'Volver al Inicio').should('be.visible');

    // PASO 11: Volver al inicio
    cy.contains('button', 'Volver al Inicio').click();
    cy.url({ timeout: 10000 }).should('include', '/home');
    cy.contains(`¡Hola, ${nombreUsuario}!`).should('be.visible');
  });
});