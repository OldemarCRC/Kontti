import React, { useState, useEffect } from "react";
import { fetchInventory } from "../../services/fetchInventory";
import './containers_inventory.css';
import Footer from  '../../components/footer/Footer';
import Header from "../../components/header/Header";


function InventoryTable() {
  const [inventoryData, setInventoryData] = useState([]);

  useEffect(() => {
    fetchInventory().then((data) => setInventoryData(data));
  }, []); // El array vacío asegura que esto solo se ejecute una vez al montar el componente

  const handleInventory = async () => {
    try {
      const result = await fetchInventory(); // Llama a la función de carga con los datos JSON
      console.log(result);
      alert("¡Inventario recuperado con éxito!"); // Alerta genérica de éxito
    } catch (error) {
      // Maneja cualquier error que ocurra durante la carga de manera genérica
      alert("Hubo un error al cargar los datos."); // Mensaje de error genérico para el usuario
    }
  };

  return (
    <>
    <Header />
<div className="container-excel-to-json">
      <div className="table-buttons">
        <button onClick={handleInventory}>
          Cargar inventario de contenedores
        </button>
      </div>
      <div className="container-table">
        <table>
          <thead>
            <tr>
              {/* Ajustar encabezados segun los datos */}
              <th></th>
              <th>Customer</th>
              <th>Container Nr</th>
              <th>Truck ID</th>
              <th>Truck Co</th>
              <th>In/Out</th>
              <th>Size</th>
              <th>Type</th>
              <th>full/Empty</th>
              <th>dateAndTime</th>
              <th>origin/destination</th>
              <th>seal</th>
              <th>location</th>
              <th>actualDigit</th>
              <th>expectedDigit</th>
              <th>matches</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {inventoryData.map((row, index) => (
              <tr key={index}>
                {/* Asegúrate de ajustar las propiedades según los datos del inventario */}
                <td>{index+1}</td>
                <td>{row.customer}</td>
                <td>{row.containerNumber}</td>
                <td>{row.truckID}</td>
                <td>{row.truckCo}</td>
                <td>{row.gateInOrGateOut}</td>
                <td>{row.containerSize}</td>
                <td>{row.containerType}</td>
                <td>{row.fullOrEmpty}</td>
                <td>{row.lastIn}</td>
                <td>{row.originOrDestination}</td>
                <td>{row.sealNumber}</td>
                <td>{`${row.locationInTerminal?.zone}${row.locationInTerminal?.stack}${row.locationInTerminal?.column}${row.locationInTerminal?.height}`}</td>
                <td>{row.digitVerification?.actualDigit}</td>
                <td>{row.digitVerification?.expectedDigit}</td>
                <td
                  style={{
                    color: row.digitVerification?.matches ? "inherit" : "red",
                  }}
                >
                  {row.digitVerification?.matches ? "True" : "False"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {console.log(JSON.stringify(inventoryData))}
      </div>
    </div>
    <Footer />
    </>
    
  );
}
export default InventoryTable;
