/// <reference types="cypress" />

describe('HU5 - Crear Entradas y Publicar Evento', () => {
  const email = 'clara1@mail.com';
  const password = 'hash31';

  beforeEach(() => {
    // Mocks para las categorías, departamentos y ciudades
    cy.intercept('GET', '**/cateventos**', {
      statusCode: 200,
      body: [
        { idCategoria: 1, nombre: 'Conciertos' },
        { idCategoria: 2, nombre: 'Teatro' }
      ]
    }).as('getCateventos');

    cy.intercept('GET', '**/departamentos**', {
      statusCode: 200,
      body: [
        { idDpto: '01', nombre: 'Lima' },
        { idDpto: '02', nombre: 'Cusco' }
      ]
    }).as('getDepartamentos');

    cy.intercept('GET', '**/ciudades**', {
      statusCode: 200,
      body: [
        { idCiudad: 101, nombre: 'Lima Metropolitana' },
        { idCiudad: 102, nombre: 'Callao' }
      ]
    }).as('getCiudades');

    // Mock correcto con la ruta exacta del servicio
    cy.intercept('POST', '**/api/evento/completo', {
      statusCode: 201,
      body: {
        idEvento: 1,
        nombre: 'Una noche de salsa 14',
        mensaje: 'Evento creado exitosamente'
      }
    }).as('postEvento');
  });

  it('flujo completo: Detalles -> Ubicación -> Crear Entradas -> Publicar', () => {
    cy.visit('/home');

    // Login
    cy.contains('Login').click();
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/home');
    cy.contains('Crear Evento').click();

    // Esperar select de categorías poblado
    cy.get('#idCategoria', { timeout: 15000 }).should('be.visible');
    cy.get('#idCategoria option').should('have.length.greaterThan', 1);

    // Completar Detalles del Evento
    cy.get('#nombre').clear().type('Una noche de salsa 14');
    cy.get('#idCategoria').select('Conciertos');

    cy.get('.funcion').within(() => {
      cy.get('input[name="fechaInicio"]').clear().type('2025-12-01');
      cy.get('input[name="horaInicio"]').clear().type('20:00');
      cy.get('input[name="fechaFin"]').clear().type('2025-12-02');
      cy.get('input[name="horaFin"]').clear().type('00:00');
    });

    cy.get('#restricciones').clear().type('Apto para mayores de 18 años. Menores de edad a partir de los 14 años acompañados de un adulto responsable de su seguridad');
    cy.get('#descripcion').clear().type('Descripción de prueba para Una noche de salsa 14');

    // Avanzar a Ubicación
    cy.get('button.next').click();
    cy.url({ timeout: 10000 }).should('include', '/ubicacion-evento');
    cy.contains('Ubicación').should('be.visible');

    // Completar Ubicación
    cy.get('#departamento').should('be.visible').select('Lima');
    cy.get('#idCiudad', { timeout: 10000 }).should('not.be.disabled');
    cy.get('#idCiudad option').should('have.length.greaterThan', 1);
    cy.get('#idCiudad').select('Lima Metropolitana');
    cy.get('#direccion').clear().type('C. José Díaz s/n, Lima 15046');

    // Avanzar a Crear Entradas
    cy.get('button.next').click();
    cy.url({ timeout: 10000 }).should('eq', Cypress.config().baseUrl + '/create-ticket');
    cy.contains('Crear Entradas').should('be.visible');

    // ========== INICIO DE PRUEBA HU5 ==========

    // Seleccionar Moneda
    cy.get('#moneda').should('be.visible').select('PEN');

    // Configurar Temporada
    cy.contains('Temporada 1 de 1').should('be.visible');
    cy.get('input[placeholder="Escribe la temporada"]').clear().type('Verano');
    
    cy.get('input[type="number"]').first().clear().type('0');

    // Configurar Tipo de Entrada
    cy.contains('Entrada 1 de 1').should('be.visible');
    cy.get('input[placeholder="VIP, Preferencial, Estándar"]').clear().type('Estándar');

    // Zona de la entrada
    cy.get('input[placeholder="Zona del estadio"]').clear().type('Zona Norte');

    // Precio Base
    cy.get('input[type="number"]').eq(1).clear().type('100');

    // Max. cantidad por orden
    cy.get('input[type="number"]').eq(2).clear().type('10');

    // N° de Asientos / Cantidad Disponible
    cy.get('input[type="number"]').eq(3).clear().type('200');

    // Descripción (vacío según el documento)
    cy.get('textarea[placeholder="Escribe información adicional..."]').clear();

    // Verificar que el checkbox "Permite seleccionar butaca" está deshabilitado
    cy.get('#permiteButaca').should('be.disabled').should('not.be.checked');

    // Verificar que el input de archivo está deshabilitado
    cy.get('input[type="file"]').should('be.disabled');

    // Stub del window.alert ANTES de hacer click
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('windowAlert');
    });

    // Publicar Evento
    cy.contains('Finalizar y Guardar Evento').click();

    // Verificar que se llamó al endpoint de creación de evento
    cy.wait('@postEvento', { timeout: 15000 });

    // Verificar que el alert fue llamado con el mensaje correcto
    cy.get('@windowAlert').should('have.been.calledOnce');
    cy.get('@windowAlert').should('have.been.calledWithMatch', /Evento creado con éxito/);

    // Verificar redirección a home
    cy.url({ timeout: 10000 }).should('include', '/home');
  });
});