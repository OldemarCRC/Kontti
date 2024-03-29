import React, { useState, useEffect } from "react";

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

  const [selectedStack, setSelectedStack] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);

  const handleStackClick = (stackId) => {
    setSelectedStack(stackId);
  };

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
  const heights = [6, 5, 4, 3, 2, 1];

  // Agregamos una función para encontrar contenedores por ubicación
  const findContainerByLocation = (location) => {
    return inventoryData.find(
      (container) => container.locationInTerminal === location
    );
  };

  return (
    <>
      <Header />
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
            {/* Aquí se muestra la información del stack seleccionado */}

            <div className="stack-view">
              {(selectedStack.startsWith("C") ? columnsC : columnsAtoB).map(
                (column) => (
                  <div className="column" key={column}>
                    {heights.map((height) => {
                      const location = `${selectedStack}${column}${height}`;
                      const container = findContainerByLocation(location);
                      return (
                        <div
                          className={`${container ? "height" : "empty-slot"}`}
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
                )
              )}
            </div>
            <div className="stack-title">Stack {selectedStack}</div>
          </div>
        )}
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

      <Footer />
    </>
  );
}

export default TerminalMap;

{
  /*

    # Este es un ejemplo simplificado de cómo puedes estructurar el código para cumplir con tu requisito.
# Vamos a simular el proceso de encontrar contenedores basado en una ubicación y mostrar los datos requeridos.

# Simulación de datos de inventario
inventory_data = [
    {"containerNumber": "ABC123", "locationInTerminal": "A1A6", "portOfDestination": "Port A", "exportVessel": "Vessel A"},
    {"containerNumber": "DEF456", "locationInTerminal": "A1B5", "portOfDestination": "Port B", "exportVessel": "Vessel B"},
    # Más contenedores...
]

# Simulación de la ubicación seleccionada
selected_stack = "A1"
columns = ["A", "B", "C", "D", "E"]  # Asumiendo 5 columnas por simplicidad
heights = [6, 5, 4, 3, 2, 1]  # Asumiendo 6 alturas por simplicidad

# Generar la vista detallada del stack seleccionado
stack_view = []
for column in columns:
    column_view = []
    for height in heights:
        location = f"{selected_stack}{column}{height}"
        # Buscar si algún contenedor coincide con esta ubicación
        matching_container = next((item for item in inventoryData if item["locationInTerminal"] == location), None)
        if matching_container:
            # Contenedor encontrado, mostrar los datos requeridos
            container_info = f"{matching_container['containerNumber']}, {matching_container['portOfDestination']}, {matching_container['exportVessel']}"
        else:
            # No se encontró contenedor, mostrar "Empty"
            container_info = "Empty"
        column_view.append(container_info)
    stack_view.append(column_view)

# Imprimir el resultado
stack_view


const matching_container = 

*/
}
