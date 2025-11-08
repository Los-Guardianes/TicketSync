export const ApplyDiscount = ({formData,descuentoCodigo,handleFormData, handleDeleteDiscount, handleAplicarCodigo, setNotification}) => {

    return (
        <article className='ticket-purchase-grid'>                                            
                <div>                    
                    <h2>Canjear código</h2>
                    <div className="form-discount">
                        <input 
                            className={`input-form}`}
                            name='discount'
                            placeholder='Ingresa el código de descuento'
                            maxLength={100}
                            value={formData.discount}
                            onChange={handleFormData}
                            disabled={descuentoCodigo} 
                        />
                        {/*{isLoading || descuentoCodigo} <--- antes era así, ver si se puede regresar pasando props o de otra forma*/}
                        { !descuentoCodigo ? (
                            <button 
                                type="button" 
                                className='btn btn-secondary btn-lg mt-3'                                
                                onClick={(e) => handleAplicarCodigo(e,formData.discount,setNotification)}
                            >
                                Aplicar
                            </button>
                            ) : (
                            <button 
                                type="button" 
                                className='btn btn-secondary btn-lg mt-3'                                
                                onClick={handleDeleteDiscount}
                            >
                                Eliminar
                            </button>                                                            
                            ) }                                                    
                    </div>                                                                            
                </div>                                            
        </article>    
    )
}