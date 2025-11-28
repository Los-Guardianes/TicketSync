
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Ajusta la ruta a tu AuthContext

export const ProtectedRoute = ({ children }) => {
  //Envolver dentro de este componente las páginas que necesitan estar autenticadas con cualquier ROL como mínimo.
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // 1. Si el usuario NO está autenticado...
    // 2. Lo redirigimos a "/login".
    // 3. Le pasamos la ubicación actual (`location.pathname`) en el 'state'.
    //    (Así el login sabrá a dónde regresar)
    return <Navigate 
      to="/login"       
      state={{ 
        from: location.pathname,  // A dónde ibas (ej: "/ticket-pay")
        data: location.state      // TODA la data que llevabas (que incluye tu returnTo)
      }} 
      replace  //evitar que el login quede en el historial
    />;
  }
  // Si el usuario SÍ está autenticado, simplemente renderiza la página
  // que se supone que debía ver (los 'children').
  return children;
};