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
//Prueba
import AdminDashboard from "../components/features/AdminDashboard/AdminDashboard";


import { MisEventos as OrgMisEventos } from "../components/features/Organizer/pages/MisEventos";
import { ConfigEvento } from "../components/features/ConfigEvento/pages/ConfigEvento";

import { CreateDiscount } from "../components/features/MisEventosProvisional/pages/CreateDiscount";
import { DiscountList } from "../components/features/MisEventosProvisional/pages/DiscountList";
import CreateTickets1 from "../components/features/CreateEvent/pages/temp";
import {CreateTicket2} from "../components/features/CreateEvent/pages/temp2";

import { AdminHome } from "../components/features/AdminHome/pages/AdminHome";
import DetalleTickets from "../components/features/MisTickets/pages/DetalleTickets";
import {ForgotPassword} from "../components/features/LogIn/pages/ForgotPassword";
import {ResetPassword} from "../components/features/LogIn/pages/ResetPassword";

import  ImageUploader  from "../components/features/SubirImagenTest/SubirImagen"


export const ClienteRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />

      {/* SIN Layout */}
      <Route path="login" element={<Login />} />
      <Route path="/register" element={<RegisterOptions />} />
      <Route path="/register-client" element={<Register />} />
      <Route path="/register-organizer" element={<RegisterOrganizer />} />
      <Route path="verification" element={<GoogleVerification />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Para testeo del componente de s3 */}
      <Route path="/test-imagen" element={<ImageUploader />} />
      <Route path="home-admin" element={<AdminHome />} />

      {/* CON Layout */}
      <Route path="/*" element={<Layout />}>
        <Route path="home" element={<Home />} />
        <Route path="create-event" element={<CreateEvent />} />
        <Route path="ubicacion-evento" element={<UbicacionEvento />} />
        <Route path="create-ticket" element={<CreateTicket />} />
        <Route path="temp" element={<CreateTickets1 />} />
        <Route path="temp2" element={<CreateTicket2 />} />
        <Route path="ticket-purchase/:id" element={<TicketPurchase />} />
        <Route path="comprobante" element={<ComprobanteTest />} />
        <Route path="ticket-pay" element={<TicketPay />} />
        <Route path="happy-pay" element={<HappyPay />} />
        <Route path="mistickets" element={<MisTickets />} />

        //Prueba pantalla para Admin
         <Route path="admin-dashboard" element={<AdminDashboard />} />
        <Route path="organizer/mis-eventos" element={<OrgMisEventos />} />
        <Route path="organizer/evento/:idEvento/config" element={<ConfigEvento />} />

        <Route
          path="organizer/evento/:idEvento/descuentos/nuevo"
          element={<CreateDiscount />}
        />
        <Route
          path="organizer/evento/:idEvento/descuentos"
          element={<DiscountList />}
        />

        <Route path="mis-tickets/evento/:idEvento" element={<DetalleTickets />} />

        
      </Route>
    </Routes>
  );
};
