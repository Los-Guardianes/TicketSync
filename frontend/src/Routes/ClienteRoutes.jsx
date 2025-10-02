import { Routes, Route, Navigate } from "react-router-dom";
import { Home } from "../components/pages/Home/Home";
import { Login } from "../components/pages/LogIn/Login";
import { Register } from "../components/pages/Register/Register";
import { GoogleVerification } from "../components/pages/GoogleVerification/GoogleVerification";
import { CreateEvent } from "../components/pages/CreateEvent/CreateEvent";
import { UbicacionEvento } from "../components/pages/CreateEvent/UbicacionEvento";

export const ClienteRoutes = () => {
  //Este es el enrutador, cada link lo redirige a la pagina
  // Tengan en cuenta que en el navbar el to es a que url se redirige
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="home" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="verification" element={<GoogleVerification />} />
      <Route path="create-event" element={<CreateEvent />} />
      <Route path="ubicacion-evento" element={<UbicacionEvento />} />
    </Routes>
  );
};
