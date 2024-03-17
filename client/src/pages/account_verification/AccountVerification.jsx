import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const AccountVerification = () => {
  const [verificacionEstado, setVerificacionEstado] = useState('');
  const location = useLocation();
  
  useEffect(() => {
    const verifyToken = async () => {
      // Extraer el token de la URL
      const query = new URLSearchParams(location.search);
      const token = query.get('token');

      try {
        // Enviar solicitud de verificación al backend
        const response = await axios.get(`http://localhost:8800/api/auth/verify-email?token=${token}`);
        setVerificacionEstado('Éxito: Tu correo ha sido verificado.');
      } catch (error) {
        setVerificacionEstado('Error: No se pudo verificar tu correo.');
      }
    };

    verifyToken();
  }, [location]);

  return (
    <div>
      <h2>Verificación de Correo Electrónico</h2>
      <p>{verificacionEstado}</p>
    </div>
  );
};

export default AccountVerification;
