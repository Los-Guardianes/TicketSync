import React, { useState, useEffect } from "react";
import { getUsers, getUser, updateUser } from '../service/UserConfigService';
import "./ConfigUsers.css";

export const ConfigUsers = () => {
  const [usersData, setUsersData] = useState([])
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsersData(data);
    console.log(data);
  };
  useEffect(() => {
    fetchUsers();
  }, [reloadTrigger]);

  const [search, setSearch] = useState("");
  const [rolFilter, setRolFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const filteredUsers = usersData.filter((u) => {
    return (
      (rolFilter ? u.rol === rolFilter : true) &&
      (estadoFilter ? u.estado === estadoFilter : true) &&
      (search
        ? u.nombre.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
        : true)
    );
  });

  const toggleActivo = async (id, rol, estadoActual) => {
    const nuevoEstado = !estadoActual;

    try {
      const usuario = await getUser(id, rol);
      console.log(usuario); 
      const actualizado = { ...usuario, activo: nuevoEstado };
      await updateUser(actualizado, rol);
      console.log(actualizado.idUsuario + " se actualizó");
      setUsersData((prev) =>
        prev.map((u) => (u.id === id ? actualizado : u))
      );
      setReloadTrigger((prev) => prev + 1);
    } catch (error) {
      alert("Error al cambiar estado");
      setUsersData((prev) =>
        prev.map((u) => (u.id === id ? actualizado : u))
      );
    }
  };

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="config-users-wrapper">
      <div className="config-users-container">
        {/* Filtros */}
        <div className="filters">
          <div className="filters-left">
            <select
              value={rolFilter}
              onChange={(e) => setRolFilter(e.target.value)}
            >
              <option value="">Rol</option>
              <option value="CLIENTE">CLIENTE</option>
              <option value="ADMINISTRADOR">ADMINISTRADOR</option>
            </select>

            <select
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value)}
            >
              <option value="">Estado</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>

            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="add-user-button">AGREGAR USUARIO</button>
        </div>

        {/* Tabla */}
        <table className="user-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.idUsuario}>
                <td>{user.nombre + ' ' + user.apellido}</td>
                <td>{user.rol}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={user.activo}
                    onChange={() => toggleActivo(user.idUsuario, user.rol, user.activo)}
                  />
                </td>
                <td>{user.email}</td>
                <td>{user.telefono}</td>
                <td>
                  <button className="details-button">Ver detalles</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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
  );
};