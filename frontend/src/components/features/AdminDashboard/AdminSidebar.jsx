import React from 'react';
import './AdminDashboard.css';

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
      <div className="admin-logo">
        TuTicket Admin
      </div>
      <ul>
        <li className="active">Reporte</li>
        <li>Categorías</li>
        <li>Usuarios</li>
        <li>Eventos</li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
