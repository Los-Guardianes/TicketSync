import React from "react";

export function OrgTable({ users, onApprove }) {
  return (
    <table className="user-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Email</th>
          <th>Teléfono</th>
          <th>RUC</th>
          <th>Razón Social</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.idUsuario}>
            <td>{user.nombre}</td>
            <td>{user.apellido}</td>
            <td>{user.email}</td>
            <td>{user.telefono}</td>
            <td>{user.ruc}</td>
            <td>{user.razonSocial}</td>
            <td>
              <button
                className="details-button"
                onClick={() => onApprove(user)}
              >
                Aprobar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}