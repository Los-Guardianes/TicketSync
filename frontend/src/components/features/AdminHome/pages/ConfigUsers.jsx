import React, { useState, useEffect } from "react";
import { getUsers, getUser, updateUser, postAdmin } from '../service/UserConfigService';
import { getCiudades } from '../../../../globalServices/UbicacionService';
import { useNavigate } from 'react-router-dom';
import { UserTable } from '../components/UserTable';
import "./ConfigUsers.css";

export const ConfigUsers = () => {
  const [usersData, setUsersData] = useState([])
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [selectedCiudad, setSelectedCiudad] = useState("Seleccionar ciudad");
  const [ciudad, setCiudad] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [search, setSearch] = useState("");
  const [rolFilter, setRolFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sortOrder, setSortOrder] = useState(""); // "", "asc", "desc"
  const navigate = useNavigate();
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
  const [usuario, setUsuario] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
  });

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsersData(data);
    console.log(data);
  };
  useEffect(() => {
    fetchUsers();
  }, [reloadTrigger]);

  useEffect(() => {
      const getCiudad = async () => {
          const data = await getCiudades();
          setCiudad(data);
      };
      getCiudad();
  }, []);

  useEffect(() => {
    const fetchUsuario = async () => {
      if (!usuarioSeleccionado) return;
      const data = await getUser(usuarioSeleccionado.idUsuario, usuarioSeleccionado.rol);
      setUsuario(data);
    };

    if (showEditUserModal) {
      fetchUsuario();
    }
  }, [showEditUserModal]);
  
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

    const validar2 = () => {
        const emailOk = /^\S+@\S+\.\S+$/.test((usuarioSeleccionado.email || '').trim());
        const celOk = /^\d{9}$/.test((usuarioSeleccionado.telefono || '').trim());

        if (!emailOk) return 'Ingresa un correo válido.';
        if (!celOk) return 'El celular debe tener 9 dígitos.';
        //buscar que el correo no esté en uso por otra persona...:
        //to do
        return null;
    };

  const filteredUsers = usersData.filter((u) => {
    return (
      (rolFilter ? u.rol === rolFilter : true) &&
      (estadoFilter !== "" ? u.activo === estadoFilter : true) &&
      (search
        ? u.nombre.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
        : true)
    );
  })
  .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.nombre.localeCompare(b.nombre);
      } else if (sortOrder === "desc") {
        return b.nombre.localeCompare(a.nombre);
      }
      return 0;
    });

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

  const toggleActivo = async (id, rol, estadoActual) => {
    const nuevoEstado = !estadoActual;

    try {
      const usuario = await getUser(id, rol);
      const payload = construirPayloadUsuario(usuario, { activo: nuevoEstado });
      console.log("Payload: " + payload);
      await updateUser(payload, id);
      console.log(usuario.idUsuario + " se actualizó");
      alert("Usuario actualizado correctamente.");
      setReloadTrigger((prev) => prev + 1);
    } catch (error) {
      alert("Error al cambiar estado");
      console.log(error);
    }
  };

  const handleActualizarUsuario = async () => {
    try {
      const error = validar2();
      if (error) {
          alert(error);
          return;
      }
      const usuario = await getUser(usuarioSeleccionado.idUsuario, usuarioSeleccionado.rol);

      const payload = construirPayloadUsuario(usuario, {
        email: usuarioSeleccionado.email,
        telefono: usuarioSeleccionado.telefono,
      });

      await updateUser(payload, usuarioSeleccionado.idUsuario);
      alert("Usuario actualizado correctamente.");
      setShowEditUserModal(false);
      setReloadTrigger((prev) => prev + 1);
    } catch (error) {
      alert("Error al actualizar usuario");
      console.log(error);
    }
  };

  const handleEdit = (user) => {
    setUsuarioSeleccionado(user); 
    setShowEditUserModal(true);
  }

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
    <div className="config-users-wrapper">
      <div className="config-users-container">
        <div className="d-flex justify-content-start mt-3">
          <button className="btn btn-outline-primary w-auto" onClick={() => navigate("/home-admin")}>
            ← Volver
          </button>
        </div>
        {/* Filtros */}
        <div className="filters">
          <div className="filters-left">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="">Ordenar</option>
              <option value="asc">Nombre A-Z</option>
              <option value="desc">Nombre Z-A</option>
            </select>
            <select
              value={rolFilter}
              onChange={(e) => setRolFilter(e.target.value)}
            >
              <option value="">Rol</option>
              <option value="CLIENTE">CLIENTE</option>
              <option value="ADMINISTRADOR">ADMINISTRADOR</option>
              <option value="ORGANIZADOR">ORGANIZADOR</option>
            </select>

            <select
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value === "" ? "" : e.target.value === "true")}
            >
              <option value="">Estado</option>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
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
        <UserTable
          users={paginatedUsers}
          onToggleActivo={toggleActivo}
          onEditUser={handleEdit}
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
    {showAddUserModal && (
        <div className="add-user-modal-overlay">
          <div className="add-user-modal">
            <h4>Agregar nuevo usuario (administrador)</h4>

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
                placeholder="Email"
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
                  <button className="btn btn-light dropdown-toggle " style={{ background: "#ffffffff" }}
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
      {showEditUserModal && usuarioSeleccionado && (
        <div className="add-user-modal-overlay">
          <div className="add-user-modal">
            <h4>Editar usuario</h4>

            <div className="add-user-form">
              <div className="mb-3">
                <label>
                  Nombre
                </label>
                <input
                  type="text"
                  placeholder="Nombre"
                  style={{ color: "#6c757d" }}
                  value={usuarioSeleccionado.nombre || ""}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label>
                  Apellido
                </label>
                <input
                  type="text"
                  placeholder="Apellido"
                  style={{ color: "#6c757d" }}
                  value={usuarioSeleccionado.apellido || ""}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label>
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={usuarioSeleccionado.email || ""}
                  onChange={(e) =>
                    setUsuarioSeleccionado({ ...usuario, email: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label>
                  Teléfono
                </label>
                <input
                  type="text"
                  placeholder="Teléfono"
                  value={usuarioSeleccionado.telefono || ""}
                  onChange={(e) =>
                    setUsuarioSeleccionado({ ...usuario, telefono: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="add-user-modal-actions">
              <button
                className="btn-cancelar-outline"
                onClick={() => setShowEditUserModal(false)}
              >
                Cancelar
              </button>
              <button className="btn-confirmar" onClick={handleActualizarUsuario}>
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}
  </>);
};