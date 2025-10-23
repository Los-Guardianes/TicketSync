import React, { useState } from 'react';
import { descargarComprobante } from '../../MisTickets/service/PDFService'; 

export const ComprobanteTest = () => {
  const [idCompra, setIdCompra] = useState('');
  const [descargando, setDescargando] = useState(false);
  const [error, setError] = useState('');

  const handleDescarga = async () => {
    setDescargando(true);
    setError('');
    try {
      await descargarComprobante(idCompra);
    } catch (err) {
      setError(err.message || 'Error al descargar el comprobante');
    } finally {
      setDescargando(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Prueba de descarga de comprobante</h2>
      <input
        type="text"
        placeholder="ID de compra"
        value={idCompra}
        onChange={(e) => setIdCompra(e.target.value)}
        style={{ marginRight: '1rem' }}
      />
      <button onClick={handleDescarga} disabled={descargando || !idCompra}>
        {descargando ? 'Descargando...' : 'Descargar PDF'}
      </button>
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
};