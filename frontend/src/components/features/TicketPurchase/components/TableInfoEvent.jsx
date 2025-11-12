"use client"
import "./TableInfoEvent.css"

export const TableInfoEvent = ({ periodos, zonas, funciones, tipoEntradas, tarifas }) => {
  const getTarifaByZonaTipoEntrada = (idZona, idTipoEntrada) => {
    return (
      tarifas.find((t) => {
        return t.zona.idZona === idZona && t.tipoEntrada.idTipoEntrada === idTipoEntrada
      }) || null
    )
  }

  return (
    <div className="table-info-event-container">
      {periodos && periodos.length > 0 && (
        <section>
          <div className="section-header">
            <h2 className="section-title">Periodos disponibles</h2>
          </div>
          <div className="table-wrapper">
            <table className="info-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                  <th>Descuento</th>
                </tr>
              </thead>
              <tbody>
                {periodos.map((p) => (
                  <tr key={p.idPeriodo}>
                    <td className="cell-primary">{p.nombre}</td>
                    <td>{p.fechaInicio}</td>
                    <td>{p.fechaFin}</td>
                    <td>
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
        </section>
      )}

      {zonas && funciones && (
        <section>
          <div className="section-header">
            <h2 className="section-title">Tarifas por zona y tipo de entrada</h2>
          </div>
          <div className="table-wrapper">
            <table className="info-table pricing-table">
              <thead>
                <tr>
                  <th className="zone-column">Zona/Tipo Entrada</th>
                  {tipoEntradas.map((tpEntrada) => (
                    <th key={tpEntrada.idTipoEntrada} className="type-column">
                      {tpEntrada.nombre}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {zonas.map((z) => (
                  <tr key={z.idZona}>
                    <td className="zone-cell cell-primary">{z.nombre}</td>
                    {tipoEntradas.map((tpEntrada) => {
                      const tarifa = getTarifaByZonaTipoEntrada(z.idZona, tpEntrada.idTipoEntrada)
                      return (
                        <td key={tpEntrada.idTipoEntrada} className="price-cell">
                          <span>{tarifa ? `S/. ${tarifa.precioBase}` : "-"}</span>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}
