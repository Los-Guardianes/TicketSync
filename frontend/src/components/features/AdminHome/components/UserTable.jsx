export function UserTable({ users, onToggleActivo, onEditUser }) {
  return (
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
        {users.map((user) => (
          <tr key={user.idUsuario}>
            <td>{user.nombre + " " + user.apellido}</td>
            <td>{user.rol}</td>
            <td>
              <input
                type="checkbox"
                checked={user.activo}
                onChange={() => onToggleActivo(user.idUsuario, user.rol, user.activo)}
              />
            </td>
            <td>{user.email}</td>
            <td>{user.telefono}</td>
            <td>
              <button
                className="details-button"
                onClick={() => onEditUser(user)}
              >
                Ver detalles
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}