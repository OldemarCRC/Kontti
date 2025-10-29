import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';  // Ajusta si tu App es .js
import './index.css';  // Globals CSS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
