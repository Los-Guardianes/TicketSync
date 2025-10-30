"use client"

import "./DropdownOptions.css"

export const DropdownOptions = ({ 
  options = [], 
  setSelectedOption, 
  selectedOption, 
  nombre = ["nombre"] 
}) => {
  
  const getNombre = (option) => {
    return nombre
      .map(key => option[key] || "") // Extrae el valor de cada clave; evita errores si no existe
      .join(" ")                     // Une los valores con espacio
      .trim();                       // Elimina espacios extra
  }

  return (
    <div className="dropdown-wrapper">
      <select
        className="dropdown-button"
        value={selectedOption ? getNombre(selectedOption) : ""}
        onChange={(e) => {
          const selected = options.find((opt) => getNombre(opt) === e.target.value)
          if (selected) setSelectedOption(selected)
        }}
      >
        <option value="">Seleccionar</option>
        {options.map((option, index) => (
          <option key={index} value={getNombre(option)}>
            {getNombre(option)}
          </option>
        ))}
      </select>
    </div>
  )
}
