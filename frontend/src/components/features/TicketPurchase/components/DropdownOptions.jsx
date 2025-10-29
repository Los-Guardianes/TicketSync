export const DropdownOptions = ({ 
  options = [], 
  setSelectedOption, 
  selectedOption, 
  // Permite definir una o varias claves para mostrar el texto del ítem (por defecto: ["nombre"])
  nombre = ["nombre"] 
}) => {

  // Obtiene el texto que se mostrará en el dropdown a partir de las claves definidas en 'nombre'
  const getNombre = (option) => {
    return nombre
      .map(key => option[key] || "") // Extrae el valor de cada clave; evita errores si no existe
      .join(" ")                     // Une los valores con espacio
      .trim();                       // Elimina espacios extra
  };

  return (
    <div className="col">
      <div className="dropdown">
        <button
          className="btn btn-light dropdown-toggle"
          style={{ background: "#EBF5EB" }}
          type="button"
          id="dropdownMenuButton"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {/* Muestra el texto de la opción seleccionada o un placeholder por defecto */}
          {selectedOption ? getNombre(selectedOption) : "Seleccionar"}
        </button>

        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          {options.map((option, index) => (
            <li key={index}>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => setSelectedOption(option)}
              >
                {/* Muestra el nombre del elemento según las claves definidas */}
                {getNombre(option)}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
