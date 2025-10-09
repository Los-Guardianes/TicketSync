export const DropdownOptions = ({ options = [], setSelectedOption, selectedOption, price}) => {

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
                    {selectedOption ? selectedOption.nombre : "Seleccionar"}
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    {options.map((option, index) => (
                        <li key={index}>
                            <button
                                className="dropdown-item"
                                type="button"
                                onClick={() => setSelectedOption(option)}
                            >
                                {option.nombre}                                                     
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
