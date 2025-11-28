import React, { useState, useEffect } from "react";
import { getUsers, getUser, updateUser } from '../service/UserConfigService';
import { useNavigate } from 'react-router-dom';
import { UserTable } from '../components/UserTable';
import "./ConfigUsers.css";
import { OrgTable } from "../components/OrgTable";

export const ApproveOrg = () => {
  const [usersData, setUsersData] = useState([]);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState(""); // "", "asc", "desc"
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const navigate = useNavigate();

  // Cargar usuarios
  const fetchUsers = async () => {
    const data = await getUsers();
    setUsersData(data);
  };
  useEffect(() => {
    fetchUsers();
  }, [reloadTrigger]);

  // Filtrar solo organizadores pendientes
  const filteredUsers = usersData
    .filter((u) => {
      return (
        u.rol === "ORGANIZADOR" &&
        !u.verificado && // pendiente de aprobación
        (search
          ? u.nombre.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
          : true)
      );
    })
    .sort((a, b) => {
      if (sortOrder === "asc") return a.nombre.localeCompare(b.nombre);
      if (sortOrder === "desc") return b.nombre.localeCompare(a.nombre);
      return 0;
    });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

    const construirPayloadUsuario = (usuario, cambios = {}) => {
    let payload = {
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      hashCtr: usuario.hashCtr,
      verificado: usuario.verificado,
      telefono: usuario.telefono,
      rol: usuario.rol,
      activo: usuario.activo,
      ciudad: usuario.ciudad,
      ...cambios,
    };

    if (usuario.rol === "CLIENTE") {
      payload = {
        ...payload,
        dni: usuario.dni,
        fechaNacimiento: usuario.fechaNacimiento,
      };
    } else if (usuario.rol === "ORGANIZADOR") {
      payload = {
        ...payload,
        ruc: usuario.ruc,
        razonSocial: usuario.razonSocial,
      };
    }
    return payload;
  };

  // 🔹 Aprobar organizador
  const handleApprove = async (user) => {
    const confirm = window.confirm(`¿Aprobar al organizador ${user.nombre} ${user.apellido}?`);
    if (!confirm) return;
    try {
      const usuario = await getUser(user.idUsuario, user.rol);
      const payload = construirPayloadUsuario(usuario, {verificado: true}); // marcar como aprobado
      console.log(payload);
      await updateUser(payload, usuario.idUsuario);
      alert("Organizador aprobado correctamente.");
      setReloadTrigger((prev) => prev + 1);
    } catch (error) {
      alert("Error al aprobar organizador");
      console.log(error);
    }
  };

  return (
    <>
      <div className="config-users-wrapper">
        <div className="config-users-container">
          <div className="d-flex justify-content-start mt-3">
            <button
              className="btn btn-outline-primary w-auto"
              onClick={() => navigate("/home-admin")}
            >
              ← Volver
            </button>
          </div>

          {/* Filtros básicos */}
          <div className="filters">
            <div className="filters-left">
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="">Ordenar</option>
                <option value="asc">Nombre A-Z</option>
                <option value="desc">Nombre Z-A</option>
              </select>

              <input
                type="text"
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Tabla */}
          <OrgTable
            users={paginatedUsers}
            onApprove={handleApprove}
          />

          {/* Paginación */}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={currentPage === i + 1 ? "active" : ""}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};