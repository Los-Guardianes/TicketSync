import { useLocation, Outlet } from 'react-router-dom';
import { NavBar } from './NavBar';
import { Header } from '../common/Header/Header';
import { Footer } from '../common/Footer/Footer';
import { useState, useEffect, use } from 'react';
import { getDepartamentos } from '../../globalServices/UbicacionService';

import { EventCreationProvider } from '../../context/EventCreationContext'; // 👈 1. Importa el Provider
const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/home';

  const [search, setSearch] = useState('');
  const [precio, setPrecio] = useState(1000);
  const [ubicacion, setUbicacion] = useState('Todas');
  const [fecha, setFecha] = useState(['', '']);
  // categoría
  const [categoria, setCategoria] = useState('Todas');
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);



  // ubicaciones dinámicas (dptos)
  const [ubicacionesDisponibles, setUbicacionesDisponibles] = useState([]);


  const dptoFetch = async () => {
    const data = await getDepartamentos();
    console.log(data);
    setUbicacionesDisponibles(data);
  };
  // categorías dinámicas 
  const categoriaFetch = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/evento'); // ruta de tus eventos
      const data = await response.json();

      // derivar categorías únicas desde los eventos
      const categorias = [...new Set(data.map(ev => ev.categoria?.nombre || 'Sin categoría'))];
      console.log('categorías derivadas:', categorias);
      setCategoriasDisponibles(categorias);
    } catch (error) {
      console.error('Error al obtener eventos para categorías:', error);
    }
  };

  useEffect(() => {
    if (isHomePage) {
      dptoFetch();
      categoriaFetch();
    }
  }, []);


  return (
    <div>
      {isHomePage ? (
        <NavBar
          search={search} setSearch={setSearch}
          precio={precio} setPrecio={setPrecio}
          ubicacion={ubicacion} setUbicacion={setUbicacion}
          fecha={fecha} setFecha={setFecha}
          ubicacionesDisponibles={ubicacionesDisponibles}
          categoria={categoria} setCategoria={setCategoria}
          categoriasDisponibles={categoriasDisponibles}
        />
      ) : (
        <Header />
      )}

      <main style={isHomePage ? {} : { paddingTop: 'var(--margin-top-header)' }}>
        <EventCreationProvider>
          {/* Home (y otras páginas) leen los filtros aquí */}
          <Outlet context={{ search, precio, ubicacion, fecha, categoria }} />
        </EventCreationProvider>
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
