// HU14: Búsqueda por nombre y filtro por categoría + redirección al comprar
// Referencia: Casos de prueba Iteración 1 (HU14)
describe("HU14 - Búsqueda, filtros y compra", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/evento/search*Una%20noche%20de%20salsa%2014*", { fixture: "search_salsa14.json" }).as("searchSalsa");
    cy.intercept("GET", "**/evento*?categoria=Concierto*", { fixture: "filter_concierto.json" }).as("filterConcert");

    // Detalles del evento Peru vs Nueva Zelanda
    cy.intercept("GET", "**/evento*Peru%20vs%20Nueva%20Zelanda*", { fixture: "peru_nz.json" }).as("eventPNZ");
  });

  it("muestra solo 'Una noche de salsa 14' al buscar ese nombre", () => {
    cy.visit("/home");
    cy.get('[data-testid="search-input"]').type("Una noche de salsa 14");
    cy.get('[data-testid="search-submit"]').click();
    cy.wait("@searchSalsa");
    cy.get('[data-testid="event-card"]').should("have.length", 1).and("contain.text", "Una noche de salsa 14");
  });

  it("filtra por categoría 'Concierto'", () => {
    cy.visit("/home");
    cy.contains("button","categoría").click();
    cy.contains("button","conciertos").click();
    cy.wait("@filterConcert");
    cy.get('[data-testid="event-card"]').each($card => {
      cy.wrap($card).should("contain.text","Concierto");
    });
  });

  it("redirige a la compra al presionar 'Comprar' en 'Perú vs Nueva Zelanda'", () => {
    cy.visit("/home");
    // Suponemos que la tarjeta existe y tiene un botón Comprar
    cy.contains('[data-testid="event-card"]', "Perú vs Nueva Zelanda")
      .within(() => {
        cy.contains("button","Comprar").click();
      });
    cy.url().should("match", /\/ticket-purchase\//);
  });
});
