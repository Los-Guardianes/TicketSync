
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children, role = null }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // ✅ Caso 1: Usuario NO autenticado → redirigir a login
  if (!isAuthenticated) {
    return <Navigate
      to="/login"
      state={{
        from: location.pathname,
        data: location.state
      }}
      replace
    />;
  }

  // ✅ Caso 2: Usuario autenticado pero sin el rol requerido → redirigir a /home
  if (role && user?.rol !== role) {
    return <Navigate
      to="/home"
      replace
    />;
  }

  // ✅ Caso 3: Usuario autenticado con el rol correcto → renderizar contenido
  return children;
};