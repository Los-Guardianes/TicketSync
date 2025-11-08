export const DiscountForm = () => {
    return(
    <section className='ticket-purchase-grid'>                                            
        <div>                    
            <h2>Canjear código</h2>
            <div className="form-discount">
                <input 
                    className={`input-form ${errors.discount ? 'error' : ''}`}
                    name='discount'
                    placeholder='Ingresa el código de descuento'
                    maxLength={100}
                    value={formData.discount}
                    onChange={handleInputChange}
                    disabled={isLoading || montoDescuentoCodigo}
                />
                { !montoDescuentoCodigo ? (
                    <button 
                        type="button" 
                        className='btn btn-secondary btn-lg mt-3'
                        disabled={isLoading}
                        onClick={handleDiscount}
                    >
                        {isLoading ? 'Verificando...' : 'Aplicar'}
                    </button>
                    ) : (
                    <button 
                        type="button" 
                        className='btn btn-secondary btn-lg mt-3'
                        disabled={isLoading}
                        onClick={handleEliminarDescuento}
                    >
                        {isLoading ? 'Verificando...' : 'Eliminar'}
                    </button>                                                            
                    ) }                                                    
            </div>                        
            {errors.discount && <div className="error-form">{errors.discount}</div>}
        </div>                                            
    </section>
    )
}