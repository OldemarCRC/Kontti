import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import LocationInTerminal from "../location_in_terminal/LocationInTerminal.jsx";
import { fetchInventory } from "../../services/fetchInventory";
import "./terminal_map.css";
import Footer from "../../components/footer/Footer.js";
import Header from "../../components/header/Header.js";

const zones = [
  { id: "A", stacks: [7, 6, 5, 4, 3, 2, 1] },
  { id: "B", stacks: [7, 6, 5, 4, 3, 2, 1] },
  { id: "C", stacks: [8, 7, 6, 5, 4, 3, 2, 1] },
  // Más zonas si es necesario...
];

function TerminalMap() {
  const [inventoryData, setInventoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Para controlar el estado de carga
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // Utiliza useNavigate para la redirección
  // Función para cargar o actualizar el inventario
  const loadInventory = async () => {
    setIsLoading(true); // Indica que se está cargando el inventario
    try {
      const fetchedInventory = await fetchInventory(); // Suponiendo que fetchInventory es tu función que obtiene los datos
      setInventoryData(fetchedInventory); // Actualiza el estado con los nuevos datos
      setIsLoading(false); // Finaliza el estado de carga
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setIsLoading(false); // Asegúrate de finalizar el estado de carga incluso si hay un error
    }
  };

  useEffect(() => {
    loadInventory(); // Carga inicial del inventario
  }, []);

  // Verifica si el usuario ha iniciado sesión y redirige según el rol del usuario
  useEffect(() => {
    if (!user) {
      // Si 'user' es null o undefined, redirige al inicio de sesión
      navigate("/");
    } 
  }, [user, navigate]); // Incluye 'navigate' en la lista de dependencias para evitar advertencias


  const [selectedStack, setSelectedStack] = useState("INITIAL_VIEW");

  // Calcula la cantidad de contenedores para cada stack
  const countContainersInStack = (zoneId, stackNumber) => {
    return inventoryData.filter(
      (container) =>
        container.locationInTerminal &&
        container.locationInTerminal.startsWith(`${zoneId}${stackNumber}`)
    ).length;
  };

  // Filtramos los contenedores sin posición definida o sin el campo `locationInTerminal`
  const containersWithoutPosition = inventoryData.filter(
    (container) =>
      !container.locationInTerminal ||
      container.locationInTerminal.trim() === ""
  );

  const columnsAtoB = ["A", "B", "C", "D", "E"];
  const columnsC = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const heights = [/* 6, 5, */ 4, 3, 2, 1];

  // Agregamos una función para encontrar contenedores por ubicación
  const findContainerByLocation = (location) => {
    return inventoryData.find(
      (container) => container.locationInTerminal === location
    );
  };

  // Generar una vista de stack vacía para la renderización inicial
  const renderInitialStackView = () => (
    <div className="stack-view">
      {columnsAtoB.map((column) => (
        <div className="column" key={column}>
          {heights.map((height) => (
            <div className="empty-slot" key={`${column}${height}`}>
              Empty
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Header />
      <div className="terminal-map">
        <div className="terminal-container">
          <div className="zones-container">
            {zones.map((zone) => (
              <div
                key={zone.id}
                className={`zone zone-${zone.id.toLowerCase()}`}
              >
                {zone.stacks.map((stack) => {
                  // Cuenta los contenedores para el stack actual
                  const containerCount = countContainersInStack(zone.id, stack);
                  return (
                    <div
                      key={`${zone.id}${stack}`}
                      className="stack"
                      onClick={() => setSelectedStack(`${zone.id}${stack}`)}
                    >
                      {`${zone.id}${stack} (${containerCount} cont)`}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          {selectedStack && (
            <div className="stack-details">
              {selectedStack === "INITIAL_VIEW"
                ? renderInitialStackView()
                : selectedStack && (
                    <div className="stack-view">
                      {(selectedStack.startsWith("C")
                        ? columnsC
                        : columnsAtoB
                      ).map((column) => (
                        <div className="column" key={column}>
                          {heights.map((height) => {
                            const location = `${selectedStack}${column}${height}`;
                            const container = findContainerByLocation(location);
                            return (
                              <div
                                className={`${
                                  container ? "height" : "empty-slot"
                                }`}
                                key={`${column}${height}`}
                              >
                                {container ? (
                                  <>
                                    {container.containerNumber} -{" "}
                                    {container.portOfDestination} -{" "}
                                    {container.exportVessel}
                                  </>
                                ) : (
                                  "Empty"
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  )}
              <div className="stack-title">Stack {selectedStack}</div>
            </div>
          )}
          <div className="location-in-terminal">
            <LocationInTerminal />
          </div>
          <div className="containers-without-position">
            {containersWithoutPosition.length > 0 ? (
              <>
                <button onClick={loadInventory} disabled={isLoading}>
                  {isLoading ? "Actualizando..." : "Actualizar des-ubicados"}
                </button>
                <h4>Lista de contenedores sin ubicación en sistema</h4>
                <ol>
                  {containersWithoutPosition.map((container) => (
                    <li key={container.containerNumber}>
                      {container.containerNumber}
                    </li>
                  ))}
                </ol>
              </>
            ) : (
              <>
                <button onClick={loadInventory} disabled={isLoading}>
                  {isLoading ? "Actualizando..." : "Actualizar des-ubicados"}
                </button>
                <p>Todos los contenedores tienen posición en sistema.</p>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default TerminalMap;
