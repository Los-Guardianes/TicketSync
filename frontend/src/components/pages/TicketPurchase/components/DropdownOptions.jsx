export const DropdownOptions = ({ 
        options = [], 
        setSelectedOption, 
        selectedOption, 
        price,
        nombre = "nombre"
    }) => {
        
    const getNombre = (option) => {
        return option[nombre] || "";
    }
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
                                {getNombre(option)}                                                     
                                {price !== undefined && (
                                    <> — ${price}</>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
