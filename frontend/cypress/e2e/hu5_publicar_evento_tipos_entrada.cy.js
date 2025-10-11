// HU5 - Prueba 1: Registrar tipos de entrada y publicar el evento
// Referencia: Casos de prueba Iteración 1 (HU5)
describe("HU5 - Tipos de entrada y publicación", () => {
  beforeEach(() => {
    // Stubs varios que tu UI podría necesitar
    cy.intercept("GET", "**/temporada*", { statusCode: 200, body: [
      { id: 1, nombre: "Verano"}
    ]}).as("getTemporadas");

    cy.intercept("GET", "**/zona*", { statusCode: 200, body: []}).as("getZonas");

    // Stub de publicación final (ajusta a tu endpoint real)
    cy.intercept("POST", "**/evento", { statusCode: 201, body: { id: 123 }}).as("postEvento");
  });

  it("crea tipos de entrada y publica sin errores", () => {
    cy.visit("/create-ticket");

    // Moneda
    cy.get('[data-testid="ticket-currency"]').select("Soles (S/)");
    // Tipo de entrada
    cy.get('[data-testid="ticket-type"]').select("Estándar");
    // Temporada
    cy.get('[data-testid="ticket-season"]').select("Verano");
    // Max por orden
    cy.get('[data-testid="max-per-order"]').clear().type("10");

    // Agregar zonas
    const zonas = ["Zona Norte","Zona oriente","Zona occidente"];
    zonas.forEach(z => {
      cy.get('[data-testid="zone-name"]').clear().type(z);
      cy.contains("button","Agregar zona").click();
    });

    // Cantidad disponible / Precio
    cy.get('[data-testid="stock"]').clear().type("200");
    cy.get('[data-testid="price"]').clear().type("100");

    // Descripción: vacío (no escribir)
    // Permite seleccionar butaca: no marcado (no click)

    // Política de devoluciones (archivo)
    cy.get('[data-testid="refund-policy"]').selectFile("cypress/fixtures/Politica_de_devoluciones.pdf", { force: true });

    // Publicar evento
    cy.contains("button","Publicar evento").click();

    cy.wait("@postEvento").its("response.statusCode").should("be.oneOf", [200,201]);

    // Mensaje de éxito
    cy.contains("¡Felicitaciones! Su evento ha sido creado satisfactoriamente").should("be.visible");
  });
});
