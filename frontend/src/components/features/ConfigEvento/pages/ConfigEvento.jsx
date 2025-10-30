import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { BarraLateral } from '../../MisTickets/components/BarraLateral';
import { ConfigEventoActions } from '../components/ConfigEventoActions';

import { getEventosById } from '../../../../globalServices/EventoService';

import './ConfigEvento.css';

export const ConfigEvento = () => {
  const { idEvento } = useParams();

  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cargaError, setCargaError] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getEventosById(idEvento); // <== acá también
        setEvento(data);
      } catch (err) {
        console.error('Error cargando el evento', err);
        setCargaError(true);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [idEvento]);

  // estado: cargando
  if (loading) {
    return (
      <div className="d-flex">
        <BarraLateral />
        <main className="flex-grow-1 p-4">
          <div className="config-card">
            <h3 className="config-card-title">Configuración de evento</h3>
            <p className="text-muted mb-0">Cargando...</p>
          </div>
        </main>
      </div>
    );
  }

  // estado: error o evento no encontrado
  if (cargaError || !evento) {
    return (
      <div className="d-flex">
        <BarraLateral />
        <main className="flex-grow-1 p-4">
          <div className="config-card">
            <h3 className="config-card-title">Configuración de evento</h3>
            <p className="text-danger mb-0">
              No se pudo cargar la información del evento.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // datos cargados
  const tituloEvento = evento.nombre ?? 'Sin título';
  const imagenEvento = evento.urlImagen;
  const direccion = evento.direccion ?? 'Dirección no registrada';

  return (
    <div className="d-flex">
      <BarraLateral />

      <main className="flex-grow-1 p-4">
        <div className="config-card">
          <h3 className="config-card-title">Configuración de evento</h3>

          <div className="row g-4 align-items-start">
            {/* Columna izquierda: info del evento */}
            <div className="col-12 col-lg-6 config-event-left">
              <h5 className="config-event-name">{tituloEvento}</h5>

              <div
                className="config-event-cover"
                style={
                  imagenEvento
                    ? { backgroundImage: `url(${imagenEvento})` }
                    : undefined
                }
              />

              <p className="config-event-location">{direccion}</p>
            </div>

            {/* Columna derecha: acciones */}
            <div className="col-12 col-lg-6">
              <ConfigEventoActions idEvento={idEvento} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
