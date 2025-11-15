// cypress/e2e/HUXX-cancelar-evento.cy.js

describe('HUXX - Cancelar evento como organizador', () => {

  it('Debe permitir iniciar sesión, ingresar a un evento y cancelarlo correctamente', () => {
    
    // 1. Ir a home
    cy.visit('https://tuticket.space/home');

    // 2. Ir a Login
    cy.contains('Login').click();
    cy.url().should('include', '/login');

    // 3. Ingresar credenciales
    cy.get('input[name="email"]').type('pedro2@mail.com');
    cy.get('input[name="password"]').type('hash32');

    cy.contains('button', 'Iniciar sesión').click();

    // 4. Verificación de login exitoso
    cy.contains('¡Hola, Pedro', { timeout: 10000 }).should('be.visible');

    // 5. Ir a Mis Eventos
    cy.contains('Mis Eventos').click();
    cy.url().should('include', '/organizer/mis-eventos');

    // 6. Hacer clic en el PRIMER botón "Configurar"
    cy.contains('Configurar').first().click();

    // 7. Verificar que cargó la pantalla de configuración
    cy.url().should('include', '/organizer/evento/');
    cy.contains('Configuración de evento').should('be.visible');

    // 8. Presionar “CANCELAR EVENTO”
    cy.contains('CANCELAR EVENTO').click();

    // 9. Verificar que aparezca el popup
    cy.contains('¿Cancelar este evento?').should('be.visible');

    // 10. Confirmar cancelación
    cy.contains('Sí, cancelar evento').click();

    // 11. Interceptar el alert del front (evita que falle la prueba)
    cy.on('window:alert', (txt) => {
      expect(txt).to.include('El evento ha sido cancelado correctamente');
    });

    // 12. Verificar que el popup desapareció
    cy.contains('¿Cancelar este evento?').should('not.exist');

    // 13. Verificar que aparece el mensaje en rojo
    cy.contains('Este evento está cancelado.')
      .should('be.visible')
      .and('have.css', 'color'); // garantiza que existe estilado, opcional

  });

});
