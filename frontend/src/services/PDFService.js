import { apiDownload } from './API';

export const descargarComprobante = async (id) => {
  try {
    const blob = await apiDownload(`/api/comp/${id}`);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `comprobante_${id}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Error al descargar el comprobante:', err);
  }
};