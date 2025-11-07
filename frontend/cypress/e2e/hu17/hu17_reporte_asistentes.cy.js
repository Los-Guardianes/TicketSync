// HU17: Generación de reporte (descarga Excel de inscritos)
// Referencia: Casos de prueba Iteración 1 (HU17)
describe("HU17 - Reporte de asistentes", () => {
  beforeEach(() => {
    // Usuario autenticado
    window.localStorage.setItem("auth", JSON.stringify({ token: "fake-jwt" }));

    // Mis eventos -> Configurar -> Listado de inscritos
    cy.intercept("GET", "**/mis-eventos*", { fixture: "mis_eventos.json" }).as("misEventos");
    cy.intercept("GET", "**/evento/*/inscritos/export", {
      statusCode: 200,
      headers: {
        "content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      },
      body: "FAKE_BINARY_EXCEL"
    }).as("exportInscritos");
  });

  it("descarga el Excel del 'Listado de inscritos'", () => {
    cy.visit("/me/events");
    cy.wait("@misEventos");

    cy.contains('[data-testid="my-event-card"]', "Una noche de Salsa 14")
      .within(() => cy.contains("button","Configurar").click());

    cy.contains("button","Listado de inscritos").click();
    cy.wait("@exportInscritos").its("response.statusCode").should("eq", 200);
  });
});
