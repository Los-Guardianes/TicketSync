"use client"

import "./TicketQuantitySelector.css"

export const TicketQuantitySelector = ({ cantidadEntradas, updateCantidad, idTarifa, maxCantidad}) => {

  const incrementar = () => {
    if(maxCantidad && cantidadEntradas >= maxCantidad) return;
    const nuevaCantidad = cantidadEntradas + 1;
    updateCantidad(idTarifa, nuevaCantidad);
  }

  const decrementar = () => {
    if(cantidadEntradas <= 0) return;
    const nuevaCantidad = cantidadEntradas - 1;
    updateCantidad(idTarifa, nuevaCantidad);
  }

  return (
    <fieldset className="quantity-selector">
      <div className="quantity-selector-controls">
        <button type="button" className="quantity-button" onClick={decrementar} aria-label="Disminuir cantidad">
          −
        </button>
        <span className="quantity-display" aria-live="polite">
          {cantidadEntradas}
        </span>
        <button type="button" className="quantity-button" onClick={incrementar} aria-label="Aumentar cantidad">
          +
        </button>
      </div>
    </fieldset>
  )
}
