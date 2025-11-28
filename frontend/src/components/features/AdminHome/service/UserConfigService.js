import { apiFetch } from '../../../../globalServices/API';

export const getUsers = () => apiFetch(`/api/usuario`);
export const postAdmin = (admin) =>
  apiFetch('/api/admin', { method: 'POST', body: JSON.stringify(admin) });

//Obtiene el tipo de usuario específico
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
export const updateUser = async (user, id) => {
  const rol = user.rol;

  let url = "";
  switch (rol) {
    case "ADMINISTRADOR":
      url = `/api/admin/${id}`;
      break;
    case "ORGANIZADOR":
      url = `/api/organizador/${id}`;
      break;
    case "CLIENTE":
      url = `/api/cliente/${id}`;
      break;
    default:
      throw new Error(`Rol desconocido: ${rol}`);
  }
  console.log(url)
  return apiFetch(url, {
    method: "PUT",
    body: JSON.stringify(user),
  });
};
