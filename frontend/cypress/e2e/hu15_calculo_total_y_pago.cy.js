// HU15: Cálculo de totales y registro de datos de tickets
// Referencia: Casos de prueba Iteración 1 (HU15)
describe("HU15 - Cálculos y pago", () => {
  beforeEach(() => {
    // Navegar desde seleccionar evento
    cy.visit("/home");
    cy.contains('[data-testid="event-card"]', "Perú vs Nueva Zelanda")
      .within(() => cy.contains("button","Comprar").click());
    cy.url().should("match", /\/ticket-purchase\//);
  });

  it("calcula correctamente con 20% de descuento (VIP x2, código 1234)", () => {
    // Precios supuestos por el caso: Estándar=100, VIP=300
    // Asegura que la UI/estado inicial concuerde o mockea pricing si corresponde
    cy.get('[data-testid="ticket-type"]').select("VIP");
    cy.get('[data-testid="ticket-quantity"]').clear().type("2");
    cy.get('[data-testid="discount-code"]').type("1234");
    cy.contains("button","Aplicar descuento").click();

    // Esperados: Precio 600, Comisión 0, Descuento 120, Total 480
    cy.get('[data-testid="summary-price"]').should("contain.text","600");
    cy.get('[data-testid="summary-fee"]').should("contain.text","0");
    cy.get('[data-testid="summary-discount"]').should("contain.text","120");
    cy.get('[data-testid="summary-total"]').should("contain.text","480");
  });

  it("muestra ventana de pago al presionar 'Pagar' con VIP x2 sin código", () => {
    cy.get('[data-testid="ticket-type"]').select("VIP");
    cy.get('[data-testid="ticket-quantity"]').clear().type("2");
    cy.contains("button","Pagar").click();

    // Valida apertura de modal/redirect de pago (ajusta selector)
    cy.get('[data-testid="payment-modal"]').should("be.visible");
  });
});
