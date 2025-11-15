  export const applyFiltersToEvents = (eventos, filters) => {
  if (!filters) return eventos;

  return eventos.filter(evento => {
    // Filtro de búsqueda por nombre
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!evento.nombre.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    console.log(evento);

    // Filtro por ubicación
    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      // if (!evento.direccion?.toLowerCase().includes(locationLower)) {
      // console.log(typeof filters.location);
      if (String(evento.ciudad.dpto.idDpto) !== filters.location) {
        return false;
      }
    }

    // Filtro por fecha desde
    if (filters.dateFrom && evento.fechaReferencia) {
      const eventDate = new Date(evento.fechaReferencia);
      const filterDate = new Date(filters.dateFrom);
      if (eventDate < filterDate) {
        return false;
      }
    }

    // Filtro por fecha hasta
    if (filters.dateTo && evento.fechaReferencia) {
      const eventDate = new Date(evento.fechaReferencia);
      const filterDate = new Date(filters.dateTo);
      if (eventDate > filterDate) {
        return false;
      }
    }

    // Filtro por categoría
    if (filters.category) {
      if (String(evento.categoriaEvento.idCategoria) !== filters.category) {
        return false;
      }
    }

    return true;
  });
};