import { useLocation, Outlet } from 'react-router-dom';
import { NavBar } from './NavBar';
import { Header } from '../common/Header/Header';
import { Footer } from '../common/Footer/Footer';
import { useState, useEffect, use } from 'react';
import { getDepartamentos } from '../../globalServices/UbicacionService';

import { EventCreationProvider } from '../../context/EventCreationContext';
const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/home';

  const [search, setSearch] = useState('');
  const [ubicacion, setUbicacion] = useState('Todas');
  const [fechaInicio, setFechaInicio] = useState(''); // yyyy-mm-dd
  const [fechaFin, setFechaFin] = useState('');       // yyyy-mm-dd
  const [categoria, setCategoria] = useState('Todas'); // 'Todas' o idCategoria (string)
  const [ubicacionesDisponibles, setUbicacionesDisponibles] = useState([]);


  const dptoFetch = async () => {
    const data = await getDepartamentos();
    console.log(data);
    setUbicacionesDisponibles(data);
  };

  useEffect(() => {
    isHomePage && dptoFetch();
  }, []);


  return (
    <div>
      {isHomePage ? (
        <NavBar
          search={search} setSearch={setSearch}
          ubicacion={ubicacion} setUbicacion={setUbicacion}
          fechaInicio={fechaInicio} setFechaInicio={setFechaInicio}
          fechaFin={fechaFin} setFechaFin={setFechaFin}
          categoria={categoria} setCategoria={setCategoria}
          ubicacionesDisponibles={ubicacionesDisponibles}
        />
      ) : (
        <Header />
      )}

      <main style={isHomePage ? {} : { paddingTop: 'var(--margin-top-header)' }}>
        <EventCreationProvider>
          {/* Home (y otras páginas) leen los filtros aquí */}
          <Outlet context={{ search, ubicacion, fechaInicio, fechaFin, categoria }} />
        </EventCreationProvider>
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
