import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ConfigEventoActions.css';

export const ConfigEventoDatos = ({ }) => {
  return (
    <div>
      {/* Acordeón de Zonas */ }
      < div className = "accordion" >
        <div
          className={`accordion-header ${isActive('zonas') ? 'active' : ''}`}
          onClick={() => toggleAccordion('zonas')}
        >
          <span className="accordion-title">
            🎯 Zonas
            <span className="badge badge-success">3 zonas</span>
          </span>
          <span className="accordion-icon">▼</span>
        </div>
        <div
          className={`accordion-content ${isActive('zonas') ? 'active' : ''}`}
        >
            <div className="accordion-body">
                <div className="item-list">
                    <div className="item-card">
                        <div className="item-header">
                            <div className="item-name">Zona VIP</div>
                        </div>
                        <div className="item-details">
                            • Capacidad: 100 asientos<br />
                            • Precio base: S/ 150<br />
                            • Ubicación: Palcos centrales
                        </div>
                        <div className="item-actions">
                            <button
                                className="item-btn"
                                onClick={() => editItem('zona', 1)}
                            >
                                ✏️ Editar
                            </button>
                            <button
                                className="item-btn"
                                onClick={() => deleteItem('zona', 1)}
                            >
                                🗑️ Eliminar
                            </button>
                        </div>
                    </div>

                    <div className="item-card">
                        <div className="item-header">
                            <div className="item-name">Platea</div>
                        </div>
                        <div className="item-details">
                            • Capacidad: 200 asientos<br />
                            • Precio base: S/ 80<br />
                            • Ubicación: Planta baja
                        </div>
                        <div className="item-actions">
                            <button
                                className="item-btn"
                                onClick={() => editItem('zona', 2)}
                            >
                                ✏️ Editar
                            </button>
                            <button
                                className="item-btn"
                                onClick={() => deleteItem('zona', 2)}
                            >
                                🗑️ Eliminar
                            </button>
                        </div>
                    </div>

                    <div className="item-card">
                        <div className="item-header">
                            <div className="item-name">Galería</div>
                        </div>
                        <div className="item-details">
                            • Capacidad: 100 asientos<br />
                            • Precio base: S/ 50<br />
                            • Ubicación: Segundo piso
                        </div>
                        <div className="item-actions">
                            <button
                                className="item-btn"
                                onClick={() => editItem('zona', 3)}
                            >
                                ✏️ Editar
                            </button>
                            <button
                                className="item-btn"
                                onClick={() => deleteItem('zona', 3)}
                            >
                                🗑️ Eliminar
                            </button>
                        </div>
                    </div>
                </div>
                <button
                    className="add-button"
                    onClick={() => addItem('zona')}
                >
                    + Agregar Zona
                </button>
            </div>
        </div>
      </div >
    </div >
  );
};