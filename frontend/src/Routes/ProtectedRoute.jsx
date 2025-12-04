
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Ajusta la ruta a tu AuthContext

export const ProtectedRoute = ({ children, role = null }) => {
  //Envolver dentro de este componente las páginas que necesitan estar autenticadas
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location.pathname,
          data: location.state,
        }}
        replace
      />
    );
  }

  if (role && user.rol !== role) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <h2>No autorizado</h2>
        <p>No tienes permisos para acceder a esta página.</p>
      </div>
    );
  }

  return children;
};
