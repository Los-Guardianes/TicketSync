import React from 'react';

const discountData = [
  {
    code: 'EARLYBIRD10',
    type: 'Porcentaje',
    value: '10%',
    appliesTo: 'General - Preventa, General - Regular',
    uses: '120/200',
  },
  {
    code: 'VIP30',
    type: 'Monto',
    value: 'S/ 30.00',
    appliesTo: 'VIP - Preventa',
    uses: '10/50',
  },
];

const DiscountList = () => {
  return (
    <div className="crear-evento-container">
      <div className="header">
        <h2>Gestión de descuentos</h2>
      </div>

      <div className="campo">
        <label style={{ fontWeight: '600', marginBottom: '12px' }}>Códigos existentes</label>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#eaf6ea', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Código</th>
              <th style={{ padding: '12px' }}>Tipo</th>
              <th style={{ padding: '12px' }}>Valor</th>
              <th style={{ padding: '12px' }}>Aplica a</th>
              <th style={{ padding: '12px' }}>Usos</th>
              <th style={{ padding: '12px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {discountData.map((d, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px' }}>{d.code}</td>
                <td style={{ padding: '12px' }}>{d.type}</td>
                <td style={{ padding: '12px' }}>{d.value}</td>
                <td style={{ padding: '12px' }}>{d.appliesTo}</td>
                <td style={{ padding: '12px' }}>{d.uses}</td>
                <td style={{ padding: '12px' }}>
                  <button style={{ marginRight: '8px', background: 'none', border: 'none', color: '#219653', cursor: 'pointer' }}>✏️</button>
                  <button style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer' }}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="form-actions">
        <button className="cancel" type="button">Regresar</button>
      </div>
    </div>
  );
};

export default DiscountList;