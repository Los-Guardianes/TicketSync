import React, { useState } from 'react';

export const CreateTicket2 = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    category: '',
    restrictions: '',
    description: ''
  });
  
  const [functions, setFunctions] = useState([
    { id: 1, start: '', end: '' }
  ]);
  
  const [imagePreview, setImagePreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const categories = [
    { value: '', label: 'Selecciona una categoría' },
    { value: 'musica', label: '🎵 Música' },
    { value: 'deporte', label: '⚽ Deportes' },
    { value: 'arte', label: '🎨 Arte y Cultura' },
    { value: 'tecnologia', label: '💻 Tecnología' },
    { value: 'gastronomia', label: '🍽️ Gastronomía' },
    { value: 'educacion', label: '📚 Educación' },
    { value: 'negocios', label: '💼 Negocios' },
    { value: 'otro', label: '🎯 Otro' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFunctionChange = (id, field, value) => {
    setFunctions(prev => 
      prev.map(func => 
        func.id === id ? { ...func, [field]: value } : func
      )
    );
  };

  const addFunction = () => {
    const newId = Math.max(...functions.map(f => f.id)) + 1;
    setFunctions(prev => [...prev, { id: newId, start: '', end: '' }]);
  };

  const removeFunction = (id) => {
    if (functions.length > 1) {
      setFunctions(prev => prev.filter(func => func.id !== id));
    }
  };

  const handleImageUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  const handleCancel = () => {
    if (window.confirm('¿Estás seguro de que deseas cancelar? Se perderán todos los cambios.')) {
      setFormData({
        eventName: '',
        category: '',
        restrictions: '',
        description: ''
      });
      setFunctions([{ id: 1, start: '', end: '' }]);
      setImagePreview(null);
    }
  };

  const handleSubmit = () => {
    const eventData = {
      ...formData,
      functions: functions,
      image: imagePreview
    };

    console.log('Datos del formulario:', eventData);
    alert('¡Evento creado exitosamente! 🎉\n\nRevisa la consola para ver los datos.');
  };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", background: '#fafbfc', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ background: 'white', borderRadius: '2px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.08)', maxWidth: '900px', width: '100%', margin: '0 auto', overflow: 'hidden', border: '1px solid #e8ebed' }}>
        
        {/* Header */}
        <div style={{ background: 'white', color: '#1a202c', padding: '32px 48px', borderBottom: '1px solid #e8ebed' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px', color: '#1a202c', letterSpacing: '-0.5px' }}>Crear Nuevo Evento</h1>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', marginTop: '32px', gap: '12px' }}>
            <div style={{ position: 'absolute', top: '24px', left: '60px', right: '60px', height: '1px', background: '#e8ebed', zIndex: 1 }}>
              <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: '#2d8a5b', transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)', width: '0%' }}></div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2, flex: 1 }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#2d8a5b', color: 'white', border: '2px solid #2d8a5b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '15px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(45, 138, 91, 0.2)' }}>1</div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#2d8a5b', textAlign: 'center' }}>Detalles del evento</div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2, flex: 1 }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'white', border: '2px solid #e8ebed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '15px', color: '#a0aec0', marginBottom: '12px' }}>2</div>
              <div style={{ fontSize: '13px', fontWeight: '500', color: '#718096', textAlign: 'center' }}>Ubicación</div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2, flex: 1 }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'white', border: '2px solid #e8ebed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '15px', color: '#a0aec0', marginBottom: '12px' }}>3</div>
              <div style={{ fontSize: '13px', fontWeight: '500', color: '#718096', textAlign: 'center' }}>Entradas</div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2, flex: 1 }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'white', border: '2px solid #e8ebed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '15px', color: '#a0aec0', marginBottom: '12px' }}>4</div>
              <div style={{ fontSize: '13px', fontWeight: '500', color: '#718096', textAlign: 'center' }}>Confirmación</div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div style={{ padding: '48px' }}>
          
          {/* Información Básica */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#718096', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Información Básica</div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#2d3748', marginBottom: '8px' }}>
                Nombre del evento <span style={{ color: '#c53030' }}>*</span>
              </label>
              <input 
                type="text" 
                name="eventName"
                value={formData.eventName}
                onChange={handleInputChange}
                placeholder="Ej: Concierto de Rock 2024"
                style={{ width: '100%', padding: '11px 14px', border: '1px solid #cbd5e0', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', color: '#2d3748', background: 'white' }}
              />
              <div style={{ fontSize: '13px', color: '#718096', marginTop: '6px' }}>Ingresa un nombre descriptivo para tu evento</div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#2d3748', marginBottom: '8px' }}>
                Categoría <span style={{ color: '#c53030' }}>*</span>
              </label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '11px 14px', border: '1px solid #cbd5e0', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', color: '#2d3748', background: 'white' }}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Funciones */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#718096', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Fechas y Horarios</div>
            
            <div style={{ background: '#fafbfc', border: '1px solid #e8ebed', borderRadius: '4px', padding: '24px', marginTop: '16px' }}>
              {functions.map((func, index) => (
                <div key={func.id} style={{ background: 'white', border: '1px solid #e8ebed', borderRadius: '4px', padding: '20px', marginBottom: index < functions.length - 1 ? '16px' : '0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ background: '#2d8a5b', color: 'white', width: '32px', height: '32px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600' }}>
                      {index + 1}
                    </div>
                    {functions.length > 1 && (
                      <button 
                        onClick={() => removeFunction(func.id)}
                        style={{ background: 'transparent', color: '#c53030', border: '1px solid #e8ebed', padding: '6px 14px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#2d3748', marginBottom: '8px' }}>
                        Fecha y hora de inicio <span style={{ color: '#c53030' }}>*</span>
                      </label>
                      <input 
                        type="datetime-local" 
                        value={func.start}
                        onChange={(e) => handleFunctionChange(func.id, 'start', e.target.value)}
                        style={{ width: '100%', padding: '11px 14px', border: '1px solid #cbd5e0', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', color: '#2d3748', background: 'white' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#2d3748', marginBottom: '8px' }}>
                        Fecha y hora de fin <span style={{ color: '#c53030' }}>*</span>
                      </label>
                      <input 
                        type="datetime-local" 
                        value={func.end}
                        onChange={(e) => handleFunctionChange(func.id, 'end', e.target.value)}
                        style={{ width: '100%', padding: '11px 14px', border: '1px solid #cbd5e0', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', color: '#2d3748', background: 'white' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={addFunction}
              style={{ background: 'white', color: '#2d8a5b', border: '1px dashed #cbd5e0', padding: '11px 20px', borderRadius: '4px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', width: '100%', marginTop: '16px' }}
            >
              + Agregar otra función
            </button>
            <div style={{ fontSize: '13px', color: '#718096', marginTop: '8px' }}>
              Si tu evento tiene múltiples fechas, puedes agregar más funciones
            </div>
          </div>

          {/* Imagen */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#718096', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Imagen del Evento</div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#2d3748', marginBottom: '8px' }}>
              Imagen principal (836px × 522px recomendado)
            </label>
            
            {!imagePreview ? (
              <div 
                onClick={() => document.getElementById('imageInput').click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                style={{ 
                  border: dragOver ? '2px solid #2d8a5b' : '2px dashed #cbd5e0', 
                  borderRadius: '4px', 
                  padding: '48px 32px', 
                  textAlign: 'center', 
                  cursor: 'pointer', 
                  background: dragOver ? '#f0fdf4' : '#fafbfc' 
                }}
              >
                <div style={{ fontSize: '40px', color: '#cbd5e0', marginBottom: '16px' }}>🖼️</div>
                <div style={{ color: '#2d3748', fontWeight: '500', marginBottom: '4px', fontSize: '14px' }}>Haz clic o arrastra una imagen aquí</div>
                <div style={{ color: '#718096', fontSize: '13px' }}>PNG, JPG o GIF (máx. 5MB)</div>
              </div>
            ) : (
              <div style={{ position: 'relative', marginTop: '16px' }}>
                <img src={imagePreview} alt="Vista previa" style={{ width: '100%', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }} />
                
                <button 
                  onClick={removeImage}
                  style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0, 0, 0, 0.7)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}
                >
                  Eliminar imagen
                </button>
              </div>
            )}
            
            <input 
              type="file" 
              id="imageInput" 
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files.length > 0) {
                  handleImageUpload(e.target.files[0]);
                }
              }}
            />
          </div>

          {/* Restricciones */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#718096', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Restricciones</div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#2d3748', marginBottom: '8px' }}>
              Restricciones de acceso
            </label>
            <input 
              type="text" 
              name="restrictions"
              value={formData.restrictions}
              onChange={handleInputChange}
              placeholder="Ej: Mayores de 18 años, Entrada con invitación"
              style={{ width: '100%', padding: '11px 14px', border: '1px solid #cbd5e0', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', color: '#2d3748', background: 'white' }}
            />
            <div style={{ fontSize: '13px', color: '#718096', marginTop: '6px' }}>
              Especifica si hay alguna restricción de edad, acceso o requisitos especiales
            </div>
          </div>

          {/* Descripción */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#718096', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Descripción</div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#2d3748', marginBottom: '8px' }}>
              Descripción del evento <span style={{ color: '#c53030' }}>*</span>
            </label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Escribe una descripción atractiva de tu evento. Incluye detalles importantes como el lugar, actividades, panelistas, links relacionados, etc."
              style={{ width: '100%', padding: '11px 14px', border: '1px solid #cbd5e0', borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', color: '#2d3748', background: 'white', resize: 'vertical', minHeight: '100px' }}
            />
            <div style={{ fontSize: '13px', color: '#718096', marginTop: '6px' }}>
              Brinda información completa sobre tu evento para atraer más asistentes
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'space-between', padding: '30px 40px', background: '#f7fafc', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              disabled
              style={{ padding: '14px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'not-allowed', background: 'white', color: '#4a5568', border: '2px solid #e2e8f0', opacity: '0.5' }}
            >
              ← Anterior
            </button>
            <button 
              onClick={handleCancel}
              style={{ padding: '14px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', background: 'white', color: '#4a5568', border: '2px solid #e2e8f0' }}
            >
              Cancelar
            </button>
          </div>
          <button 
            onClick={handleSubmit}
            style={{ padding: '14px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', background: '#2d8a5b', color: 'white', border: 'none', boxShadow: '0 4px 12px rgba(45, 138, 91, 0.3)' }}
          >
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  );
};