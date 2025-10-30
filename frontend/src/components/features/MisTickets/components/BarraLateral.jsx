export const BarraLateral = () => {
    return (
    <aside className='bg-light border-end p-3' style={{ minWidth: '220px', height: '100vh' }}>
        <h5 className='mb-4'>TuTicket</h5>
        <nav className='nav flex-column'>
          <a className='nav-link' href='/perfil'>Mi perfil</a>
          <a className='nav-link' href='/miseventos'>Mis Eventos</a>
          <a className='nav-link active fw-bold' href='/mistickets'>Mis Tickets</a>
          <a className='nav-link' href='/faq'>Preguntas frecuentes</a>
          <a className='nav-link' href='/privacidad'>Política de Privacidad</a>
        </nav>
      </aside>
    )
}