import React, { useState, useEffect } from "react";
import { getUsers, getUser, updateUser, postAdmin } from '../service/UserConfigService';
import { getCiudades } from '../../../../globalServices/UbicacionService';
import "./ConfigUsers.css";

export const ConfigUsers = () => {
  const [usersData, setUsersData] = useState([])
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [selectedCiudad, setSelectedCiudad] = useState("Seleccionar ciudad");
  const [ciudad, setCiudad] = useState([]);

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsersData(data);
    console.log(data);
  };
  useEffect(() => {
    fetchUsers();
  }, [reloadTrigger]);
  const today = new Date().toISOString().split("T")[0];

  const [search, setSearch] = useState("");
  const [rolFilter, setRolFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    apellido: '',
    email: '',
    hashCtr: '',
    verificado: true,
    telefono: '',
    activo: true,
    ciudad: { "idCiudad": null },
    rol: 'ADMINISTRADOR',
  });
  useEffect(() => {
      const getCiudad = async () => {
          const data = await getCiudades();
          setCiudad(data);
      };
      getCiudad();
  }, []);

  const handleCrearUsuario = async () => {
    try {
      const error = validar();
      if (error) {
          alert(error);
          return;
      }
      const payload = {
        nombre: (nuevoUsuario.nombre || '').replace(/\s+/g, ' ').trim(),
        apellido: (nuevoUsuario.apellido || '').replace(/\s+/g, ' ').trim(),
        email: (nuevoUsuario.email || '').trim().toLowerCase(),
        hashCtr: nuevoUsuario.hashCtr, // el backend debe hashear
        verificado: true,
        telefono: (nuevoUsuario.telefono || '').replace(/\D/g, ''), // solo dígitos
        activo: true,
        ciudad: { idCiudad: nuevoUsuario.ciudad.idCiudad },
        rol: nuevoUsuario.rol
      };
      await postAdmin(payload);
      alert("Admin creado correctamente.");
      setShowAddUserModal(false);
      setNuevoUsuario({
        nombre: "",
        apellido: "",
        email: "",
        hashCtr: "",
        telefono: "",
        ciudad: { idCiudad: null },
      });
      setConfirmPassword("");
      setSelectedCiudad("Seleccionar ciudad");
      setReloadTrigger(prev => prev + 1);
    } catch (err) {
      console.error("Error al crear administrador", err);
      alert("No se pudo crear el administrador.");
    }
  };

  const validar = () => {
        const emailOk = /^\S+@\S+\.\S+$/.test((nuevoUsuario.email || '').trim());
        const celOk = /^\d{9}$/.test((nuevoUsuario.telefono || '').trim());
        const passOk = (nuevoUsuario.hashCtr || '').length >= 8;
        const passMatch = nuevoUsuario.hashCtr === confirmPassword;
        const ciudadOk = !!nuevoUsuario.ciudad.idCiudad;

        if (!(nuevoUsuario.nombre || '').trim()) return 'El nombre es obligatorio.';
        if (!(nuevoUsuario.apellido || '').trim()) return 'El apellido es obligatorio.';
        if (!emailOk) return 'Ingresa un correo válido.';
        if (!passOk) return 'La contraseña debe tener al menos 8 caracteres.';
        if (!passMatch) return 'Las contraseñas no coinciden.';
        if (!celOk) return 'El celular debe tener 9 dígitos.';
        if (!ciudadOk) return 'Debes seleccionar una ciudad.';
        return null;
    };

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
      
      const payload = {
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            hashCtr: usuario.hashCtr,
            verificado: usuario.verificado,
            telefono: usuario.telefono,
            activo: nuevoEstado,
            ciudad: usuario.ciudad,
            dni: usuario.dni,
            rol: usuario.rol,
            fechaNacimiento: usuario.fechaNacimiento
        };
      console.log(payload);
      await updateUser(payload, id);
      console.log(usuario.idUsuario + " se actualizó");
      setUsersData((prev) =>
        prev.map((u) => (u.id === id ? actualizado : u))
      );
      setReloadTrigger((prev) => prev + 1);
    } catch (error) {
      alert("Error al cambiar estado");
      console.log(error)
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

          <button className="add-user-button" onClick={() => setShowAddUserModal(true)}>
            AGREGAR USUARIO
          </button>
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
      {showAddUserModal && (
        <div className="add-user-modal-overlay">
          <div className="add-user-modal">
            <h4>Agregar nuevo usuario</h4>

            <div className="add-user-form">
              <input
                type="text"
                placeholder="Nombre"
                value={nuevoUsuario.nombre}
                onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
              />
              <input
                type="text"
                placeholder="Apellido"
                value={nuevoUsuario.apellido}
                onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, apellido: e.target.value })}
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={nuevoUsuario.email}
                onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
              />
              <input
                type="text"
                placeholder="Teléfono"
                value={nuevoUsuario.telefono}
                onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, telefono: e.target.value })}
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={nuevoUsuario.hashCtr}
                onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, hashCtr: e.target.value })}
              />
              <input
                type="password"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div className="dropdown">
                  <button className="btn btn-light dropdown-toggle " style={{ background: "#EBF5EB" }}
                      type="button"
                      id="dropdownMenuButton"
                      data-bs-toggle="dropdown"
                      aria-expanded="false">
                      {selectedCiudad}
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                      {ciudad.map((itemCiudad) => (
                          <li key={itemCiudad.idCiudad}>
                              <a className="dropdown-item" href="#"
                                  onClick={() => {
                                      setSelectedCiudad(itemCiudad.nombre);
                                      setNuevoUsuario({...nuevoUsuario, ciudad: { idCiudad: itemCiudad.idCiudad }});
                                  }}>
                                  {itemCiudad.nombre}
                              </a>
                          </li>
                      ))}
                  </ul>
              </div>
            </div>

            <div className="add-user-modal-actions">
              <button className="btn-cancelar-outline" onClick={() => setShowAddUserModal(false)}>
                Cancelar
              </button>
              <button className="btn-confirmar" onClick={handleCrearUsuario}>
                Crear usuario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};