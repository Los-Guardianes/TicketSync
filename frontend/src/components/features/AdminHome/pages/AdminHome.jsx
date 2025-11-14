import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { NavBarAdmin } from '../../../common/NavBarAdmin';
import { HiArrowCircleRight } from "react-icons/hi";
import { getReporte } from '../service/reporteService';

// --- Componente AdminHome ---
export const AdminHome = () => {
  const response = useNavigate();
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  // Estilo para las tarjetas, más parecido al de la imagen
  const cardStyle = {
    background: "#B6E6C9", // Un verde más pálido
    border: '1px solid #B6E6C9'
  };

  // Estilo para el botón de las tarjetas
  const cardButtonStyle = {
    background: '#34A853', // Un verde más oscuro para el botón
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0, // Asegurarse que el ícono quede centrado
  };

  const handleClick = async (title) => {
    if (title === "Reportes") {
      console.log("Generando reporte...");
      setIsLoadingReport(true);

      try {
        // 1. Llamar al servicio (esto ya funciona)
        const { blob, filename } = await getReporte();

        // 2. Crear un URL local
        const url = window.URL.createObjectURL(blob);

        // 3. Crear un link <a> invisible
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);

        // 4. Simular click para descargar
        document.body.appendChild(link);
        link.click();

        // 5. Limpiar
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);

      } catch (error) {
        console.error("Error al descargar el archivo:", error);
        alert("Error al descargar el reporte. " + error.message);
      } finally {
        setIsLoadingReport(false);
      }
    }
    if (title == "Configurar Comisión")
    {
      response("/configusers"); 
    }
  };

  // Función para crear una tarjeta de navegación
  const NavCard = ({ icon, title, description, path }) => (
    <div className='p-3 rounded h-100 d-flex flex-column' style={cardStyle}>
      <div className='d-flex justify-content-between align-items-start mb-2'>
        <div>
          <h6 className='fw-bold mb-1'>
            <i className={`bi ${icon} me-2`}></i>{title}
          </h6>
          <p className='mb-0' style={{ fontSize: '0.9rem' }}>{description}</p>
        </div>
        <button
          className='btn btn-sm' // 'btn-sm' para asegurar tamaño
          style={cardButtonStyle}
          onClick={() => handleClick(title)}
          title={`Ir a ${title}`}
        >
          <HiArrowCircleRight style={{ fontSize: "2rem" }} />
        </button>
      </div>
    </div>
  );

  return (
    <div className='d-flex flex-column vh-100 bg-light'>
      <NavBarAdmin />

      {/* 2. ÁREA DE CONTENIDO: Crecerá y tendrá scroll interno */}
      <main className='flex-grow-1 overflow-auto py-4'>

        {/* Contenedor principal blanco con sombra (quitamos my-5) */}
        <div className='container shadow-sm p-4 p-md-5 bg-white rounded'>

          <h1 style={{ color: "#2EA062" }}>Ajustes de la plataforma</h1>
          <p className='text-muted'>Gestiona la configuracion general y los parametros del sistema</p>

          {/* Fila principal que divide la página en 2 columnas */}
          <div className='row g-4 mt-3'>

            <h5 style={{ textDecoration: "underline" }} className='mb-0'>
              Navegación Principal
            </h5>
            {/* ---  COLUMNA IZQUIERDA (70%) --- */}
            <div className='col-lg-7 d-flex flex-column gap-3'>


              {/* Grilla de Navegación (con botones) */}
              <div className='row g-3'>
                <div className='col-md-6'>
                  <NavCard
                    icon="bi-graph-up"
                    title="Reportes"
                    description="Genera y visualiza reportes detallados."
                    path="/admin/reportes"
                  />
                </div>
                <div className='col-md-6'>
                  <NavCard
                    icon="bi-search"
                    title="Trazabilidad"
                    description="Rastrea y audita todas las actividades."
                    path="/admin/trazabilidad"
                  />
                </div>
                <div className='col-md-6'>
                  <NavCard
                    icon="bi-pencil-square"
                    title="Modificar Categorías"
                    description="Gestiona categorías de eventos y tickets."
                    path="/admin/categorias"
                  />
                </div>
                <div className='col-md-6'>
                  <NavCard
                    icon="bi-percent"
                    title="Configurar Comisión"
                    description="Establece el porcentaje de comisión."
                    path="/admin/comision"
                  />
                </div>
              </div>

              <div className='row g-3'>
                <div className='col-12'>
                  <NavCard
                    icon="bi-person-rolodex"
                    title="Gestionar Roles"
                    description="Administra roles y permisos de usuarios."
                    path="/admin/roles"
                  />
                </div>
              </div>

              {/* Generador de Reportes */}
              <div className='p-3 rounded mt-3' style={cardStyle}>
                <h6 className='fw-bold'><i className="bi bi-file-earmark-spreadsheet me-2"></i>Generador de Reportes</h6>
                <p className='mb-3' style={{ fontSize: '0.9rem' }}>Configura y descarga reportes personalizados.</p>

                <form>
                  <div className='row'>
                    {/* ... (tus inputs de formulario están bien) ... */}
                    <div className='col-md-6 mb-2'>
                      <label className='form-label fw-semibold' style={{ fontSize: '0.9rem' }}>Tipo de Reporte</label>
                      <select className='form-select form-select-sm'>
                        <option>Seleccionar tipo de reporte</option>
                      </select>
                    </div>
                    <div className='col-md-6 mb-2'>
                      <label className='form-label fw-semibold' style={{ fontSize: '0.9rem' }}>Rango de Fechas</label>
                      <select className='form-select form-select-sm'>
                        <option>Seleccionar periodo</option>
                      </select>
                    </div>
                    <div className='col-md-6 mb-2'>
                      <label className='form-label fw-semibold' style={{ fontSize: '0.9rem' }}>Categoría</label>
                      <select className='form-select form-select-sm'>
                        <option>Todas las categorías</option>
                      </select>
                    </div>
                    <div className='col-md-6 mb-2'>
                      <label className='form-label fw-semibold' style={{ fontSize: '0.9rem' }}>Organizador</label>
                      <select className='form-select form-select-sm'>
                        <option>Todos los Organizadores</option>
                      </select>
                    </div>
                  </div>
                  <div className='text-end mt-3'>
                    <button type='button' className='btn btn-primary btn-sm'>Descargar en Excel</button>
                  </div>
                </form>
              </div>
            </div>
            {/* --- FIN COLUMNA IZQUIERDA --- */}

            {/* --- COLUMNA DERECHA (30%) --- */}
            <div className='col-lg-5 d-flex flex-column gap-4'>

              {/* Parámetros de la plataforma */}
              <div className='p-3 rounded' style={cardStyle}>
                <h6 className='fw-bold'><i className="bi bi-gear-fill me-2"></i>Parámetros de la plataforma</h6>
                <p className='mb-3' style={{ fontSize: '0.9rem' }}>Configura los ajustes principales del sistema.</p>
                <form>
                  {/* ... (tus inputs de formulario están bien) ... */}
                  <div className='mb-2'>
                    <label className='form-label fw-semibold' style={{ fontSize: '0.9rem' }}>Comisión por Ticket (%)</label>
                    <input type='text' className='form-control form-control-sm' />
                  </div>
                  <div className='mb-2'>
                    <label className='form-label fw-semibold' style={{ fontSize: '0.9rem' }}>Máximo de Tickets por Compra</label>
                    <input type='text' className='form-control form-control-sm' />
                  </div>
                  <div className='mb-2'>
                    <label className='form-label fw-semibold' style={{ fontSize: '0.9rem' }}>Periodo de Reembolso (días)</label>
                    <input type='text' className='form-control form-control-sm' />
                  </div>
                  <div className='mb-2'>
                    <label className='form-label fw-semibold' style={{ fontSize: '0.9rem' }}>Periodo de Reembolso (días)</label>
                    <input type='text' className='form-control form-control-sm' />
                  </div>
                  <button type='button' className='btn btn-primary w-100 mt-3'>Guardar configuración</button>
                </form>
              </div>

              {/* Estadísticas Rápidas */}
              <div className='p-3 rounded' style={cardStyle}>
                <h6 className='fw-bold'><i className="bi bi-bar-chart-line me-2"></i>Estadísticas Rápidas</h6>
                {/* ... (tu código de estadísticas es perfecto) ... */}
                <div className='d-flex justify-content-between mt-3'>
                  <span style={{ fontSize: '0.9rem' }}>Eventos Activos</span>
                  <span className='fw-bold'>247</span>
                </div>
                <hr className='my-1' />
                <div className='d-flex justify-content-between'>
                  <span style={{ fontSize: '0.9rem' }}>Organizadores</span>
                  <span className='fw-bold'>89</span>
                </div>
                <hr className='my-1' />
                <div className='d-flex justify-content-between'>
                  <span style={{ fontSize: '0.9rem' }}>Tickets Vendidos (Mes)</span>
                  <span className='fw-bold'>12,456</span>
                </div>
                <hr className='my-1' />
                <div className='d-flex justify-content-between'>
                  <span style={{ fontSize: '0.9rem' }}>Ingresos (Mes)</span>
                  <span className='fw-bold text-primary'>$45,230</span>
                </div>
              </div>
            </div>
            {/* --- FIN COLUMNA DERECHA --- */}
          </div>

          {/* Botones de Navegación Inferiores */}
          <div className='d-flex justify-content-between mt-5'>
            <button className='btn btn-link text-secondary px-4'>Regresar</button>
            <button className='btn btn-primary px-4'>Siguiente</button>
          </div>

        </div>
      </main>
    </div>
  );
}
