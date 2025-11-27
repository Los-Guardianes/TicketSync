import "./QuickStats.css"

export const QuickStats = ({ stats }) => {
  return (
    <div className="quick-stats">
      <div className="quick-stats-header">
        <div className="quick-stats-icon">
          <i className="bi bi-bar-chart-line"></i>
        </div>
        <h3 className="quick-stats-title">Estadísticas Rápidas</h3>
      </div>

      <div className="quick-stats-list">
        <div className="quick-stats-item">
          <span className="quick-stats-label">Eventos Activos</span>
          <span className="quick-stats-value">{stats.activeEvents || 247}</span>
        </div>
        <div className="quick-stats-item">
          <span className="quick-stats-label">Organizadores</span>
          <span className="quick-stats-value">{stats.organizers || 89}</span>
        </div>
        <div className="quick-stats-item">
          <span className="quick-stats-label">Tickets Vendidos (Mes)</span>
          <span className="quick-stats-value highlight">{stats.ticketsSoldMonth || "12,456"}</span>
        </div>
        <div className="quick-stats-item">
          <span className="quick-stats-label">Ingresos (Mes)</span>
          <span className="quick-stats-value money">${stats.monthlyRevenue || "45,230"}</span>
        </div>
      </div>
    </div>
  )
}
