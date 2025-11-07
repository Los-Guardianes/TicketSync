import React from 'react';
import AdminSidebar from './AdminSidebar';
import './AdminDashboard.css';

export const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      {/* Barra lateral */}
      <AdminSidebar />

      {/* Contenido principal */}
      <div className="admin-main-content">
        <h1>Bienvenido al Panel de Administrador</h1>
      </div>
    </div>
  );
};

export default AdminDashboard;
