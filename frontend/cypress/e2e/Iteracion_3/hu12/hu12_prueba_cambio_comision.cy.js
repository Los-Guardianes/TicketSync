// cypress/e2e/HU3-admin-config-comision.cy.js

describe("HU3 - Configuración de Comisión (Admin)", () => {

  it("Debe permitir al administrador modificar la comisión global y regresar al panel admin", () => {

    // 1. Ir a home e iniciar login
    cy.visit("https://tuticket.space/home");

    cy.contains("Login").click();

    // Validar pantalla de login
    cy.url().should("eq", "https://tuticket.space/login");
    cy.contains("h2", "Iniciar sesión").should("be.visible");

    
    // 2. Iniciar sesión como ADMIN
    cy.get('input[name="email"]').type("sofia1@mail.com");
    cy.get('input[name="password"]').type("hash21");

    cy.contains("button", "Iniciar sesión").click();


    // 3. Debe redirigir a la pantalla de admin
    cy.url().should("eq", "https://tuticket.space/home-admin");  
    cy.contains("Ajustes de la plataforma").should("be.visible");

    // Verificar que la tarjeta "Configurar Comisión" existe
    cy.contains("Configurar Comisión")
      .scrollIntoView()
      .should("be.visible");


    // 4. Entrar a la pantalla de Configurar Comisión
    cy.contains("Configurar Comisión")
      .parent()               // contenedor de título + descripción
      .parent()               // contenedor de la tarjeta completa
      .find("button")         // botón circular verde
      .click();


    // 5. Validar llegada a la pantalla real de parámetros
    cy.url().should("eq", "https://tuticket.space/configparams");

    cy.contains("Parámetros de la plataforma").should("be.visible");
    cy.contains("Comisión Global (%)").should("be.visible");


    // 6. Llenar el campo de comisión con un número distinto
    cy.get("#comisionGlobal")
      .invoke("val")
      .then((currentValue) => {

        const newValue = currentValue === "7.5" ? "8.2" : "7.5";

        cy.get("#comisionGlobal")
          .clear()
          .type(newValue);
      });


    // 7. Capturar el alert del navegador al guardar
    cy.on("window:alert", (msg) => {
      expect(msg).to.equal("Parámetros guardados correctamente.");
    });

    cy.contains("button", "Guardar configuración").click();


    // 8. Después de aceptar el alert, debe volver al panel admin
    cy.url().should("eq", "https://tuticket.space/home-admin");

    cy.contains("Ajustes de la plataforma").should("be.visible");
  });

});
