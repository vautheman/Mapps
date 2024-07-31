import { StrictMode } from 'react';
import { createRoot } from "react-dom/client";
import App from './App.jsx'

import 'mapbox-gl/dist/mapbox-gl.css';
import './index.css'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker enregistré avec succès:', registration);
      })
      .catch((error) => {
        console.error('Échec de l’enregistrement du Service Worker:', error);
      });
  });
}

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);