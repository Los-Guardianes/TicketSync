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
    };
  };
  export const abrirTicket = async (id) => {
  try {
    const blob = await apiDownload(`/api/miticket/${id}`);
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => window.URL.revokeObjectURL(url), 5000);
  } catch (err) {
    console.error('Error al abrir el ticket:', err);
  }
};