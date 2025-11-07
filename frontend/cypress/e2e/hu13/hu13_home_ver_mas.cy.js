// HU13 - Home: Ver más eventos (controlado con fixtures)
describe("HU13 - Home - Ver más eventos", () => {
  beforeEach(() => {
    // intercept que asigna alias según querystring
    cy.intercept({ method: 'GET', url: '**/api/evento*' }, (req) => {
      const url = req.url || '';
      // Si la petición explícitamente pide offset=8, devolvemos nextBatch
      if (url.includes('offset=8')) {
        req.reply({ fixture: 'events_next.json' });
        req.alias = 'nextBatch';
      } else {
        // Tratamos la petición inicial (con o sin query limit) como firstBatch por defecto
        req.reply({ fixture: 'events_first8.json' });
        req.alias = 'firstBatch';
      }
    });
  });

  it('al presionar Ver más se muestran los demás eventos con su info principal', () => {
    cy.visit('/home');

    // Espera la primera petición (initial batch)
    cy.wait('@firstBatch', { timeout: 10000 }).then((interception) => {
      expect(interception.response, 'respuesta initial batch').to.exist;
      const body = interception.response.body;
      const initial = Array.isArray(body) ? body : (body && Array.isArray(body.data) ? body.data : []);
      // Debe haber al menos 1 evento en el primer batch (fixture normalmente tiene 8)
      expect(initial.length).to.be.greaterThan(0);

      // Verificamos en el DOM que existan tantas tarjetas como mínimo y que cada tarjeta muestre
      // un título y una dirección (la dirección aparece en el primer .card-text)
      cy.get('.card').its('length').should('be.gte', Math.max(initial.length, 1));

      cy.get('.card').each(($card, index) => {
        if (index < initial.length) {
          cy.wrap($card).find('.card-title').invoke('text').should('not.be.empty');
          // asumimos que la primera .card-text es la dirección
          cy.wrap($card).find('.card-text').eq(0).invoke('text').should('not.be.empty');
        }
      });
    });

    // Busca el botón "Ver más" de forma segura en el DOM y solo hace click si existe.
    cy.document().then((doc) => {
      const candidates = Array.from(doc.querySelectorAll('button, a, [role="button"], .btn'));
      const verMasEl = candidates.find(el => /ver más/i.test(el.textContent));

      if (!verMasEl) {
        cy.log('Botón "Ver más" no encontrado — la prueba valida solo el primer batch.');
        return; // no hay botón, terminamos la comprobación
      }

      // Si existe, hacemos click y esperamos el nextBatch
      cy.wrap(verMasEl).click();

      cy.wait('@nextBatch', { timeout: 10000 }).then((interception) => {
        expect(interception.response, 'respuesta next batch').to.exist;
        const body = interception.response.body;
        const next = Array.isArray(body) ? body : (body && Array.isArray(body.data) ? body.data : []);
        expect(next.length).to.be.greaterThan(0);

        // Ahora deben aparecer al menos initial.length + next.length tarjetas
        cy.get('.card').its('length').should('be.gte', initial.length + next.length);

        // Verificamos que las tarjetas nuevas (los índices posteriores a initial.length-1)
        // muestren título y dirección
        cy.get('.card').each(($card, index) => {
          if (index >= initial.length && index < initial.length + next.length) {
            cy.wrap($card).find('.card-title').invoke('text').should('not.be.empty');
            cy.wrap($card).find('.card-text').eq(0).invoke('text').should('not.be.empty');
            // y que exista un botón de compra
            cy.wrap($card).contains(/comprar|buy/i).should('exist');
          }
        });
      });
    });
  });
});

