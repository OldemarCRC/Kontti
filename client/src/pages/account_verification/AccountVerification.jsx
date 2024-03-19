import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom"; // Asegúrate de importar Link
import axios from "axios";
import Header from "../../components/header/Header";
import "./account_verification.css";

const AccountVerification = () => {
  const [verificacionEstado, setVerificacionEstado] = useState("");
  const location = useLocation();

  useEffect(() => {
    const verifyToken = async () => {
      // Extraer el token de la URL
      const query = new URLSearchParams(location.search);
      const token = query.get("token");

      try {
        // Enviar solicitud de verificación al backend
        const response = await axios.get(
          `http://localhost:8800/api/auth/verify-email?token=${token}`
        );
        setVerificacionEstado(
          "Éxito: Tu correo ha sido verificado. Puedes cerrar esta ventana y continuar en la aplicación."
        );
      } catch (error) {
        setVerificacionEstado(
          "Error: No se pudo verificar tu correo. Por favor, intenta nuevamente o contacta al soporte."
        );
      }
    };

    verifyToken();
  }, [location]);

  return (
    <div>
      <div className="empty-div"></div>
      <div className="container">
        <h2 className="verification-heading">Verificación de Correo Electrónico</h2>
        <p className="verification-status">{verificacionEstado}</p>
        <Link to="/" className="return-home-link">
          Ir a Kontti
        </Link>
      </div>
    </div>
  );
};

export default AccountVerification;
