import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';

export const BarraLateral = () => {
  const { user } = useAuth();

  // normalizamos rol
  const esOrganizador = (user?.rol ?? '').toString().toUpperCase() === 'ORGANIZADOR';

  return (
    <aside
      className="bg-light border-end p-3"
      style={{ minWidth: '220px', height: '100vh' }}
    >
      <h5 className="mb-4">TuTicket</h5>

      <nav className="nav flex-column">
        {/* Mi perfil */}
        <NavLink
          to="/home"
          end
          className={({ isActive }) =>
            'nav-link' + (isActive ? ' active fw-bold' : '')
          }
        >
          Mi perfil
        </NavLink>

        {/* Mis Eventos (solo visible/clicable si es organizador) */}
        {esOrganizador ? (
          <NavLink
            to="/organizer/mis-eventos"
            className={({ isActive }) =>
              'nav-link' + (isActive ? ' active fw-bold' : '')
            }
          >
            Mis Eventos
          </NavLink>
        ) : (
          <span
            className="nav-link disabled"
            aria-disabled="true"
            title="Disponible para organizadores"
          >
            Mis Eventos
          </span>
        )}

        {/* Mis Tickets */}
        <NavLink
          to="/mistickets"
          end
          className={({ isActive }) =>
            'nav-link' + (isActive ? ' active fw-bold' : '')
          }
        >
          Mis Tickets
        </NavLink>

        {/* FAQ / Privacidad */}
        <NavLink to="/faq" className="nav-link">
          Preguntas frecuentes
        </NavLink>
        <NavLink to="/privacidad" className="nav-link">
          Política de Privacidad
        </NavLink>
      </nav>
    </aside>
  );
};
