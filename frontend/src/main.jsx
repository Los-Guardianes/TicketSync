import React from 'react';
import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'; //Importar el autenticador
import App from './App.jsx'
import './index.css'
import { NotificationProvider } from './context/NotificationContext.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/*"Envuelve" la app */}
        <NotificationProvider>
          <App />
        </NotificationProvider>        
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
