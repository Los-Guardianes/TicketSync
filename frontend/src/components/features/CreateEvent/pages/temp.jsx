import React, { useState } from 'react';

const CreateTickets = () => {
  const [currency, setCurrency] = useState('PEN');
  const [showSeasonModal, setShowSeasonModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [editingSeason, setEditingSeason] = useState(null);
  const [editingTicket, setEditingTicket] = useState(null);
  const [editingZone, setEditingZone] = useState(null);
  
  const [zones, setZones] = useState([
    { id: 1, name: 'Zona VIP Norte', capacity: 100 },
    { id: 2, name: 'Zona Premium Sur', capacity: 150 }
  ]);
  
  const [seasons, setSeasons] = useState([
    { id: 1, name: 'Temporada Alta', discount: 15, startDate: '2024-03-01', endDate: '2024-05-31' }
  ]);
  
  const [tickets, setTickets] = useState([
    { id: 1, type: 'VIP', zoneIds: [1], basePrice: 150, maxPerOrder: 5, availableSeats: 50, description: '' }
  ]);

  const [seasonForm, setSeasonForm] = useState({ name: '', discount: 0, startDate: '', endDate: '' });
  const [zoneForm, setZoneForm] = useState({ name: '', capacity: 0 });
  const [ticketForm, setTicketForm] = useState({ type: '', zoneIds: [], basePrice: 0, maxPerOrder: 10, availableSeats: 0, description: '' });

  const openZoneModal = (zone = null) => {
    if (zone) {
      setEditingZone(zone.id);
      setZoneForm({ name: zone.name, capacity: zone.capacity });
    } else {
      setEditingZone(null);
      setZoneForm({ name: '', capacity: 0 });
    }
    setShowZoneModal(true);
  };

  const handleZoneSubmit = (e) => {
    e.preventDefault();
    if (editingZone) {
      setZones(zones.map(z => z.id === editingZone ? { ...z, ...zoneForm } : z));
    } else {
      setZones([...zones, { id: Date.now(), ...zoneForm }]);
    }
    setShowZoneModal(false);
  };

  const deleteZone = (id) => {
    setZones(zones.filter(z => z.id !== id));
    setTickets(tickets.map(t => ({ ...t, zoneIds: t.zoneIds.filter(zId => zId !== id) })));
  };

  const openSeasonModal = (season = null) => {
    if (season) {
      setEditingSeason(season.id);
      setSeasonForm({ ...season });
    } else {
      setEditingSeason(null);
      setSeasonForm({ name: '', discount: 0, startDate: '', endDate: '' });
    }
    setShowSeasonModal(true);
  };

  const openTicketModal = (ticket = null) => {
    if (ticket) {
      setEditingTicket(ticket.id);
      setTicketForm({ ...ticket });
    } else {
      setEditingTicket(null);
      setTicketForm({ type: '', zoneIds: [], basePrice: 0, maxPerOrder: 10, availableSeats: 0, description: '' });
    }
    setShowTicketModal(true);
  };

  const handleSeasonSubmit = (e) => {
    e.preventDefault();
    if (editingSeason) {
      setSeasons(seasons.map(s => s.id === editingSeason ? { ...s, ...seasonForm } : s));
    } else {
      setSeasons([...seasons, { id: Date.now(), ...seasonForm }]);
    }
    setShowSeasonModal(false);
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (editingTicket) {
      setTickets(tickets.map(t => t.id === editingTicket ? { ...t, ...ticketForm } : t));
    } else {
      setTickets([...tickets, { id: Date.now(), ...ticketForm }]);
    }
    setShowTicketModal(false);
  };

  const deleteSeason = (id) => {
    setSeasons(seasons.filter(s => s.id !== id));
  };

  const deleteTicket = (id) => {
    setTickets(tickets.filter(t => t.id !== id));
  };

  const toggleZoneSelection = (zoneId) => {
    const currentZones = ticketForm.zoneIds;
    if (currentZones.includes(zoneId)) {
      setTicketForm({ ...ticketForm, zoneIds: currentZones.filter(id => id !== zoneId) });
    } else {
      setTicketForm({ ...ticketForm, zoneIds: [...currentZones, zoneId] });
    }
  };

  const getZoneNames = (zoneIds) => {
    return zoneIds.map(id => zones.find(z => z.id === id)?.name).filter(Boolean).join(', ') || 'Sin zonas';
  };

  const getCurrencySymbol = () => {
    const symbols = { PEN: 'S/', USD: '$', EUR: '€' };
    return symbols[currency] || currency;
  };

  return (
    <div style={s.container}>
      <div style={s.content}>
        
        {/* Header */}
        <div style={s.header}>
          <div style={s.stepBadge}>3</div>
          <h1 style={s.title}>Crear Entradas</h1>
        </div>

        <div style={s.card}>
          {/* Moneda */}
          <div style={s.row}>
            <label style={s.label}>Moneda</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={s.select}>
              <option value="PEN">S/ (PEN)</option>
              <option value="USD">$ (USD)</option>
              <option value="EUR">€ (EUR)</option>
            </select>
          </div>

          {/* Zonas */}
          <div style={s.section}>
            <div style={s.sectionHeader}>
              <span style={s.sectionTitle}>Zonas del evento</span>
              <button onClick={() => openZoneModal()} style={s.addBtn}>+ Agregar zona</button>
            </div>
            
            {zones.map((zone, idx) => (
              <div key={zone.id} style={s.item}>
                <div style={s.itemHeader}>
                  <span style={s.itemTitle}>Zona {idx + 1}</span>
                  <button onClick={() => deleteZone(zone.id)} style={s.deleteBtn}>×</button>
                </div>
                <div style={s.itemContent}>
                  <div style={s.field}>
                    <label style={s.fieldLabel}>Nombre de la zona</label>
                    <input type="text" value={zone.name} readOnly style={s.input} onClick={() => openZoneModal(zone)} />
                  </div>
                  <div style={s.field}>
                    <label style={s.fieldLabel}>Aforo</label>
                    <input type="number" value={zone.capacity} readOnly style={s.input} onClick={() => openZoneModal(zone)} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Temporadas */}
          <div style={s.section}>
            <div style={s.sectionHeader}>
              <span style={s.sectionTitle}>Temporadas</span>
              <button onClick={() => openSeasonModal()} style={s.addBtn}>+ Agregar temporada</button>
            </div>
            
            {seasons.map((season, idx) => (
              <div key={season.id} style={s.item}>
                <div style={s.itemHeader}>
                  <span style={s.itemTitle}>Temporada {idx + 1}</span>
                  <button onClick={() => deleteSeason(season.id)} style={s.deleteBtn}>×</button>
                </div>
                <div style={s.itemContent}>
                  <div style={s.field}>
                    <label style={s.fieldLabel}>Nombre de la temporada</label>
                    <input type="text" value={season.name} readOnly style={s.input} onClick={() => openSeasonModal(season)} />
                  </div>
                  <div style={s.field}>
                    <label style={s.fieldLabel}>Descuento</label>
                    <input type="text" value={season.discount + '%'} readOnly style={s.input} onClick={() => openSeasonModal(season)} />
                  </div>
                  <div style={s.fieldRow}>
                    <div style={s.field}>
                      <label style={s.fieldLabel}>Fecha de inicio</label>
                      <input type="date" value={season.startDate} readOnly style={s.input} onClick={() => openSeasonModal(season)} />
                    </div>
                    <div style={s.field}>
                      <label style={s.fieldLabel}>Fecha de Fin</label>
                      <input type="date" value={season.endDate} readOnly style={s.input} onClick={() => openSeasonModal(season)} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Entradas */}
          <div style={s.section}>
            <div style={s.sectionHeader}>
              <span style={s.sectionTitle}>Tipos de entrada</span>
              <button onClick={() => openTicketModal()} style={s.addBtn}>+ Agregar entrada</button>
            </div>
            
            {tickets.map((ticket, idx) => (
              <div key={ticket.id} style={s.item}>
                <div style={s.itemHeader}>
                  <span style={s.itemTitle}>Entrada {idx + 1}</span>
                  <button onClick={() => deleteTicket(ticket.id)} style={s.deleteBtn}>×</button>
                </div>
                <div style={s.itemContent}>
                  <div style={s.field}>
                    <label style={s.fieldLabel}>Tipo de la entrada</label>
                    <input type="text" value={ticket.type} readOnly style={s.input} onClick={() => openTicketModal(ticket)} />
                  </div>
                  <div style={s.field}>
                    <label style={s.fieldLabel}>Zona de la entrada</label>
                    <input type="text" value={getZoneNames(ticket.zoneIds)} readOnly style={s.input} onClick={() => openTicketModal(ticket)} />
                  </div>
                  <div style={s.fieldRow}>
                    <div style={s.field}>
                      <label style={s.fieldLabel}>Precio</label>
                      <input type="text" value={getCurrencySymbol() + ' ' + ticket.basePrice} readOnly style={s.input} onClick={() => openTicketModal(ticket)} />
                    </div>
                    <div style={s.field}>
                      <label style={s.fieldLabel}>Max. cantidad por orden</label>
                      <input type="number" value={ticket.maxPerOrder} readOnly style={s.input} onClick={() => openTicketModal(ticket)} />
                    </div>
                  </div>
                  <div style={s.fieldRow}>
                    <div style={s.field}>
                      <label style={s.fieldLabel}>Cantidad disponible</label>
                      <input type="number" value={ticket.availableSeats} readOnly style={s.input} onClick={() => openTicketModal(ticket)} />
                    </div>
                    <div style={s.field}>
                      <label style={s.fieldLabel}>Descripción</label>
                      <input type="text" value={ticket.description} readOnly style={s.input} onClick={() => openTicketModal(ticket)} placeholder="Escribe información adicional" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={s.footer}>
            <button style={s.btnSecondary}>Regresar</button>
            <button style={s.btnPrimary}>Publicar evento</button>
          </div>
        </div>

      </div>

      {/* MODAL ZONA */}
      {showZoneModal && (
        <div style={s.modalOverlay} onClick={() => setShowZoneModal(false)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h3 style={s.modalTitle}>{editingZone ? 'Editar Zona' : 'Nueva Zona'}</h3>
              <button onClick={() => setShowZoneModal(false)} style={s.modalClose}>×</button>
            </div>
            <form onSubmit={handleZoneSubmit} style={s.modalBody}>
              <div style={s.formField}>
                <label style={s.formLabel}>Nombre de la zona *</label>
                <input
                  type="text"
                  required
                  value={zoneForm.name}
                  onChange={(e) => setZoneForm({ ...zoneForm, name: e.target.value })}
                  style={s.formInput}
                  placeholder="Ej: Zona VIP Norte"
                />
              </div>
              <div style={s.formField}>
                <label style={s.formLabel}>Aforo (capacidad) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={zoneForm.capacity}
                  onChange={(e) => setZoneForm({ ...zoneForm, capacity: Number(e.target.value) })}
                  style={s.formInput}
                  placeholder="100"
                />
              </div>
              <div style={s.modalFooter}>
                <button type="button" onClick={() => setShowZoneModal(false)} style={s.modalBtnSecondary}>Cancelar</button>
                <button type="submit" style={s.modalBtnPrimary}>{editingZone ? 'Guardar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TEMPORADA */}
      {showSeasonModal && (
        <div style={s.modalOverlay} onClick={() => setShowSeasonModal(false)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h3 style={s.modalTitle}>{editingSeason ? 'Editar Temporada' : 'Nueva Temporada'}</h3>
              <button onClick={() => setShowSeasonModal(false)} style={s.modalClose}>×</button>
            </div>
            <form onSubmit={handleSeasonSubmit} style={s.modalBody}>
              <div style={s.formField}>
                <label style={s.formLabel}>Nombre de la temporada *</label>
                <input
                  type="text"
                  required
                  value={seasonForm.name}
                  onChange={(e) => setSeasonForm({ ...seasonForm, name: e.target.value })}
                  style={s.formInput}
                  placeholder="Ej: Temporada Alta"
                />
              </div>
              <div style={s.formField}>
                <label style={s.formLabel}>Descuento (%) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={seasonForm.discount}
                  onChange={(e) => setSeasonForm({ ...seasonForm, discount: Number(e.target.value) })}
                  style={s.formInput}
                  placeholder="0"
                />
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                <div style={s.formField}>
                  <label style={s.formLabel}>Fecha de Inicio *</label>
                  <input
                    type="date"
                    required
                    value={seasonForm.startDate}
                    onChange={(e) => setSeasonForm({ ...seasonForm, startDate: e.target.value })}
                    style={s.formInput}
                  />
                </div>
                <div style={s.formField}>
                  <label style={s.formLabel}>Fecha de Fin *</label>
                  <input
                    type="date"
                    required
                    value={seasonForm.endDate}
                    onChange={(e) => setSeasonForm({ ...seasonForm, endDate: e.target.value })}
                    style={s.formInput}
                  />
                </div>
              </div>
              <div style={s.modalFooter}>
                <button type="button" onClick={() => setShowSeasonModal(false)} style={s.modalBtnSecondary}>Cancelar</button>
                <button type="submit" style={s.modalBtnPrimary}>{editingSeason ? 'Guardar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ENTRADA */}
      {showTicketModal && (
        <div style={s.modalOverlay} onClick={() => setShowTicketModal(false)}>
          <div style={{...s.modal, maxWidth: '600px'}} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h3 style={s.modalTitle}>{editingTicket ? 'Editar Entrada' : 'Nueva Entrada'}</h3>
              <button onClick={() => setShowTicketModal(false)} style={s.modalClose}>×</button>
            </div>
            <form onSubmit={handleTicketSubmit} style={s.modalBody}>
              <div style={s.formField}>
                <label style={s.formLabel}>Tipo de entrada *</label>
                <input
                  type="text"
                  required
                  value={ticketForm.type}
                  onChange={(e) => setTicketForm({ ...ticketForm, type: e.target.value })}
                  style={s.formInput}
                  placeholder="Ej: VIP, General"
                />
              </div>
              <div style={s.formField}>
                <label style={s.formLabel}>Zonas asignadas *</label>
                <div style={s.zoneSelector}>
                  {zones.length === 0 ? (
                    <p style={{color: '#6b7280', fontSize: '13px', margin: 0}}>No hay zonas. Crea una zona primero.</p>
                  ) : (
                    zones.map(zone => (
                      <label key={zone.id} style={s.checkLabel}>
                        <input
                          type="checkbox"
                          checked={ticketForm.zoneIds.includes(zone.id)}
                          onChange={() => toggleZoneSelection(zone.id)}
                          style={s.checkbox}
                        />
                        <span>{zone.name} <span style={{color: '#9ca3af', fontSize: '12px'}}>(Aforo: {zone.capacity})</span></span>
                      </label>
                    ))
                  )}
                </div>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                <div style={s.formField}>
                  <label style={s.formLabel}>Precio Base ({getCurrencySymbol()}) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={ticketForm.basePrice}
                    onChange={(e) => setTicketForm({ ...ticketForm, basePrice: Number(e.target.value) })}
                    style={s.formInput}
                    placeholder="0.00"
                  />
                </div>
                <div style={s.formField}>
                  <label style={s.formLabel}>Máx. por orden *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={ticketForm.maxPerOrder}
                    onChange={(e) => setTicketForm({ ...ticketForm, maxPerOrder: Number(e.target.value) })}
                    style={s.formInput}
                    placeholder="10"
                  />
                </div>
              </div>
              <div style={s.formField}>
                <label style={s.formLabel}>Cantidad Disponible *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={ticketForm.availableSeats}
                  onChange={(e) => setTicketForm({ ...ticketForm, availableSeats: Number(e.target.value) })}
                  style={s.formInput}
                  placeholder="0"
                />
              </div>
              <div style={s.formField}>
                <label style={s.formLabel}>Descripción</label>
                <textarea
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  rows="3"
                  style={{...s.formInput, resize: 'vertical', fontFamily: 'inherit'}}
                  placeholder="Información adicional..."
                />
              </div>
              <div style={s.modalFooter}>
                <button type="button" onClick={() => setShowTicketModal(false)} style={s.modalBtnSecondary}>Cancelar</button>
                <button type="submit" style={s.modalBtnPrimary}>{editingTicket ? 'Guardar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const s = {
  container: { minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '20px', fontFamily: 'Arial, sans-serif' },
  content: { maxWidth: '900px', margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' },
  stepBadge: { width: '40px', height: '40px', backgroundColor: '#10b981', color: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' },
  title: { fontSize: '24px', fontWeight: 'bold', color: '#111', margin: 0 },
  card: { backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  row: { marginBottom: '24px' },
  label: { display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' },
  select: { width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', backgroundColor: 'white', cursor: 'pointer' },
  section: { marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #e5e7eb' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  sectionTitle: { fontSize: '15px', fontWeight: '600', color: '#111' },
  addBtn: { padding: '8px 16px', backgroundColor: 'white', border: '1px solid #10b981', color: '#10b981', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s' },
  item: { backgroundColor: '#f9fafb', borderRadius: '8px', padding: '16px', marginBottom: '12px', border: '1px solid #e5e7eb' },
  itemHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  itemTitle: { fontSize: '13px', fontWeight: '600', color: '#6b7280' },
  deleteBtn: { backgroundColor: 'transparent', border: 'none', color: '#6b7280', fontSize: '24px', cursor: 'pointer', padding: '0 4px', lineHeight: 1 },
  itemContent: { display: 'flex', flexDirection: 'column', gap: '12px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  fieldRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  fieldLabel: { fontSize: '12px', color: '#6b7280', fontWeight: '500' },
  input: { padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '13px', backgroundColor: 'white', cursor: 'pointer' },
  footer: { display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' },
  btnSecondary: { padding: '12px 24px', backgroundColor: '#111', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
  btnPrimary: { padding: '12px 24px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000 },
  modal: { backgroundColor: 'white', borderRadius: '8px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #e5e7eb' },
  modalTitle: { fontSize: '18px', fontWeight: '600', color: '#111', margin: 0 },
  modalClose: { backgroundColor: 'transparent', border: 'none', fontSize: '28px', color: '#6b7280', cursor: 'pointer', padding: 0, lineHeight: 1 },
  modalBody: { padding: '20px' },
  formField: { marginBottom: '16px' },
  formLabel: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '6px' },
  formInput: { width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' },
  zoneSelector: { display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' },
  checkLabel: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' },
  checkbox: { width: '16px', height: '16px', cursor: 'pointer' },
  modalFooter: { display: 'flex', gap: '12px', marginTop: '20px' },
  modalBtnSecondary: { flex: 1, padding: '12px', backgroundColor: 'white', border: '1px solid #d1d5db', color: '#333', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
  modalBtnPrimary: { flex: 1, padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }
};

export default CreateTickets;