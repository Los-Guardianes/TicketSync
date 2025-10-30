import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ConfigEventoActions = ({ idEvento }) => {
  const navigate = useNavigate();

  // Cada acción es un botón. Más adelante cada path va a ser otra pantalla.
  const acciones = [
    {
      label: 'EDITAR DETALLES',
      path: `/organizer/evento/${idEvento}/editar-detalles`,
    },
    {
      label: 'EDITAR UBICACIÓN',
      path: `/organizer/evento/${idEvento}/editar-ubicacion`,
    },
    {
      label: 'EDITAR ENTRADAS',
      path: `/organizer/evento/${idEvento}/editar-entradas`,
    },
    {
      label: 'GENERADOR DE DESCUENTOS',
      path: `/organizer/evento/${idEvento}/generar-descuento`,
    },
    {
      label: 'GESTIÓN DE DESCUENTOS',
      path: `/organizer/evento/${idEvento}/descuentos`,
    },
    {
      label: 'CONFIGURAR POLÍTICAS DE DEVOLUCIÓN',
      path: `/organizer/evento/${idEvento}/politicas-devolucion`,
    },
    {
      label: 'LISTADO DE INSCRITOS',
      path: `/organizer/evento/${idEvento}/inscritos`,
    },
    {
      label: 'CANCELAR EVENTO',
      path: `/organizer/evento/${idEvento}/cancelar`,
    },
  ];

  const handleClick = (accion) => {
    if (accion.path) {
      navigate(accion.path);
    } else {
      console.log(
        `Acción "${accion.label}" para evento ${idEvento} (sin ruta aún)`
      );
    }
  };

  return (
    <div className="config-actions-wrapper">
      {acciones.map((accion, i) => (
        <button
          key={i}
          className="config-action-btn"
          onClick={() => handleClick(accion)}
        >
          <span>{accion.label}</span>
          <span>{'>'}</span>
        </button>
      ))}
    </div>
  );
};
