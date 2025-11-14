import { useState, useEffect } from 'react';
import { getCateventos } from '../../../../globalServices/EventoService';
import { getDepartamentos } from '../../../../globalServices/UbicacionService';
import './Filters.css';

export const FiltersSection = ({ onApply }) => {
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    dateFrom: '',
    dateTo: '',
    category: ''
  });

  const [activeFilters, setActiveFilters] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // CARGAR CATEGORIAS
  const [catEvento, setCatEvento] = useState([]);
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await getCateventos();
        setCatEvento(data);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };
    fetchCategorias();
  }, []);
  // CARGAR UBICACIONES
  const [departamentos, setDepartamentos] = useState([]);
  // Cargar la lista de departamentos cuando el componente se monta
  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const data = await getDepartamentos();
        setDepartamentos(data);
      } catch (error) {
        console.error("Error al cargar departamentos:", error);
      }
    };
    fetchDepartamentos();
  }, []);

  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyFilters = () => {
    const active = [];
    
    if (filters.search) active.push({ type: 'search', label: `Búsqueda: ${filters.search}`, value: filters.search });
    if (filters.location) active.push({ type: 'location', label: `Ubicación: ${filters.location}`, value: filters.location });
    if (filters.dateFrom) active.push({ type: 'dateFrom', label: `Desde: ${filters.dateFrom}`, value: filters.dateFrom });
    if (filters.dateTo) active.push({ type: 'dateTo', label: `Hasta: ${filters.dateTo}`, value: filters.dateTo });
    if (filters.category) active.push({ type: 'category', label: `Categoría: ${filters.category}`, value: filters.category });

    setActiveFilters(active);
    
    // Llamar al callback del padre con los filtros aplicados
    if (onApply) {
      onApply(filters);
    }
  };

  const removeFilter = (type) => {
    setFilters(prev => ({
      ...prev,
      [type]: ''
    }));
    
    const newActiveFilters = activeFilters.filter(f => f.type !== type);
    setActiveFilters(newActiveFilters);
    
    // Aplicar automáticamente después de remover
    if (onApply) {
      const updatedFilters = { ...filters, [type]: '' };
      onApply(updatedFilters);
    }
  };

  const clearAllFilters = () => {
    const emptyFilters = {
      search: '',
      location: '',
      dateFrom: '',
      dateTo: '',
      status: '',
      category: ''
    };
    
    setFilters(emptyFilters);
    setActiveFilters([]);
    
    if (onApply) {
      onApply(emptyFilters);
    }
  };

  return (
    <div className="filters-section">
      <div className="filters-header">
        <div className="filters-title">Filtrar eventos</div>

        <div className="header-actions">
          {activeFilters.length > 0 && (
            <button className="clear-filters" onClick={clearAllFilters}>
              Limpiar filtros
            </button>
          )}
          <button className="toggle-button" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          <div className="filters-grid">
            <div className="filter-group">
              <label className="filter-label">Buscar</label>
              <input
                type="text"
                className="filter-input"
                placeholder="Nombre del evento..."
                value={filters.search}
                onChange={(e) => handleInputChange('search', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Ubicación</label>
              <select
                className="filter-select"
                value={filters.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              >
                <option value="">Todas las ubicaciones</option>
                {departamentos.map(d => (
                  <option key={d.idDpto} value={d.idDpto}>{d.nombre}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Fecha desde</label>
              <input
                type="date"
                className="filter-input"
                value={filters.dateFrom}
                onChange={(e) => handleInputChange('dateFrom', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Fecha hasta</label>
              <input
                type="date"
                className="filter-input"
                value={filters.dateTo}
                onChange={(e) => handleInputChange('dateTo', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Categoría</label>
              <select
                className="filter-select"
                value={filters.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                <option value="" disabled>Selecciona una categoría</option>
                {catEvento.map(cat => (
                  <option key={cat.idCategoria} value={cat.idCategoria}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button className="apply-button" onClick={applyFilters}>
            Aplicar filtros
          </button>

          {activeFilters.length > 0 && (
            <div className="active-filters">
              {activeFilters.map(filter => (
                <div key={filter.type} className="filter-tag">
                  {filter.label}
                  <span
                    className="filter-tag-close"
                    onClick={() => removeFilter(filter.type)}
                  >
                    ×
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};