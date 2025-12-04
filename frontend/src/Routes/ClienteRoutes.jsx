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


import { MisEventos as OrgMisEventos } from "../components/features/MisEventos/pages/MisEventos";
import { ConfigEvento } from "../components/features/ConfigEvento/pages/ConfigEvento";
import { EditEvent } from "../components/features/ConfigEvento/pages/EditEvent";

import { CreateDiscount } from "../components/features/Descuentos/pages/CreateDiscount";
import { DiscountList } from "../components/features/Descuentos/pages/DiscountList";

import { AdminHome } from "../components/features/AdminHome/pages/AdminHome";
import { ConfigUsers } from "../components/features/AdminHome/pages/ConfigUsers";
import { ConfigParams } from "../components/features/AdminHome/pages/ConfigParams";
import { EditarUbicacion } from "../components/features/ConfigEvento/pages/EditarUbicacion";
import { GestionTarifas } from "../components/features/ConfigEvento/pages/GestionTarifas";
import { ConfigCategorias } from "../components/features/AdminHome/pages/ConfigCategorias";
import DetalleTickets from "../components/features/MisTickets/pages/DetalleTickets";
import { ForgotPassword } from "../components/features/LogIn/pages/ForgotPassword";
import { ResetPassword } from "../components/features/LogIn/pages/ResetPassword";
import { MiPerfil } from "../components/features/Perfil/pages/MiPerfil";
import ImageUploader from "../components/features/SubirImagenTest/SubirImagen"
import { ProtectedRoute } from "./ProtectedRoute";
import { ConfigReportes } from "../components/features/AdminHome/pages/ConfigReportes";

import { ListadoInscritos } from "../components/features/ConfigEvento/pages/ListadoInscritos";
import { Edit } from "lucide-react";

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

      <Route path="/test-imagen" element={<ImageUploader />} />
      <Route path="home-admin" element={<ProtectedRoute role="ADMINISTRADOR"> <AdminHome /> </ProtectedRoute>} />

      {/* CON Layout */}
      <Route path="/*" element={<Layout />}>
        <Route path="home" element={<Home />} />
        <Route path="create-event" element={<ProtectedRoute role="ORGANIZADOR"> <CreateEvent /> </ProtectedRoute>} />
        <Route path="ubicacion-evento" element={<ProtectedRoute role="ORGANIZADOR"> <UbicacionEvento /> </ProtectedRoute>} />
        <Route path="create-ticket" element={<ProtectedRoute role="ORGANIZADOR"> <CreateTicket /> </ProtectedRoute>} />
        <Route path="ticket-purchase/:id" element={<TicketPurchase />} />
        <Route path="ticket-pay" element={<ProtectedRoute> <TicketPay /> </ProtectedRoute>} />
        <Route path="happy-pay" element={<ProtectedRoute> <HappyPay /> </ProtectedRoute>} />
        <Route path="mistickets" element={<ProtectedRoute> <MisTickets /> </ProtectedRoute>} />

        <Route path="admin-dashboard" element={<ProtectedRoute role="ADMINISTRADOR"> <AdminDashboard /> </ProtectedRoute>} />
        <Route path="configusers" element={<ProtectedRoute role="ADMINISTRADOR"> <ConfigUsers /> </ProtectedRoute>} />
        <Route path="configparams" element={<ProtectedRoute role="ADMINISTRADOR"> <ConfigParams /> </ProtectedRoute>} />
        <Route path="configcategorias" element={<ProtectedRoute role="ADMINISTRADOR"> <ConfigCategorias /> </ProtectedRoute>} />
        <Route path="configreportes" element={<ProtectedRoute role="ADMINISTRADOR"> <ConfigReportes /> </ProtectedRoute>} />
        <Route path="organizer/mis-eventos" element={<ProtectedRoute role="ORGANIZADOR"> <OrgMisEventos /> </ProtectedRoute>} />
        <Route path="organizer/evento/:idEvento/config" element={<ProtectedRoute role="ORGANIZADOR"> <ConfigEvento /> </ProtectedRoute>} />
        <Route
          path="organizer/evento/:idEvento/editar-ubicacion"
          element={
            <ProtectedRoute role="ORGANIZADOR">
              <EditarUbicacion />
            </ProtectedRoute>
          }
        />
        <Route
          path="organizer/evento/:idEvento/tarifas"
          element={
            <ProtectedRoute role="ORGANIZADOR">
              <GestionTarifas />
            </ProtectedRoute>
          }
        />
        <Route
          path="organizer/evento/:idEvento/editar-detalles"
          element={<ProtectedRoute role="ORGANIZADOR"> <EditEvent /> </ProtectedRoute>}
        />
        <Route
          path="organizer/evento/:idEvento/descuentos/nuevo"
          element={<ProtectedRoute role="ORGANIZADOR"> <CreateDiscount /> </ProtectedRoute>}
        />
        <Route
          path="organizer/evento/:idEvento/descuentos"
          element={<ProtectedRoute role="ORGANIZADOR"> <DiscountList /> </ProtectedRoute>}
        />

        <Route
          path="organizer/evento/:idEvento/inscritos"
          element={<ProtectedRoute role="ORGANIZADOR"> <ListadoInscritos /> </ProtectedRoute>}
        />

        <Route path="mis-tickets/evento/:idEvento" element={<ProtectedRoute> <DetalleTickets /> </ProtectedRoute>} />
        <Route path="perfil" element={<ProtectedRoute> <MiPerfil /> </ProtectedRoute>} />

      </Route>
    </Routes>
  );
};
