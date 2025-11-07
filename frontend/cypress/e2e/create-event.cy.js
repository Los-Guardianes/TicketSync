describe("Creación de Evento (feliz)", () => {
  beforeEach(() => {
    // Simula usuario autenticado
    window.localStorage.setItem("auth", JSON.stringify({ token: "fake-jwt" }));
  });

  it("completa el formulario mínimo y avanza", () => {
    cy.visit("/create-event");
    // Ajusta selectores a los name/label reales de tu formulario
    // Ejemplos:
    // cy.get('input[name="nombre"]').type("Concierto de prueba");
    // cy.get('textarea[name="descripcion"]').type("Descripcion del evento");
    // cy.get('input[name="fecha"]').type("2025-12-01");
    // cy.contains("button","Siguiente").click();
  });
});
