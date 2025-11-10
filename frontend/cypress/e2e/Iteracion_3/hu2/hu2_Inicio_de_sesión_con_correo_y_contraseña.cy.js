/// <reference types="cypress" />

describe('HU2 - Inicio de sesión con correo y contraseña', () => {
  const email = 'mario1@mail.com';
  const password = 'hash11';
  const nombreUsuario = 'Mario';

  beforeEach(() => {
    // Mock de departamentos (puede ser necesario si la página home los carga)
    cy.intercept('GET', '**/api/dpto**', {
      statusCode: 200,
      body: [
        { idDpto: '01', nombre: 'Lima' },
        { idDpto: '02', nombre: 'Arequipa' }
      ]
    }).as('getDepartamentos');
  });

  it('debe permitir al usuario iniciar sesión y mostrar mensaje de bienvenida', () => {
    // Visitar la página de inicio
    cy.visit('/home');

    // Hacer click en el botón "Login"
    cy.contains('Login').should('be.visible').click();

    // Verificar que estamos en la página de login
    cy.url().should('include', '/login');

    // Completar el formulario de login
    cy.get('input[type="email"]').should('be.visible').clear().type(email);
    cy.get('input[type="password"]').should('be.visible').clear().type(password);

    // Presionar el botón "Iniciar sesión"
    cy.get('button[type="submit"]').click();

    // Verificar que se redirige a la página de inicio
    cy.url({ timeout: 10000 }).should('include', '/home');

    // Verificar que aparece el mensaje de bienvenida en la esquina superior derecha
    cy.contains(`¡Hola, ${nombreUsuario}!`, { timeout: 10000 }).should('be.visible');

    // Verificación adicional: el botón "Login" ya no debe estar visible
    cy.contains('button', 'Login').should('not.exist');

    // Verificación adicional: debe aparecer el botón "Cerrar Sesión"
    cy.contains('Cerrar Sesión').should('be.visible');

    cy.log('✅ Login exitoso - Usuario autenticado correctamente');
  });
});