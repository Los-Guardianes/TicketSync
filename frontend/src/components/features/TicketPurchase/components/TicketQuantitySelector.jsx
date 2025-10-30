"use client"

import "./TicketQuantitySelector.css"

export const TicketQuantitySelector = ({ children, cantidadEntradas, incrementar, decrementar }) => {
  return (
    <fieldset className="quantity-selector">
      <legend className="quantity-selector-label">{children}</legend>
      <div className="quantity-selector-controls">
        <button className="quantity-button" onClick={decrementar} aria-label="Disminuir cantidad">
          −
        </button>
        <span className="quantity-display" aria-live="polite">
          {cantidadEntradas}
        </span>
        <button className="quantity-button" onClick={incrementar} aria-label="Aumentar cantidad">
          +
        </button>
      </div>
    </fieldset>
  )
}
