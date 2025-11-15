// cypress/e2e/HU2-ticket-purchase-and-pay.cy.js

describe('HU2 - Compra de tickets y pasarela (integración con backend)', () => {
  const base = 'http://localhost:5173';
  const email = 'mario1@mail.com';
  const pass = 'hash11';

  before(() => {
    // opcional: limpiar estado local/session si tu app lo necesita
    // cy.clearLocalStorage();
  });

  it('Flujo: login -> seleccionar evento -> seleccionar 2 tickets -> continuar -> pagar -> happy-pay', () => {

    // 1) Preparar "spies" para poder esperar las llamadas de red sin stubearlas (passthrough).
    // Ajusta las rutas si tu API usa endpoints diferentes.
    cy.intercept('GET', '**/api/**').as('apiGet');
    cy.intercept('POST', '**/api/**').as('apiPost');

    // 2) Ir a home y loguear usando el flujo UI (reutiliza el test que ya funciona)
    cy.visit(`${base}/home`);
    cy.contains('Login').click();

    cy.url().should('include', '/login');
    cy.get('input[name="email"]').should('be.visible').type(email);
    cy.get('input[name="password"]').type(pass);
    cy.contains('button', 'Iniciar sesión').click();

    // esperar que el login redirija al home y que aparezca el saludo
    cy.url({ timeout: 10000 }).should('match', /\/(home)?$/);
    cy.contains(/¡Hola, Mario!/, { timeout: 10000 }).should('be.visible');

    // 3) Buscar el evento "Teatro Clásico Arequipa" y hacer click en su "VER MÁS".
    // Nota: usamos .contains para ubicar el título del evento y luego buscamos el botón dentro del mismo contenedor.
    cy.contains('Teatro Clásico Arequipa', { timeout: 10000 })
      .should('be.visible')
      .parents() // sube en el DOM para encontrar el botón relacionado
      .contains(/VER MÁS|Ver más|Ver Más/) // tolerante a variantes de mayúsculas
      .click();

    // 4) Esperar a que cargue la página de compra y a las llamadas relacionadas
    cy.url({ timeout: 10000 }).should('include', '/ticket-purchase/2');

    // esperar al menos una llamada GET para datos del evento/funciones
    cy.wait('@apiGet', { timeout: 10000 });

    // 5) Seleccionar la primera opción del DropdownList (primera función disponible).
    // Intentamos manejar dos casos: si es un <select> nativo o un dropdown personalizado.
    cy.get('body').then(($body) => {
      if ($body.find('select').length) {
        // caso <select>
        cy.get('select').first().then($sel => {
          // seleccionar la segunda option (la primera suele ser "Selecciona una función")
          const optionValue = $sel.find('option').eq(1).attr('value');
          if (optionValue) {
            cy.wrap($sel).select(optionValue);
          } else {
            // fallback: seleccionar por índice
            cy.wrap($sel).select(1);
          }
        });
      } else {
        // caso dropdown personalizado: intentar abrir y clicar la primera opción.
        // Ajusta los selectores si tu componente usa otras clases/data-attrs.
        cy.get('[data-cy="dropdown-funciones"]').first().click({ force: true }).then(() => {
          cy.get('[data-cy="dropdown-option"]').first().click({ force: true });
        });
      }
    });

    // esperar a que el UI se actualice y muestre las filas de selección de tickets
    cy.get('.ticket-purchase-section, .shopping-details, .ticket-purchase-content', { timeout: 10000 })
      .should('exist');

    // 6) Aumentar la cantidad del primer tipo de entrada hasta 2 (presionar + dos veces).
    // Buscamos el primer botón "+" dentro del área de detalles de compra.
    cy.get('body').then(($body) => {
      // Intentamos selectores comunes; si tu app tiene clases distintas, ajústalas.
      if ($body.find('.shopping-details').length) {
        // buscar el primer bloque de detalle y dentro de él el botón de "+"
        cy.get('.shopping-details').first().within(() => {
          // botón que contiene '+'
          cy.contains('+').click().click();
        });
      } else {
        // fallback genérico: buscar el primer botón cuyo texto sea '+'
        cy.contains('+').first().click().click();
      }
    });

    // Verificar que el contador muestre "2" en la primera fila
    // Buscamos un elemento que contenga el número 2 cerca del primer "+".
    cy.get('body').should(() => {
      // una verificación flexible: el DOM debe contener "2" dentro de la sección de compra
      expect(Cypress.$('.ticket-purchase-section').text()).to.match(/2/);
    });

    // 7) Hacer clic en "Continuar al pago"
    cy.contains('button', /Continuar al pago/i, { timeout: 10000 }).click();

    // 8) Esperar a que la ruta cambie a /ticket-pay y que se carguen los datos (GET)
    cy.url({ timeout: 10000 }).should('include', '/ticket-pay');
    cy.wait('@apiGet', { timeout: 10000 });

    // 9) Verificar que el resumen muestre el total que esperas (ej. S/ 190.00)
    // Ajusta la expectativa si tu backend calcula otro total.
    cy.get('body').then(($body) => {
      // buscar el elemento fuerte que contiene el total
      const strong = $body.find('.tp-total strong');
      if (strong.length) {
        cy.get('.tp-total strong').should('contain.text', 'S/').and('contain.text', '190');
      } else {
        // fallback: buscar "Total a pagar"
        cy.contains('Total a pagar').parent().should('contain.text', 'S/ 190');
      }
    });

    // 10) Completar el formulario de pago con los valores proporcionados
    cy.get('#CardNumber').should('be.visible').clear().type('1234 5678 9012 3456');
    cy.get('#CVV').clear().type('123');

    // Para la fecha de vencimiento el componente formatea; escribir 0830 producirá 08/30
    cy.get('#fechaVencimiento').clear().type('0830');

    cy.get('#metodoPago').clear().type('ABC');

    // 11) Click en "Pagar" y esperar la petición POST que crea la orden.
    // Como no stubemos la petición, la petición real llegará al backend.
    // Usamos el alias creado más arriba para poder esperarla.
    cy.contains('button', 'Pagar').click();

    // esperar la petición POST que crea la orden (timeout amplio por si el backend tarda)
    cy.wait('@apiPost', { timeout: 20000 }).then((interception) => {
      // inspeccionar status (si tu backend responde 201/200 etc.)
      expect(interception.response).to.exist;
      expect([200, 201, 202]).to.include(interception.response.statusCode);
    });

    // 12) Finalmente verificar que redirige a /happy-pay (pago exitoso)
    cy.url({ timeout: 20000 }).should('include', '/happy-pay');

    // opcional: verificar que en la pantalla de happy-pay exista el id de orden o texto de éxito
    cy.contains(/¡Pago realizado|Gracias|Compra/i, { timeout: 10000 }).should('exist');
  });
});
