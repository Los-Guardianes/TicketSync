import { apiFetch } from '../../../../globalServices/API';

export const getUsers = () => apiFetch(`/api/usuario`);
export const getUser = (idUsuario, rol) => {
  switch (rol) {
    case "ADMINISTRADOR":
       return apiFetch(`/api/admin/${idUsuario}`);
       break;
    case "ORGANIZADOR":
       return apiFetch(`/api/organizador/${idUsuario}`);
       break;
    case "CLIENTE":
       return apiFetch(`/api/cliente/${idUsuario}`);
       break;
    default:
       throw new Error(`Rol desconocido: ${rol}`);
  }
};
export const updateUser = async (user, rol) => {
  const idUsuario = user.idUsuario;

  let url = "";
  switch (rol) {
    case "ADMINISTRADOR":
      url = `/api/admin/${idUsuario}`;
      break;
    case "ORGANIZADOR":
      url = `/api/organizador/${idUsuario}`;
      break;
    case "CLIENTE":
      url = `/api/cliente/${idUsuario}`;
      break;
    default:
      throw new Error(`Rol desconocido: ${rol}`);
  }

  return fetch(url, {
    method: "PUT",
    body: JSON.stringify(user),
  });
};
