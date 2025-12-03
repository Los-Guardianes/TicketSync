import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ConfigEventoActions.css';

export const ConfigEventoActions = ({ idEvento, onCancelar }) => {
  const navigate = useNavigate();

  const acciones = [
    {
      label: 'EDITAR DETALLES',
      onClick: () => {
        console.log('EDITAR DETALLES', idEvento);
        // futuro: navigate(`/organizer/evento/${idEvento}/editar-detalles`);
        navigate(`/organizer/evento/${idEvento}/editar-detalles`);
      },
    },
    {
      label: 'EDITAR UBICACIÓN',
      onClick: () => {
        console.log('EDITAR UBICACIÓN', idEvento);
        // futuro: navigate(`/organizer/evento/${idEvento}/editar-ubicacion`);
      },
    },

    {
      label: 'GENERADOR DE DESCUENTOS',
      onClick: () => {
        navigate(`/organizer/evento/${idEvento}/descuentos/nuevo`);
      },
    },
    {
      label: 'GESTIÓN DE DESCUENTOS',
      onClick: () => {
        navigate(`/organizer/evento/${idEvento}/descuentos`);
      },
    },
    {
      label: 'CONFIGURAR POLÍTICAS DE DEVOLUCIÓN',
      onClick: () => {
        console.log('POLÍTICAS DEVOLUCIÓN', idEvento);
        // futuro: navigate(`/organizer/evento/${idEvento}/politicas-devolucion`);
      },
    },
    {
      label: 'LISTADO DE INSCRITOS',
      onClick: () => {
        console.log('LISTADO DE INSCRITOS', idEvento);
        navigate(`/organizer/evento/${idEvento}/inscritos`);
        // futuro: navigate(`/organizer/evento/${idEvento}/inscritos`);
      },
    },
    {
      label: 'CANCELAR EVENTO',
      onClick: () => {
        if (onCancelar) {
          onCancelar();
        }
      },
    },
  ];

  return (
    <div className="config-actions-wrapper">
      {acciones.map((accion, i) => (
        <button
          key={i}
          className="config-action-btn"
          onClick={accion.onClick}
        >
          <span>{accion.label}</span>
          <span className="arrow-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </span>
        </button>
      ))}
    </div>
  );
};
