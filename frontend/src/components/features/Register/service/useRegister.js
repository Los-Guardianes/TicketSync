import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCiudades } from "../../../../globalServices/UbicacionService";
import { postClient } from "../../../../globalServices/ClienteService";
import { postOrganizador } from "./OrganizadorService";
import { useNotification } from "../../../../context/NotificationContext";

export const useRegister = (rol, onSuccessRedirect = "/home") => {
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [ciudades, setCiudades] = useState([]);
  const [selectedCiudad, setSelectedCiudad] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form base
  const baseForm = {
    nombre: "",
    apellido: "",
    email: "",
    hashCtr: "",
    confirmPassword: "",
    telefono: "",
    ciudad: { idCiudad: null },
    rol,
  };

  // Campos según rol
  const roleSpecificData = {
    CLIENTE: { dni: "", fechaNacimiento: "" },
    ORGANIZADOR: { razonSocial: "", ruc: "", verificado: false},
  };

  const [formUsuario, setFormUsuario] = useState({
    ...baseForm,
    ...(roleSpecificData[rol] || {}),
  });

  useEffect(() => {
    (async () => {
      const data = await getCiudades();
      setCiudades(data);
    })();
  }, []);

  const seleccionarCiudad = (idSeleccionado) => {
    const ciudad = ciudades.find((c) => c.idCiudad === parseInt(idSeleccionado));
    setSelectedCiudad(ciudad);
    setFormUsuario({
      ...formUsuario,
      ciudad: { idCiudad: ciudad ? ciudad.idCiudad : null },
    });
  };

  const handleUserForm = ({ target: { name, value } }) => {
    setFormUsuario({ ...formUsuario, [name]: value });
  };

  /** ---- VALIDACIÓN ---- */
  const validar = () => {
    const emailOk = /^\S+@\S+\.\S+$/.test((formUsuario.email || "").trim());
    const celOk = /^\d{9}$/.test((formUsuario.telefono || "").trim());
    const passOk = (formUsuario.hashCtr || "").length >= 6;
    const passMatch = formUsuario.hashCtr === formUsuario.confirmPassword;
    const ciudadOk = !!formUsuario.ciudad.idCiudad;

    if (!(formUsuario.nombre || "").trim()) return "El nombre es obligatorio.";
    if (!(formUsuario.apellido || "").trim()) return "El apellido es obligatorio.";
    if (!emailOk) return "Ingresa un correo válido.";
    if (!passOk) return "La contraseña debe tener al menos 6 caracteres.";
    if (!passMatch) return "Las contraseñas no coinciden.";
    if (!celOk) return "El celular debe tener 9 dígitos.";
    if (!ciudadOk) return "Debes seleccionar una ciudad.";

    // Validaciones por rol
    if (rol === "CLIENTE") {
      const dniOk = /^\d{8}$/.test((formUsuario.dni || "").trim());
      const fechaOk = isFechaNacimientoValida(formUsuario.fechaNacimiento);
      if (!dniOk) return "El DNI debe tener 8 dígitos.";
      if (!fechaOk) return "Selecciona una fecha de nacimiento válida.";
    } else if (rol === "ORGANIZADOR") {
      const rucOk = /^\d{11}$/.test((formUsuario.ruc || "").trim());
      if (!(formUsuario.razonSocial || "").trim())
        return "La razón social es obligatoria.";
      if (!rucOk) return "El RUC debe tener 11 dígitos.";
    }

    return null;
  };

  const isFechaNacimientoValida = (fecha) => {
    if (!fecha) return false;
    const hoy = new Date();
    const fechaNac = new Date(fecha);
    hoy.setHours(0, 0, 0, 0);
    fechaNac.setHours(0, 0, 0, 0);
    return fechaNac <= hoy;
  };

  /** ---- SUBMIT ---- */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const msjValidacion = validar();
    if (msjValidacion) return showNotification(msjValidacion, "error");

    const payload = buildPayload(formUsuario, rol);
    setIsLoading(true);

    try {
      if (rol === "CLIENTE") await postClient(payload);
      else if (rol === "ORGANIZADOR") await postOrganizador(payload);

      showNotification(
        `${rol === "CLIENTE" ? "Cliente" : "Organizador"} registrado correctamente.`,
        "success"
      );
      navigate(onSuccessRedirect);

      // Reset solo si fue exitoso
      setFormUsuario({ ...baseForm, ...(roleSpecificData[rol] || {}) });
      setSelectedCiudad(null);
    } catch (error) {
      console.error("Error al registrar:", error);
      const mensaje =
        error.response?.data?.message ||
        "Ocurrió un error al registrar el usuario.";
      showNotification(mensaje, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const buildPayload = (form, rol) => {
    let payload = {
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      email: form.email.trim().toLowerCase(),
      hashCtr: form.hashCtr,
      telefono: form.telefono.trim(),
      rol,
      idCiudad: form.ciudad.idCiudad,
    };

    if (rol === "CLIENTE") {
      payload = { 
        ...payload, 
        dni: form.dni.trim(), 
        fechaNacimiento: form.fechaNacimiento };
    } else if (rol === "ORGANIZADOR") {
      payload = { 
        ...payload, 
        razonSocial: form.razonSocial.trim(), 
        ruc: form.ruc.trim() };
    }
    console.log("nuevoUsuario: ",payload)
    return payload;
  };

  return {
    ciudades,
    selectedCiudad,
    formUsuario,
    seleccionarCiudad,
    handleUserForm,
    handleSubmit,
    isLoading,
  };
};
