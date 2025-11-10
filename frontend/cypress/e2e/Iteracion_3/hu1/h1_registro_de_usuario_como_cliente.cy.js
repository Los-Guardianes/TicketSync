/// <reference types="cypress" />

describe('HU1 - Registro de usuario como cliente (email duplicado)', () => {

  beforeEach(() => {
    // Intercept del POST que intenta registrar al cliente
    // ⚠️ Ajusta la URL si tu servicio usa otra ruta.
    // En caso de que tu backend use /api/cliente o /api/clients, cámbialo abajo.
    cy.intercept('POST', '**/api/cliente*', {
      statusCode: 400,
      body: {
        message: 'Ya existe una cuenta asociada al correo electrónico ingresado. Por favor, introduzca otro correo.'
      }
    }).as('postClientError');
  });

  it('Debe mostrar un mensaje de error al intentar registrar un correo ya existente', () => {
    // Visitar el formulario usando baseUrl definido en cypress.config.js
    cy.visit('/register-client');

    // Stub de window.alert: hacerlo después de visit para mayor fiabilidad
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });

    // Completar formulario (usa los ids que compartiste en el JSX)
    cy.get('#inpNombre').clear().type('Mario');
    cy.get('#inpApellido').clear().type('Pérez');

    // Correo ya registrado según tu caso
    cy.get('#inpEmail').clear().type('mario1@mail.com');

    cy.get('#inpPassword').clear().type('contraSegura1');
    cy.get('#inpConfirmPassword').clear().type('contraSegura1');

    cy.get('#inpDNI').clear().type('12345678');
    cy.get('#inpCelular').clear().type('987654321');

    cy.get('#inpFechaNac').clear().type('1990-01-01');

    // Seleccionar ciudad del dropdown — el dropdown ya tiene opciones en tu app
    cy.get('#dropdownMenuButton').click();
    // Ajusta 'Lima' por la ciudad que aparezca realmente si es distinto
    cy.contains('.dropdown-item', 'Lima').click();

    // Enviar formulario
    cy.contains('button', 'Registrar').click();

    // Esperar la llamada POST mockeada (alias definido en beforeEach)
    cy.wait('@postClientError');

    // Validar que se llamó alert con el texto esperado
    cy.get('@alert').should('have.been.called');
    cy.get('@alert').then(stub => {
      const mensaje = stub.getCall(0).args[0];
      expect(mensaje).to.include('Hubo un error');
      expect(mensaje).to.include('Ya existe una cuenta asociada');
    });
  });

});
