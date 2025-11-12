import './DropDownList.css'

export const  DropdownList = ({firstElement, list, id, value, onChangeOption, getNombre}) => {
    return (
        <>
        <div className="dropdown-wrapper">
            <select
            className="dropdown-button"
            value={value ? value : ""}           
            onChange={(e) => onChangeOption(e.target.value)}     
            >
            <option value="">{firstElement}</option>
            {list.map((opt) => (
                <option key={opt[id]} value={opt[id]}>
                    {getNombre(opt)}
                </option>
            ))}
            </select>
        </div>
        </>
    );
}