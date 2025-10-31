import { useLocation, Outlet } from 'react-router-dom';
import { NavBar } from './NavBar';
import { Header } from '../common/Header/Header';
import { Footer } from '../common/Footer/Footer';
import { useState, useEffect, use } from 'react';
import { getDepartamentos } from '../../globalServices/UbicacionService';
import { getCategorias } from '../../globalServices/CategoriaService';

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
    const data = await getCategorias();
    console.log(data);
    setCategoriasDisponibles(data);
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
        />
      ) : (
        <Header />
      )}

      <main style={isHomePage ? {} : { paddingTop: 'var(--margin-top-header)' }}>
        <EventCreationProvider>
          {/* Home (y otras páginas) leen los filtros aquí */}
          <Outlet context={{ search, precio, ubicacion, fecha }} />
        </EventCreationProvider>
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
