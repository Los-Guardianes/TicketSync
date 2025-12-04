import { apiDownload, apiDownloadPost } from './API';

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

export const abrirTickets = async (ids) => {
  try {
    const blob = await apiDownloadPost("/api/miticket", ids);
    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => window.URL.revokeObjectURL(url), 5000);
  } catch (err) {
    console.error("Error al abrir los tickets:", err);
  }
};