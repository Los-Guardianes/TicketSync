import "../CreateEvent.css"

export const FunctionCard = ({ index, isLast, func, onRemove, onChange }) => {
    return (
        <div className={`function-card ${!isLast ? "mb-16" : ""}`}>
            <div className="function-header">
                <div className="function-index">{index + 1}</div>
                <button type="button" onClick={onRemove} className="delete-button">
                    Eliminar
                </button>
            </div>

            <div className="function-grid">
                {/* INICIO */}
                <div>
                    <label className="form-label">
                        Fecha y hora de inicio <span className="required">*</span>
                    </label>
                    <input
                        type="date"
                        name="fechaInicio"
                        value={func.inicioD}
                        onChange={(e) => onChange("inicioD", e.target.value)}
                        className="form-input"
                    />
                    <input
                        type="time"
                        name="horaInicio"
                        value={func.inicioH}
                        onChange={(e) => onChange("inicioH", e.target.value)}
                        className="form-input"
                    />
                </div>
                {/* FIN */}
                <div>
                    <label className="form-label">
                        Fecha y hora de fin <span className="required">*</span>
                    </label>
                    <input
                        type="date"
                        name="fechaFin"
                        value={func.finD}
                        onChange={(e) => onChange("finD", e.target.value)}
                        className="form-input"
                    />
                    <input
                        type="time"
                        name="horaFin"
                        value={func.finH}
                        onChange={(e) => onChange("finH", e.target.value)}
                        className="form-input"
                    />
                </div>
            </div>
        </div>
    );
}


export const FunctionsSection = ({ funciones, removeFunction, handleFunctionChange, addFunction }) => {
    return (
        <div className="functions-section">
            <div className="section-title">Fechas y Horarios</div>

            <div className="functions-container">
                {funciones.map((func, index) => (
                    <FunctionCard
                        key={func.id}
                        index={index}
                        isLast={index === funciones.length - 1}
                        func={func}
                        onRemove={() => removeFunction(func.id)}
                        onChange={(field, value) => handleFunctionChange(func.id, field, value)}
                    />
                ))}
            </div>

            <button type="button" onClick={addFunction} className="add-function-button">
                + Agregar otra función
            </button>

            <div className="form-helper">
                Si tu evento tiene múltiples fechas, puedes agregar más funciones
            </div>
        </div>
    );
}