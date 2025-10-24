import { Routes, Route, Navigate } from "react-router-dom";

import { Home } from "../components/features/Home/pages/Home";
import { Login } from "../components/features/LogIn/pages/Login";
import { Register } from "../components/features/Register/Register";
import { GoogleVerification } from "../components/features/GoogleVerification/pages/GoogleVerification";
import { RegisterOptions } from "../components/features/Register/RegisterOptions";
import { RegisterOrganizer } from "../components/features/Register/RegisterOrganizer";
import { CreateEvent } from "../components/features/CreateEvent/pages/CreateEvent";
import { UbicacionEvento } from "../components/features/CreateEvent/pages/UbicacionEvento";
import { ComprobanteTest } from "../components/features/ComprobanteTest/pages/ComprobanteTest";
import { CreateTicket } from "../components/features/CreateEvent/pages/CreateTicket";
import { TicketPay } from "../components/features/TicketPurchase/pages/TicketPay";
import { TicketPurchase } from "../components/features/TicketPurchase/pages/TicketPurchase";
import { HappyPay } from "../components/features/TicketPurchase/pages/HappyPay";
import Layout from "../components/common/Layout";
import { MisTickets } from "../components/features/MisTickets/pages/MisTickets";
import { CreateDiscount } from "../components/features/CreateEvent/pages/CreateDiscount";

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
      

      {/* CON Layout - Rutas anidadas */}
      <Route path="/*" element={<Layout />}>
        <Route path="home" element={<Home />} />
        <Route path="create-event" element={<CreateEvent />} />
        <Route path="ubicacion-evento" element={<UbicacionEvento />} />
        <Route path="create-ticket" element={<CreateTicket />} />
        <Route path="ticket-purchase/:id" element={<TicketPurchase />} />
        <Route path="comprobante" element={<ComprobanteTest />} />
        <Route path="ticket-pay" element={<TicketPay />} />
        <Route path="happy-pay" element={<HappyPay />} />
        <Route path="mistickets" element={<MisTickets />} />
        <Route path="create-discount" element={<CreateDiscount />} />
      </Route>
    </Routes>
  );
};
