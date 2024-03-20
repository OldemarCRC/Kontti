import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import { AuthContext } from "../../context/AuthContext";
import "./home.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import import_img from "./images/import.png";
import in_movements_img from "./images/in_movements.png";
import export_img from "./images/export.png";
import out_movements_img from "./images/out_movements.jpg";
import inventory_img from "./images/inventory.png";


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
    <>
      <Header />
      <div className="home">
      <h2 className="home-header">Registro de movimientos e inventario de contenedores</h2>
      <div className="home-container">
        
        <div className="option-page" onClick={() => handleNavigate('/import')}>
          <h3 className="option-text">Movimientos de importación</h3>
          <img
            src={import_img} // Reemplaza con la ruta correcta de tu imagen
            alt="import"
          />
        </div>
        <div className="option-page" onClick={() => handleNavigate('/in-movements')}>
          <h3 className="option-text">Otros ingresos</h3>
          <img
            src={in_movements_img} // Reemplaza con la ruta correcta de tu imagen
            alt="otros ingresos"
          />
        </div>
        <div className="option-page" onClick={() => handleNavigate('/export')}>
          <h3 className="option-text">Movimientos de exportación</h3>
          <img
            src={export_img} // Reemplaza con la ruta correcta de tu imagen
            alt="otros ingresos"
          />
        </div>
        <div className="option-page" onClick={() => handleNavigate('/out-movements')}>
          <h3 className="option-text">Otras salidas</h3>
          <img
            src={out_movements_img} // Reemplaza con la ruta correcta de tu imagen
            alt="otros ingresos"
          />
        </div>
        <div className="option-page" onClick={() => handleNavigate('/inventory')}>
          <h3 className="option-text">Inventario de contenedores</h3>
          <img
            src={inventory_img} // Reemplaza con la ruta correcta de tu imagen
            alt="otros ingresos"
          />
        </div>
      </div>
      </div>
      
      <Footer />
    </>
  );
}

export default Home;
