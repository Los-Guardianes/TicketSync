
export const TicketQuantitySelector = ({ children, cantidadEntradas, incrementar, decrementar }) => {
    return (
        <div>
            {children}
            <div>
            <button 
                className='btn rounded-full' 
                style={{ background: "#EBF5EB", fontWeight: "700"}}
                onClick={decrementar}>-</button>
            {cantidadEntradas}
            <button 
                className='btn rounded-full' 
                style={{ background: "#EBF5EB", fontWeight: "700" }}
                onClick={incrementar}>+</button>
            </div>
        </div>
    );
}