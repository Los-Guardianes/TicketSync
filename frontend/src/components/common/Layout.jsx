import { useLocation, Outlet } from 'react-router-dom';
import { NavBar } from './NavBar';
import { Header } from '../common/Header/Header';
import { Footer } from '../common/Footer/Footer';
import { useState, useEffect } from 'react';
import { getDepartamentos } from '../../globalServices/UbicacionService';

import { EventCreationProvider } from '../../context/EventCreationContext';

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/home';

  // Filtros compartidos con Home
  const [search, setSearch] = useState('');
  const [ubicacion, setUbicacion] = useState('Todas');
  const [fechaInicio, setFechaInicio] = useState(''); // yyyy-mm-dd
  const [fechaFin, setFechaFin] = useState('');       // yyyy-mm-dd
  const [categoria, setCategoria] = useState('Todas'); // 'Todas' o id/nombre

  // listas dinámicas
  const [ubicacionesDisponibles, setUbicacionesDisponibles] = useState([]);
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);

  // Departamentos
  const dptoFetch = async () => {
    try {
      const data = await getDepartamentos();
      setUbicacionesDisponibles(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Error al obtener departamentos:', e);
      setUbicacionesDisponibles([]);
    }
  };

  // Categorías (si ya tienes endpoint propio usa /api/catevento)
  const categoriaFetch = async () => {
    try {
      //const resp = await fetch('https://api.tuticket.space/api/catevento'); // ← ajusta si corresponde
      const resp = await fetch('http://localhost/8080')
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const data = await resp.json();
      // Normaliza a un arreglo de strings (nombres) o de objetos {id, nombre}
      const cats = (Array.isArray(data) ? data : []).map(c => c.nombre ?? c);
      setCategoriasDisponibles(cats);
    } catch (e) {
      console.warn('Fallo /api/catevento, derivando desde /api/evento. Motivo:', e);
      try {
        //http://localhost:8080/api/evento https://api.tuticket.space/api/evento
        const r2 = await fetch('http://localhost:8080/api/evento');
        const evs = await r2.json();
        const cats = [...new Set((Array.isArray(evs) ? evs : [])
          .map(ev => ev.categoria?.nombre || 'Sin categoría'))];
        setCategoriasDisponibles(cats);
      } catch (e2) {
        console.error('Error al derivar categorías:', e2);
        setCategoriasDisponibles([]);
      }
    }
  };

  useEffect(() => {
    if (isHomePage) {
      dptoFetch();
      categoriaFetch();
    }
  }, [isHomePage]);

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
          categoriasDisponibles={categoriasDisponibles}
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
