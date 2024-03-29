import React, { useState, useEffect } from "react";
import { fetchInventory } from "../../services/fetchInventory";
import "./containers_inventory.css";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import { useNavigate } from "react-router-dom";

function InventoryTable() {
  const navigate = useNavigate(); // Aquí creamos la instancia de navigate
  const [inventoryData, setInventoryData] = useState([]);

  useEffect(() => {
    fetchInventory().then((data) => setInventoryData(data));
  }, []); // El array vacío asegura que esto solo se ejecute una vez al montar el componente

  return (
    <>
      <Header />
      <div className="container-excel-to-json">
       
        <div className="container-table">
          <table>
            <thead>
              <tr>
                {/* Ajustar encabezados segun los datos */}
                <th></th>
                <th>Customer</th>
                <th>Container Nr</th>
                <th>Size</th>
                <th>Type</th>
                <th>full/Empty</th>
                <th>dateAndTime</th>
                <th>origin</th>
                <th>POD</th>
                <th>Barco</th>
                <th>seal</th>
                <th>Daño reefer</th>
                <th>Daño estructura</th>
                <th>Comentarios de daños</th>
                <th>location</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {inventoryData.map((row, index) => (
                <tr key={index}>
                  {/* Asegúrate de ajustar las propiedades según los datos del inventario */}
                  <td>{index + 1}</td>
                  <td>{row.customer}</td>
                  <td>{row.containerNumber}</td>
                  <td>{row.containerSize}</td>
                  <td>{row.containerType}</td>
                  <td>{row.fullOrEmpty}</td>
                  <td>{row.dateAndTime}</td>
                  <td>{row.origin}</td>
                  <td>{row.portOfDestination}</td>
                  <td>{row.exportVessel}</td>
                  <td>{row.sealNumber_1}</td>
                  <td>{row.reeferDamage && "X"}</td>
                  <td>{row.boxDamage && "X"}</td>
                  <td>{row.damageComments}</td>
                  <td>{row.locationInTerminal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Botón para navegar a TerminalMap, modificado para pasar el estado a través de la navegación */}

        <button
          onClick={() =>
            navigate("/terminal-map" )
          }
        >
          Ver Mapa de la Terminal
        </button>
      </div>
      <Footer />
    </>
  );
}
export default InventoryTable;
