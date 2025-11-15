// === VALIDACIONES GENERALES

// TEMPORADA
export const validarTemporadas = (temporadas = []) => {
  const erroresTemp = {};
  const nombresUsados = new Set();

  
  temporadas.forEach((temp, index) => {
    // Nombre requerido y sin duplicados (case/trim–insensitive)
    if (!temp?.nombre || temp.nombre.trim() === "") {
      erroresTemp[`temporada-${index}-nombre`] = "El nombre de la temporada es obligatorio";
    } else {
      const nombreNormalizado = temp.nombre.trim().toLowerCase();
      if (nombresUsados.has(nombreNormalizado)) {
        erroresTemp[`temporada-${index}-nombreDuplicado`] = "El nombre de la temporada ya existe";
      } else {
        nombresUsados.add(nombreNormalizado);
      }
    }

    // Fechas requeridas
    if (!temp?.fechaInicio) {
      erroresTemp[`temporada-${index}-fechaInicio`] = "La fecha de inicio es obligatoria";
    }
    if (!temp?.fechaFin) {
      erroresTemp[`temporada-${index}-fechaFin`] = "La fecha de fin es obligatoria";
    }

    // Orden de fechas
    if (temp?.fechaInicio && temp?.fechaFin) {
      // Si vienen como string (YYYY-MM-DD), convierte a Date para evitar comparaciones de string
      const ini = new Date(temp.fechaInicio);
      const fin = new Date(temp.fechaFin);
      if (ini > fin) {
        erroresTemp[`temporada-${index}-fechas`] = "La fecha de inicio debe ser anterior a la fecha de fin";
      }
    }
  });

    
  return erroresTemp;
};
