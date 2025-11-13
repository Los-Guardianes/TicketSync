// src/pages/Register/RegisterOrganizer.jsx
import { NavLink } from "react-router-dom";
import { useRegister } from "./service/useRegister";
import { DropdownList } from "../../common/DropDownList/DropDownList";

export const RegisterOrganizer = () => {
  const {
    ciudades,
    selectedCiudad,
    formUsuario,
    seleccionarCiudad,
    handleUserForm,
    handleSubmit,
    isLoading,
  } = useRegister("ORGANIZADOR");

  return (
    <div className="row vh-100 w-100 mx-0" style={{ overflow: "hidden" }}>
      <div className="col-6 px-5 py-4 bg-light shadow rounded">
        <div className="w-100 d-flex justify-content-center">
          <img
            src="https://tuticket-bucket.s3.us-east-1.amazonaws.com/TUTICKET_PNG_SIN_ESPACIOS.png"
            alt="tuticketLogo"
            style={{ width: "10rem" }}
          />
        </div>
        <h2 className="text-center mt-4 mb-4" style={{ color: "#2EA062" }}>
          Registro de organizador
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="d-grid gap-2 form-group container mx-auto">
            <div className="row">
              <div className="col">
                <label htmlFor="inpNombre" className="text-start">Nombre</label>
                <input
                  className="form-control border-0"
                  type="text"
                  name="nombre"
                  value={formUsuario.nombre}
                  placeholder="Ingrese su nombre"
                  style={{ background: "#EBF5EB" }}
                  onChange={handleUserForm}
                />
              </div>
              <div className="col">
                <label htmlFor="inpApellido" className="text-start">Apellido</label>
                <input
                  className="form-control border-0"
                  type="text"
                  name="apellido"
                  value={formUsuario.apellido}
                  placeholder="Ingrese su apellido"
                  style={{ background: "#EBF5EB" }}
                  onChange={handleUserForm}
                />
              </div>
            </div>

            <div className="row">
              <div className="col">
                <label htmlFor="inpEmail" className="text-start">Correo</label>
                <input
                  className="form-control border-0"
                  type="email"
                  name="email"
                  value={formUsuario.email}
                  placeholder="Ingrese su correo electrónico"
                  style={{ background: "#EBF5EB" }}
                  onChange={handleUserForm}
                />
              </div>
            </div>

            <div className="row">
              <div className="col">
                <label className="text-start">Contraseña</label>
                <input
                  className="form-control border-0"
                  type="password"
                  name="hashCtr"
                  placeholder="Ingrese una contraseña"
                  value={formUsuario.hashCtr}
                  style={{ background: "#EBF5EB" }}
                  onChange={handleUserForm}
                />
              </div>
            </div>

            <div className="row">
              <div className="col">
                <label className="text-start">Confirmar contraseña</label>
                <input
                  className="form-control border-0"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirme su contraseña"
                  value={formUsuario.confirmPassword}
                  style={{ background: "#EBF5EB" }}
                  onChange={handleUserForm}
                />
              </div>
            </div>

            <div className="row">
              <div className="col">
                <label className="text-start">RUC</label>
                <input
                  className="form-control border-0"
                  type="text"
                  name="ruc"
                  placeholder="Ingrese su RUC"
                  value={formUsuario.ruc}
                  style={{ background: "#EBF5EB" }}
                  onChange={handleUserForm}
                />
              </div>
              <div className="col">
                <label className="text-start">Celular</label>
                <input
                  className="form-control border-0"
                  type="text"
                  name="telefono"
                  placeholder="Ingrese su número celular"
                  value={formUsuario.telefono}
                  style={{ background: "#EBF5EB" }}
                  onChange={handleUserForm}
                />
              </div>
            </div>

            <div className="row">
              <div className="col">
                <label className="text-start">Razón social</label>
                <input
                  className="form-control border-0"
                  type="text"
                  name="razonSocial"
                  placeholder="Ingrese su razón social"
                  value={formUsuario.razonSocial}
                  style={{ background: "#EBF5EB" }}
                  onChange={handleUserForm}
                />
              </div>
            </div>

            <div className="row d-flex align-items-center mt-2">
              <p className="col-2 text-start">Ciudad</p>
              <div className="col">
                <DropdownList
                  firstElement="Selecciona una ciudad"
                  list={ciudades}
                  id="idCiudad"
                  value={selectedCiudad ? selectedCiudad.idCiudad : ""}
                  onChangeOption={seleccionarCiudad}
                  getNombre={(c) => c.nombre}
                />
              </div>
            </div>
          </div>

          <div className="container mx-auto mt-3 mb-5">
            <div className="form-check" style={{ color: "#919191" }}>
              <input className="form-check-input" type="checkbox" />
              <p className="m-0">
                He leído y aceptado los Términos y Condiciones y la Política de Privacidad *.
              </p>
            </div>
          </div>

          <div className="container w-100 d-flex justify-content-between">
            <NavLink className="btn btn-dark" to={"/"}>Regresar</NavLink>
            <button className="btn btn-success" type="submit" disabled={isLoading}>
              {isLoading ? "Registrando..." : "Registrar"}
            </button>
          </div>
        </form>
      </div>

      <div className="p-0 m-0 col-6">
        <img
          className="h-100 w-100"
          src="https://tuticket-bucket.s3.us-east-1.amazonaws.com/wallhaven-4gjdrd.jpg"
          alt="tuticketWallpaper"
          style={{ maxHeight: "100vh", objectFit: "cover" }}
        />
      </div>
    </div>
  );
};
