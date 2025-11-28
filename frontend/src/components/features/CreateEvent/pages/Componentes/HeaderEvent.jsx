import "../CreateEvent.css"
import { Wizard } from "./Wizard";

export const HeaderEvent = ({ currentStep }) => {
  const steps = [
    "Detalles del evento",
    "Ubicación",
    "Entradas",
    "Confirmación"
  ];

  return (
    <div className="header-event">
      <h1 className="header-event-title">Crear Nuevo Evento</h1>

      <div className="wizards-container">
        <div className="wizards-line">
          <div
            className="wizards-progress"
            style={{ width: `${(currentStep - 1) * 33}%` }} // barra de progreso opcional
          />
        </div>

        {steps.map((label, index) => (
          <Wizard
            key={index}
            step={index + 1}
            label={label}
            active={currentStep === index + 1}
          />
        ))}
      </div>
    </div>
  );
}
