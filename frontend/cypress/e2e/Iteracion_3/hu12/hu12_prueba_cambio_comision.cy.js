// cypress/e2e/HU3-admin-config-comision.cy.js

describe("HU3 - Configuración de Comisión (Admin)", () => {

  it("Debe permitir al administrador modificar la comisión global y regresar al panel admin", () => {

    // 1. Ir a home e iniciar login
    cy.visit("http://localhost:5173/home");

    cy.contains("Login").click();

    // Validar pantalla de login
    cy.url().should("eq", "http://localhost:5173/login");
    cy.contains("h2", "Iniciar sesión").should("be.visible");

    
    // 2. Iniciar sesión como ADMIN
    cy.get('input[name="email"]').type("sofia1@mail.com");
    cy.get('input[name="password"]').type("hash21");

    cy.contains("button", "Iniciar sesión").click();


    // 3. Debe redirigir a la pantalla de admin
    cy.url().should("eq", "http://localhost:5173/home-admin");  
    cy.contains("Ajustes de la plataforma").should("be.visible");

    // Verificar que el botón/tarjeta "Configurar Comisión" existe
    cy.contains("Configurar Comisión").scrollIntoView().should("be.visible");


    // 4. Entrar a la pantalla de Configurar Comisión
    // En tu JSX, cada tarjeta tiene un botón redondo con el ícono.
    // Para seleccionarlo, basta con usar el título + botón siguiente.
    cy.contains("Configurar Comisión")
      .parent()               // Accede al contenedor de título+descripción
      .parent()               // Accede al contenedor total de la tarjeta
      .find("button")         // Botón circular verde
      .click();

    // 🔽 Aquí es donde tu compañero aún no ha entregado la pantalla.
    //   Suponemos que te llevará a una URL similar a:
    //     http://localhost:5173/admin/comision
    //   La prueba NO falla si esta URL cambia, solo ajustas esta línea.


    // 5. Validar llegada a pantalla de comisión
    cy.url().should("include", "/admin/comision"); 
    // TODO: Ajustar esto cuando el componente final exista.

    // TODO: Ajustar selector cuando sepamos el título real de la pantalla
    cy.contains("Parámetros de la plataforma").should("be.visible");


    // 6. Llenar el campo de comisión (valor decimal 7.5)
    // TODO: Reemplazar 'input[name="comision"]' por el selector real
    cy.get('input[name="comision"]')
      .clear()
      .type("7.5");


    // 7. Guardar configuración
    // TODO: Ajustar selector del botón si cambia su texto
    cy.contains("button", "Guardar configuración").click();


    // 8. Después de guardar, debe volver al panel admin
    cy.url().should("eq", "http://localhost:5173/home-admin");

    cy.contains("Ajustes de la plataforma").should("be.visible");
  });

});
