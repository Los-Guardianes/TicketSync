Cypress.Commands.add("loginUI", (email, password) => {
  cy.visit("/login");
  cy.get('input[name="email"]').clear().type(email);
  cy.get('input[name="password"]').clear().type(password);
  cy.contains("button","Iniciar sesión").click();
});

Cypress.Commands.add("loginAPI", (email, password) => {
  return cy.request({
    method: "POST",
    url: "https://api.tuticket.space/api/login",
    body: { email, password },
    failOnStatusCode: false,
  }).then((resp) => {
    // Guardar token en localStorage si viene como { token: "..." }
    const token = resp.body?.token;
    if (token) {
      window.localStorage.setItem("auth", JSON.stringify({ token }));
    }
    return resp;
  });
});

