
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Ajusta la ruta a tu AuthContext

export const ProtectedRoute = ({ children, role=null}) => {
  //Envolver dentro de este componente las páginas que necesitan estar autenticadas con cualquier ROL como mínimo.
  const { user } = useAuth();
  const location = useLocation();
  if (!user || (role && user.rol !== role)) {
    // 1. Si el usuario NO está autenticado... O no tiene el ROL adecuado...
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
  return children;
};