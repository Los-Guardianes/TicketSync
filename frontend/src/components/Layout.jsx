import { useLocation, Outlet } from 'react-router-dom';
import { NavBar } from './common/NavBar'
import { Header } from './common/Header/Header';
import { Footer } from './common/Footer';

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/home';
  
  return (
    <div>
      {/* Header condicional */}
      {isHomePage ? ( <NavBar /> ) : ( <Header/> )}
      
      {/* Contenido principal con margen condicional */}
      <main style={isHomePage ? {} : { paddingTop: 'var(--margin-top-header)' }}>
        <Outlet />
      </main>
      
      {/* Footer (puede ser el mismo o también condicional) */}
      <Footer/>
    </div>
  );
};

export default Layout;