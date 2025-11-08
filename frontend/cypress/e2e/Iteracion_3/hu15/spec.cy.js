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
    cy.contains('Selecciona tus entradas').should('be.visible');

    // PASO 2: Configurar y agregar al carrito
    cy.contains('Periodos disponibles').should('be.visible');
    cy.wait(2000); // Esperar que los datos se carguen
    cy.get('select').eq(0).select('E2 - Preferencial'); // Seleccionar zona
    cy.get('select').eq(1).select('Adulto'); // Seleccionar tipo de entrada
    cy.get('select').eq(2).select('2026-02-05 19:00:00'); // Seleccionar función
    cy.contains('button', 'Agregar a carrito').should('be.visible').click();
    cy.contains('Tu carrito').should('be.visible');

    // PASO 3: Validar precio unitario
    cy.contains('Tu carrito').parent().should('contain', '$100');

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
    cy.get('aside').contains('h3', 'Total Bruto').next('p').should('contain', 'S/ 200'); // Validar Total Bruto
    cy.get('aside').contains('h3', 'Descuento Periodo').next('p').should('contain', 'S/ 10'); // Validar Descuento Periodo
    cy.get('aside').contains('h3', 'Descuento Aplicado').next('p').should('contain', 'S/ 0'); // Validar Descuento Aplicado

    // Validar Total final con espera explícita
    cy.wait(2000); // Esperar que el cálculo del Total se complete
    cy.get('aside').contains('h3', 'Total').next('p').invoke('text').then((text) => {
      const cleanedText = text.replace(/\s+/g, '').trim(); // Eliminar espacios y limpiar el texto
      console.log('Texto encontrado para Total:', cleanedText); // Depurar el texto encontrado
      expect(cleanedText).to.equal('S/190'); // Validar que el texto sea exactamente 'S/190'
    });

    // PASO 6: Continuar al pago
    cy.contains('button', 'Continuar al pago').should('be.visible').click();
    cy.url({ timeout: 10000 }).should('include', '/ticket-pay');
    cy.contains('Pasarela de Pagos').should('be.visible');

    // PASO 7: Completar formulario de pago
    cy.get('input#CardNumber').should('be.visible').clear().type('1234567890123456');
    cy.get('input#CVV').should('be.visible').clear().type('123');
    cy.get('input#fechaVencimiento').should('be.visible').clear().type('0830');
    cy.get('input#metodoPago').should('be.visible').clear().type('ABC');

    // PASO 8: Pagar
    cy.contains('button', 'Pagar').should('be.visible').click();

    // PASO 9: Verificar éxito
    cy.url({ timeout: 15000 }).should('include', '/happy-pay');
    cy.contains('¡Pago Exitoso!').should('be.visible');
    cy.contains('Tu compra ha sido procesada correctamente').should('be.visible');
    cy.contains('button', 'Descargar Informe').should('be.visible');
    cy.contains('button', 'Volver al Inicio').should('be.visible');

    // PASO 10: Volver al inicio
    cy.contains('button', 'Volver al Inicio').click();
    cy.url({ timeout: 10000 }).should('include', '/home');
    cy.contains(`¡Hola, ${nombreUsuario}!`).should('be.visible');
  });
});