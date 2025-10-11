/// <reference types="cypress" />

// HU4 - Crear evento: Detalles del evento
// Test completo: hace login, visita /create-event, completa el formulario y avanza a /ubicacion-evento
describe('HU4 - Crear evento: Detalles del evento', () => {
  it('inicia sesión, completa datos válidos y navega a la pantalla de ubicación', () => {
    // Hacer login por API para evitar UI lenta (comando definido en cypress/support/commands.js)
    cy.loginAPI('mario1@mail.com', 'hash11').then(() => {
      // Visitar la ruta de creación de evento (según ClienteRoutes.jsx -> path="create-event")
      cy.visit('/create-event');

      // Esperar a que el contenedor principal del formulario esté visible
      cy.get('.crear-evento-container', { timeout: 10000 }).should('be.visible');

      // Nombre del evento
      cy.get('input#nombre', { timeout: 10000 }).clear().type('Una noche de salsa 14');

      // Categoría
      cy.get('select#categoria').select('concierto');

      // Fecha y hora de inicio: 2025-12-01 20:00
      cy.get('input[type="date"]').first().clear().type('2025-12-01');
      cy.get('input[type="time"]').first().clear().type('20:00');

      // Fecha y hora de fin: 2025-12-02 00:00
      cy.get('input[type="date"]').eq(1).clear().type('2025-12-02');
      cy.get('input[type="time"]').eq(1).clear().type('00:00');

      // Restricciones
      cy.get('input#restricciones').clear().type('Apto para mayores de 18 años. Menores desde 14 con adulto.');

      // Adjuntar imagen desde fixtures (fixture: cypress/fixtures/UnaNocheDeSalsa14.jpg)
      cy.fixture('UnaNocheDeSalsa14.jpg').then((fileBase64) => {
        const blob = Cypress.Blob.base64StringToBlob(fileBase64, 'image/jpeg');
        const testFile = new File([blob], 'UnaNocheDeSalsa14.jpg', { type: 'image/jpeg' });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(testFile);

        cy.get('input[type="file"]').then(($input) => {
          const el = $input[0];
          el.files = dataTransfer.files;
          cy.wrap($input).trigger('change', { force: true });
        });
      });

      // Click en Siguiente
      cy.get('button.next').click();

      // Verificar navegación a la página de ubicación
      cy.url({ timeout: 10000 }).should('include', '/ubicacion-evento');
    });
  });
});
