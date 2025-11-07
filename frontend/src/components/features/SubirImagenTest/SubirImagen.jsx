import React, { useState } from 'react';

//Importa tu función del S3Service
import { postSubirImagen } from '../../../globalServices/S3Service'; // (Ajusta esta ruta si es necesario)

// import axios from 'axios'; 

function ImageUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadedUrl(''); 
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Por favor, selecciona un archivo primero.');
      return;
    }

    setIsUploading(true);
    setError(null);

    // 1. Crear el FormData (esto no cambia)
    const formData = new FormData();
    // 'file' debe coincidir con @RequestParam("file") en Spring Boot
    formData.append('file', selectedFile); 

    try {
      // 👇 3. Llama a tu S3Service. ¡Mucho más limpio!
      const response = await postSubirImagen(formData);

      // 4. Recibir la respuesta (apiFetchForm ya la parsea como JSON)
      //    Asegúrate de que tu backend devuelva un JSON como: { "url": "http://..." }
      console.log('Archivo subido con éxito:', response.url);
      setUploadedUrl(response.url);

    } catch (err) {
      console.error('Error al subir el archivo:', err);
      // err.message ahora vendrá de tu apiFetchForm
      setError(err.message || 'Error al subir el archivo. Revisa la consola.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h2>Subir Imagen a S3</h2>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
        disabled={isUploading} 
      />
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? 'Subiendo...' : 'Subir Imagen'}
      </button>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {uploadedUrl && (
        <div style={{ marginTop: '20px' }}>
          <p>¡Imagen subida!</p>
          <img src={uploadedUrl} alt="Imagen subida" style={{ maxWidth: '400px' }} />
          <p>URL: <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">{uploadedUrl}</a></p>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;