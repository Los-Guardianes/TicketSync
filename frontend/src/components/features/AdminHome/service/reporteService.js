import { apiDownload } from '../../../../globalServices/API';

export const getReporte = async () => {
  try {
    console.log("Llamando a apiDownload para obtener el blob...");
    // 3. Llamamos a la función correcta
    const blob = await apiDownload('/api/organizador/reporte/excel');

    // 4. Devolvemos el blob y un nombre de archivo por defecto
    // (Tu apiDownload no nos da el nombre, así que lo ponemos aquí)
    return { blob, filename: 'reporte-organizadores.xlsx' };

  } catch (error) {
    console.error('Error al descargar el reporte:', error);
    throw error; // Lanzamos el error para que el componente lo maneje
  }
};