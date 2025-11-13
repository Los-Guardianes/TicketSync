// cypress/e2e/HU2-login-credenciales.cy.js

describe('HU2 - Login de Usuario con credenciales', () => {
  
  beforeEach(() => {
    cy.visit('http://localhost:5173/home');
  });

  it('Prueba 1: Debe permitir iniciar sesión con correo y contraseña válidos', () => {
    cy.contains('Login').click();

    cy.url().should('eq', 'http://localhost:5173/login');
    cy.contains('h2', 'Iniciar sesión').should('be.visible');

    cy.get('input[name="email"]').type('mario1@mail.com');
    cy.get('input[name="password"]').type('hash11');

    cy.contains('button', 'Iniciar sesión').click();

    cy.url().should('match', /\/(home)?$/, { timeout: 10000 });
    cy.contains('¡Hola, Mario!', { timeout: 10000 }).should('be.visible');
  });

  it('Prueba 1b: Debe mostrar error con credenciales inválidas', () => {
    cy.visit('http://localhost:5173/login');

    cy.get('input[name="email"]').type('usuario_invalido@mail.com');
    cy.get('input[name="password"]').type('contraseña_incorrecta');

    cy.contains('button', 'Iniciar sesión').click();

    cy.get('.message.error', { timeout: 10000 }).should('be.visible');
    cy.url().should('include', '/login');
  });

});
