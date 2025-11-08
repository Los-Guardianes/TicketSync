import { useEffect } from "react"

export const TableInfoEvent = ({periodos, zonas, funciones, tipoEntradas, tarifas}) => {

const getTarifaByZonaTipoEntrada = (idZona, idTipoEntrada) => {
    return tarifas.find(t => {
        return(
            t.zona.idZona === idZona && t.tipoEntrada.idTipoEntrada === idTipoEntrada
        )                
    }) || null //<- devuelve null si no encuentra nada
}
    /*

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
}
*/

return (      
    <>    
    <section>
    {periodos && periodos.length > 0 && (
    <article>
        <div className="mb-2">
            <h2 className="ticket-purchase-section-title">Periodos disponibles</h2>
            <div>
            <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-gray-100 text-gray-900">
                <tr>
                    <th className="px-4 py-2 text-left font-medium">Nombre</th>
                    <th className="px-4 py-2 text-left font-medium">Fecha Inicio</th>
                    <th className="px-4 py-2 text-left font-medium">Fecha Fin</th>                                    
                    <th className="px-4 py-2 text-left font-medium">Descuento</th>                    
                </tr>
                </thead>
                <tbody>
                {periodos.map((p) => (
                    <tr
                    key={p.idPeriodo}
                    className="border-t hover:bg-gray-50 transition-colors"
                    >
                    <td className="px-4 py-2">{p.nombre}</td>
                    <td className="px-4 py-2">{p.fechaInicio}</td>
                    <td className="px-4 py-2">{p.fechaFin}</td>                     
                    <td className="px-4 py-2">
                    {!p.tipoDesc || p.valorDescuento == null
                        ? "-"
                        : p.tipoDesc === "MONTO"
                        ? `S/. ${p.valorDescuento}`
                        : `${p.valorDescuento}%`}
                    </td>

                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
        <div>
            
        </div>
    </article>     
    )}    
    {(zonas && funciones) ? (
        <article>
            <h2> Tarifas por zona y tipo de entrada </h2>
            <table className="">
                <thead className="bg-gray-100 text-gray-900">
                    <tr                        
                        className="border-t hover:bg-gray-50 transition-colors"
                    >
                    <th>Zona/TipoEntrada</th>
                    {                    
                     tipoEntradas.map((tpEntrada) =>
                        <th className="px-4 py-2 text-left font-medium" key = {tpEntrada.idTipoEntrada}>
                            {tpEntrada.nombre}
                        </th>
                     )  
                    }                   
                    </tr>
                </thead>
                <tbody>
                    {
                        zonas.map((z) =>
                            <tr key={z.idZona}>
                                <th>{z.nombre}</th>
                                {tipoEntradas.map((tpEntrada)=>{
                                    const tarifa = getTarifaByZonaTipoEntrada(z.idZona, tpEntrada.idTipoEntrada);
                                    return (
                                        <td key={tpEntrada.idTipoEntrada} className="px-4 py-2">
                                            {tarifa ? `S/. ${tarifa.precioBase}` : '-'}
                                        </td>
                                    );
                                })}                                
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </article>
    ) : null }
    </section>
    </>           
)        
}