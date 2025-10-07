import { Routes, Route, Navigate } from "react-router-dom";
import { Home } from "../components/pages/Home/Home";
import { Login } from "../components/pages/LogIn/Login";
import { Register } from "../components/pages/Register/Register";
import { GoogleVerification } from "../components/pages/GoogleVerification/GoogleVerification";
import { CreateTicket } from "../components/pages/Events/EventRegister/CreateTicket";
import { RegisterOptions } from "../components/pages/Register/RegisterOptions";
import { RegisterOrganizer } from "../components/pages/Register/RegisterOrganizer";
import { CreateEvent } from "../components/pages/CreateEvent/CreateEvent";
import { UbicacionEvento } from "../components/pages/CreateEvent/UbicacionEvento";
import { TicketPurchase } from "../components/pages/Me/Tickets/TicketPurchase/TicketPurchase";
import Layout from "../components/Layout";

export const ClienteRoutes = () => {
  //Este es el enrutador, cada link lo redirige a la pagina
  // Tengan en cuenta que en el navbar el to es a que url se redirige
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />

      {/* SIN Layout */}
      <Route path="login" element={<Login />} />
      <Route path="/register" element={<RegisterOptions />} />
      <Route path="/register-client" element={<Register />} />
      <Route path="/register-organizer" element={<RegisterOrganizer />} />
      <Route path="verification" element={<GoogleVerification />} />
      <Route path="createTicket" element={<CreateTicket />} /> // Momentaneo

      {/* CON Layout - Rutas anidadas */}
      <Route path="/*" element={<Layout />}>
        <Route path="home" element={<Home />} />
        <Route path="create-event" element={<CreateEvent />} />
        <Route path="ubicacion-evento" element={<UbicacionEvento />} />
        <Route path="ticket-purchase/:id" element={<TicketPurchase />} />
      </Route>
    </Routes>
  );
};
