describe("Login", () => {
  it("muestra errores de validación cuando faltan campos", () => {
    cy.visit("/login");
    cy.contains("button","Iniciar sesión").click();
    cy.contains("El correo es requerido").should("be.visible");
    cy.contains("La contraseña es requerida").should("be.visible");
  });

  it("login exitoso (stub de API) redirige a /home", () => {
    cy.intercept("POST", "http://localhost:8080/api/login", {
      statusCode: 200,
      body: { token: "fake-jwt" },
    }).as("login");

    cy.visit("/login");
    cy.get('input[name="email"]').type("user@test.com");
    cy.get('input[name="password"]').type("secret");
    cy.contains("button","Iniciar sesión").click();
    cy.wait("@login").its("request.body").should("deep.include", {
      email: "user@test.com",
    });

    // si tu app guarda auth en localStorage, verificamos
    cy.window().then((w) => {
      const auth = JSON.parse(w.localStorage.getItem("auth") || "null");
      expect(auth?.token).to.exist;
    });

    // Ajusta esto si tu navegación post-login es diferente
    cy.url().should("include", "/home");
  });
});
