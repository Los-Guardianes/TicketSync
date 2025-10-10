import { useLocation, Outlet } from 'react-router-dom';
import { NavBar } from './common/NavBar';
import { Header } from './common/Header/Header';
import { Footer } from './common/Footer';
import { useState, useEffect } from 'react';
import { getEventos } from '../services/EventoService'; // ruta desde /components

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/home';

  // filtros globales
  const [search, setSearch] = useState('');
  const [precio, setPrecio] = useState(1000);     // placeholder
  const [ubicacion, setUbicacion] = useState('Todas');
  const [fecha, setFecha] = useState('');

  // ubicaciones dinámicas (dptos)
  const [ubicacionesDisponibles, setUbicacionesDisponibles] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await getEventos();
      const dptos = Array.from(
        new Set(
          (data || [])
            .map(e => e?.ciudad?.dpto?.nombre)
            .filter(Boolean)
        )
      ).sort();
      setUbicacionesDisponibles(dptos);
    };
    load();
  }, []);

  return (
    <div>
      {isHomePage ? (
        <NavBar
          // valores + setters para que NavBar controle los filtros
          search={search} setSearch={setSearch}
          precio={precio} setPrecio={setPrecio}
          ubicacion={ubicacion} setUbicacion={setUbicacion}
          fecha={fecha} setFecha={setFecha}
          // lista dinámica para el select
          ubicacionesDisponibles={ubicacionesDisponibles}
        />
      ) : (
        <Header />
      )}

      <main style={isHomePage ? {} : { paddingTop: 'var(--margin-top-header)' }}>
        {/* Home (y otras páginas) leen los filtros aquí */}
        <Outlet context={{ search, precio, ubicacion, fecha }} />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
