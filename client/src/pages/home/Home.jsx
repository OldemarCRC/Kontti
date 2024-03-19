import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import { AuthContext } from "../../context/AuthContext";
import "./home.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // Utiliza useNavigate para la redirección

  // Verifica si el usuario ha iniciado sesión al montar el componente y cada vez que el valor de 'user' cambie
  useEffect(() => {
    if (!user) {
      // Si 'user' es null o undefined, redirige al inicio de sesión o a cualquier otra página
      navigate("/"); // Ajusta esta ruta según sea necesario
    }
  }, [user, navigate]); // Incluye 'navigate' en la lista de dependencias para evitar advertencias


  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="home">
      <Header />
      <h2 className="home-header">Registro de movimientos e inventario de contenedores</h2>
      <div className="home-container">
        
        <div className="option-page" onClick={() => handleNavigate('/import')}>
          <h3>Movimientos de importación</h3>
          <img
            src="https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" // Reemplaza con la ruta correcta de tu imagen
            alt="import"
          />
        </div>
        <div className="option-page" onClick={() => handleNavigate('/in-movements')}>
          <h3>Otros ingresos</h3>
          <img
            src="https://images.pexels.com/photos/163726/belgium-antwerp-shipping-container-163726.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" // Reemplaza con la ruta correcta de tu imagen
            alt="otros ingresos"
          />
        </div>
        <div className="option-page" onClick={() => handleNavigate('/export')}>
          <h3>Movimientos de exportación</h3>
          <img
            src="https://images.pexels.com/photos/163726/belgium-antwerp-shipping-container-163726.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" // Reemplaza con la ruta correcta de tu imagen
            alt="otros ingresos"
          />
        </div>
        <div className="option-page" onClick={() => handleNavigate('/out-movements')}>
          <h3>Otras salidas</h3>
          <img
            src="https://images.pexels.com/photos/163726/belgium-antwerp-shipping-container-163726.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" // Reemplaza con la ruta correcta de tu imagen
            alt="otros ingresos"
          />
        </div>
        <div className="option-page" onClick={() => handleNavigate('/inventory')}>
          <h3>Inventario de contenedores</h3>
          <img
            src="https://images.pexels.com/photos/163726/belgium-antwerp-shipping-container-163726.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" // Reemplaza con la ruta correcta de tu imagen
            alt="otros ingresos"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
