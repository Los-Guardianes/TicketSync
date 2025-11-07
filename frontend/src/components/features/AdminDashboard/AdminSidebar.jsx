import React from 'react';
import { FaFileAlt, FaChartLine, FaUsers, FaCalendarAlt } from 'react-icons/fa'; // 👈 importamos los íconos
import './AdminDashboard.css';

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
      {/* Logo superior */}
      <div className="admin-logo">
        <span className="logo-icon">🎟️</span> TuTicket Admin
      </div>

      {/* Menú lateral */}
      <ul>
        <li className="active">
          <FaFileAlt className="icon" /> {/*Icono de reporte */}
          Reporte
        </li>
        <li>
          <FaChartLine className="icon" /> {/*Icono de categorías */}
          Categorías
        </li>
        <li>
          <FaUsers className="icon" /> {/* Icono de usuarios */}
          Usuarios
        </li>
        <li>
          <FaCalendarAlt className="icon" /> {/*Icono de eventos */}
          Eventos
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
