// cypress/e2e/HU1-registro-cliente.cy.js

describe('HU1 - Registro de Cliente', () => {
  
  beforeEach(() => {
    cy.visit('https://tuticket.space/home');
  });

  it('Prueba 1: Debe navegar correctamente al formulario de registro de cliente', () => {
    // Presionar botón "Registrarse" en el NavBar de la pantalla de inicio
    cy.contains('Registrarse').click();
    
    // Verificar que estamos en la pantalla de opciones de registro
    cy.url().should('eq', 'https://tuticket.space/register');
    cy.contains('h2', 'Registrate').should('be.visible');
    
    // Verificar que aparecen los 3 botones
    cy.contains('button', 'Registrarse como cliente').should('be.visible');
    cy.contains('button', 'Registrarse como organizador').should('be.visible');
    cy.contains('button', 'Volver al inicio').should('be.visible');
    
    // Presionar "Registrarse como cliente"
    cy.contains('button', 'Registrarse como cliente').click();
    
    // Verificar que aparece el formulario de registro de cliente
    cy.url().should('eq', 'https://tuticket.space/register-client');
    cy.contains('h2', 'Bienvenidos a tu ticket').should('be.visible');
    
    // Verificar que el formulario está presente
    cy.get('#inpNombre').should('be.visible');
    cy.get('#inpEmail').should('be.visible');
  });

  it('Prueba 2: Debe registrar exitosamente un nuevo cliente con datos válidos', () => {
    // Navegar directamente al formulario de registro de cliente
    cy.visit('https://tuticket.space/register-client');
    
    // Generar un correo único para evitar conflictos en múltiples ejecuciones
    const timestamp = Date.now();
    const emailUnico = `usuario${timestamp}@mail.com`;
    
    // Llenar el formulario con datos válidos
    cy.get('#inpNombre').type('Pedro');
    cy.get('#inpApellido').type('Navaja');
    cy.get('#inpEmail').type(emailUnico);
    cy.get('#inpPassword').type('miPerritoFiel123');
    cy.get('#inpConfirmPassword').type('miPerritoFiel123');
    cy.get('#inpDNI').type('94231568');
    cy.get('#inpCelular').type('990990991');
    cy.get('#inpFechaNac').type('2000-02-15'); // Formato yyyy-mm-dd para input type="date"
    
    // Seleccionar ciudad (el dropdown personalizado - busca por texto visible)
    cy.get('select').select('Lima Metropolitana');
    
    // Marcar ambos checkboxes
    cy.get('#flexCheckTermino').check();
    cy.get('#flexCheckAdicional').check();
    
    // Presionar botón Registrar
    cy.contains('button', 'Registrar').click();
    
    // Verificar que redirige a la pantalla de inicio
    // Nota: Puede tardar un poco por la petición al backend
    cy.url().should('eq', 'https://tuticket.space/home', { timeout: 10000 });
  });

  it('Prueba 3: Debe mostrar error al intentar registrar un correo duplicado', () => {
    // Navegar directamente al formulario de registro de cliente
    cy.visit('https://tuticket.space/register-client');
    
    // Llenar el formulario con un correo que ya existe (mario1@mail.com)
    cy.get('#inpNombre').type('MANO');
    cy.get('#inpApellido').type('mendez');
    cy.get('#inpEmail').type('mario1@mail.com'); // Correo duplicado
    cy.get('#inpPassword').type('password123');
    cy.get('#inpConfirmPassword').type('password123');
    cy.get('#inpDNI').type('58964723');
    cy.get('#inpCelular').type('966933911');
    cy.get('#inpFechaNac').type('1993-02-13');
    
    // Seleccionar ciudad
    cy.get('select').select('Huancayo');
    
    // Marcar checkboxes
    cy.get('#flexCheckTermino').check();
    cy.get('#flexCheckAdicional').check();
    
    // Presionar botón Registrar
    cy.contains('button', 'Registrar').click();
    
    // Verificar que aparece el mensaje de error
    cy.contains('Ocurrió un error al registrar el usuario', { timeout: 10000 })
      .should('be.visible');
    
    // Verificar que NO redirige (debe permanecer en la misma página)
    cy.url().should('include', '/register-client');
  });

});