import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import { AuthContext } from "../../context/AuthContext";
import './home.css';
import Header from '../../components/header/Header';
import Footer from  '../../components/footer/Footer';
import ImportMovements from '../../pages/import/ImportMovements';
import ContainersInventory from '../../pages/containers_inventory/ContainersInventory';

function Home() {
  const { user } = useContext(AuthContext);
  const [activeComponent, setActiveComponent] = useState(null);
  const navigate = useNavigate(); // Utiliza useNavigate para la redirección

  // Verifica si el usuario ha iniciado sesión al montar el componente y cada vez que el valor de 'user' cambie
  useEffect(() => {
    if (!user) { // Si 'user' es null o undefined, redirige al inicio de sesión o a cualquier otra página
      navigate("/"); // Ajusta esta ruta según sea necesario
    }
  }, [user, navigate]); // Incluye 'navigate' en la lista de dependencias para evitar advertencias
  
    return (
      <div className="home">
        <Header/>
        <div style={{display: 'flex', justifyContent: 'center', gap: '20px'}}>
          {/* Imagen para ExcelToJson */}
          <img 
            src="https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" // Reemplaza con la ruta correcta de tu imagen
            alt="Excel a JSON"
            style={{cursor: 'pointer'}}
            onClick={() => setActiveComponent('ExcelToJson')}
          />
          {/* Imagen para InventoryTable */}
          <img 
            src="https://images.pexels.com/photos/163726/belgium-antwerp-shipping-container-163726.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" // Reemplaza con la ruta correcta de tu imagen
            alt="Tabla de Inventario"
            style={{cursor: 'pointer'}}
            onClick={() => setActiveComponent('InventoryTable')}
          />
        </div>
        {/* Renderiza el componente seleccionado */}
        {activeComponent === 'ExcelToJson' && <ImportMovements/>}
        {activeComponent === 'InventoryTable' && <ContainersInventory/>}
        <Footer/>
      </div>
    );
  }
  
  export default Home;