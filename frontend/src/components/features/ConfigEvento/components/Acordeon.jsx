import './Acordeon.css';
// Acordeón genérico
const AccordionSection = ({
  id,
  title,
  badgeText,
  iconEmoji,
  isActive,
  onToggle,
  children,
}) => {
  const handleClick = () => {
    if (typeof onToggle === 'function') {
      onToggle(id);
    } else {
      console.warn('onToggle no es una función para el acordeón:', id);
    }
  };
  
  return (
    <div className="accordion">
      <div
        className={`accordion-header ${isActive ? 'active' : ''}`}
        onClick={handleClick}
      >
        <span className="accordion-title">
          {iconEmoji} {title}
          {badgeText && <span className="badge badge-success">{badgeText}</span>}
        </span>
        <span className="accordion-icon">▼</span>
      </div>
      <div className={`accordion-content ${isActive ? 'active' : ''}`}>
        <div className="accordion-body">{children}</div>
      </div>
    </div>
  );
};

// Tarjeta genérica de ítem (zona / función / tipo de entrada)
const ItemCard = ({ name, details, onEdit, onDelete, extraActions }) => {
  // return (
  //   <div className="item-card">
  //     <div className="item-header">
  //       <div className="item-name">{name}</div>
  //     </div>
  //     <div className="item-details">{details}</div>
  //     <div className="item-actions">
  //       <button className="item-btn" onClick={onEdit}>
  //         ✏️ Editar
  //       </button>
  //       {extraActions}
  //       <button className="item-btn" onClick={onDelete}>
  //         🗑️ Eliminar
  //       </button>
  //     </div>
  //   </div>
  // );
  return (
    <div className="item-card">
      <div className='compact-content'>
        <div className='compact-name-section'>
          <span className="item-name">{name}</span>
          {details && (
            <span className="item-details">{details}</span>
          )}
        </div>
        
        <div className="item-actions">
          <button 
            className="item-btn"
            onClick={onEdit}
            title="Editar"
          >
            ✏️ Editar
          </button>
          <button 
            className="item-btn"
            onClick={onDelete}
            title="Eliminar"
          >
            🗑️ Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};


export const ZonesAccordion = ({
  isActive,
  onToggle,
  editItem,
  deleteItem,
  addItem,
  zonas,
}) => {
  return (
    <AccordionSection
      id="zonas"
      title="Zonas"
      badgeText={`${zonas.length} zonas`}
      iconEmoji=""
      isActive={isActive}
      onToggle={onToggle}
    >
      <div className="item-list">
        {zonas.map((zona) => (
          <ItemCard
            key={zona.idZona}
            name={zona.nombre}
            details={
              <>
                • Capacidad: {zona.aforo} asientos<br />
              </>
            }
            onEdit={() => editItem("zona", zona.id)}
            onDelete={() => deleteItem("zona", zona.id)}
          />
        ))}
      </div>

      <button className="add-button" onClick={() => addItem('zona')}>
        + Agregar Zona
      </button>
    </AccordionSection>
  );
}

export const FuncionesAccordion = ({
  isActive,
  onToggle,
  editItem,
  deleteItem,
  addItem,
  viewTickets,
  funciones,
}) => {
  console.log(funciones)
  return (
    <AccordionSection
      id="funciones"
      title="Funciones"
      badgeText={`${funciones.length} funciones`}
      iconEmoji=""
      isActive={isActive}
      onToggle={onToggle}
    >
      <div className="item-list">
        {funciones.map((funcion) => (
          <ItemCard
            key={funcion.idFuncion}
            // name={funcion.nombre}
            details={
              <>
                • Fecha: {funcion.fechaInicio} <br />
                • Hora: {funcion.horaInicio} <br />
              </>
            }
            onEdit={() => editItem("funcion", funcion.id)}
            onDelete={() => deleteItem("funcion", funcion.id)}
          />
        ))}
      </div>

      <button className="add-button" onClick={() => addItem('funcion')}>
        + Agregar Función
      </button>
    </AccordionSection>
  );
};

export const EntradasAccordion = ({
  isActive,
  onToggle,
  editItem,
  deleteItem,
  addItem,
  entradas 
}) => {
  return (
    <AccordionSection
      id="entradas"
      title="Tipos de Entrada"
      badgeText={`${entradas.length} tipos de entradas`}
      iconEmoji=""
      isActive={isActive}
      onToggle={onToggle}
    >
      <div className="item-list">
        {entradas.map((entrada) => (
          <ItemCard
            key={entrada.idTipoEntrada}
            name={entrada.nombre}
            details={
              <>
                Descripción: {entrada.descripcion}<br />
              </>
            }
            onEdit={() => editItem("entrada", entrada.id)}
            onDelete={() => deleteItem("entrada", entrada.id)}
          />
        ))}
      </div>

      <button className="add-button" onClick={() => addItem('entrada')}>
        + Agregar Tipo de Entrada
      </button>
    </AccordionSection>
  );
};
