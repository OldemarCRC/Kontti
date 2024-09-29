import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { fetchInventory } from "../../services/fetchInventory";
import { fetchMovements } from "../../services/fetchMovements";
import {
  fetchReleaseOrders,
  fetchReleaseOrdersByCustomer,
} from "../../services/releaseOrdersService";
import { toast } from "react-toastify";
import Footer from "../../components/footer/Footer.js";
import Header from "../../components/header/Header.js";
import { format } from "date-fns"; // Importa date-fns
import "./query_page.css";

const QueryPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [movements, setMovements] = useState([]);
  const [filteredMovements, setFilteredMovements] = useState([]);
  const [releaseOrders, setReleaseOrders] = useState([]);
  const [filteredReleaseOrders, setFilteredReleaseOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  /* const [customerName, setCustomerName] = useState("");
  const [filterDate, setFilterDate] = useState(""); */
  const [activeSection, setActiveSection] = useState(null);
  /* const [selectedLine, setSelectedLine] = useState(null);*/

  const headerMappings = {
    customerName: "Nombre del Cliente",
    dateAndTime: "Fecha de ingreso",
    customsNumber: "Número de Aduana",
    BLNumber: "Número BL",
    ticaSequence: "Secuencia TICA",
    initialQuantity: "Cantidad",
    packageType: "Tipo de Paquete",
    commodity: "Mercancía",
    releaseOrders: "Órdenes de salida",
    availableQuantity: "Bultos disponibles",
    daysInWarehouse: "Días en inventario",
    gateInOrGateOut: "Entrada o Salida",
    containerNumber: "Número de Contenedor",
    sealNumber_1: "Marchamo",
    truckCo: "Transportista",
    truckId: "Placa",
    truckDriver: "Chofer",
    orderNumber: "Número de Orden",
    creationDateTime: "Fecha creación",
    status: "Estado",
    storageLocations: "Ubicaciones",
    BLLines: "Líneas del BL",
    DUANumber: "Número de DUA"
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      const loadData = async () => {
        try {
          const inventoryData = await fetchInventory();
          const currentDate = new Date();

          // Calcular días transcurridos
          const updatedInventoryData = inventoryData.map((item) => {
            const entryDate = new Date(item.dateAndTime);
            const daysInWarehouse = Math.floor(
              (currentDate - entryDate) / (1000 * 60 * 60 * 24)
            );
            return { ...item, daysInWarehouse };
          });

          setInventory(updatedInventoryData);
          setFilteredInventory(updatedInventoryData);

          const releaseOrdersData = await fetchReleaseOrders();
          setReleaseOrders(releaseOrdersData);
          setFilteredReleaseOrders(releaseOrdersData);

          const movementsData = await fetchMovements();
          setMovements(movementsData);
          setFilteredMovements(movementsData);

          // Extraer clientes únicos del inventario
          const uniqueCustomers = [
            ...new Set(inventoryData.map((item) => item.customerName)),
          ];
          setCustomers(uniqueCustomers);
        } catch (error) {
          toast.error(error.message);
        }
      };
      loadData();
    }
  }, [user, navigate]);

  const handleFilter = (filterType, value) => {
    if (activeSection === "inventory") {
      const filtered = inventory.filter((item) =>
        item[filterType].toString().toLowerCase().includes(value.toLowerCase())
      );
      setFilteredInventory(filtered);
    } else if (activeSection === "movements") {
      const filtered = movements.filter((item) =>
        item[filterType].toString().toLowerCase().includes(value.toLowerCase())
      );
      setFilteredMovements(filtered);
    } else if (activeSection === "releaseOrders") {
      const filtered = releaseOrders.filter((order) =>
        order[filterType].toString().toLowerCase().includes(value.toLowerCase())
      );
      setFilteredReleaseOrders(filtered);
    }
  };

  const renderFilterHeader = (headers) => {
    return (
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>
              <select onChange={(e) => handleFilter(header, e.target.value)}>
                <option value="">{headerMappings[header]}</option>
                {activeSection === "inventory" &&
                  [...new Set(inventory.map((item) => item[header]))].map(
                    (value, index) => (
                      <option key={index} value={value}>
                        {value}
                      </option>
                    )
                  )}
                {activeSection === "movements" &&
                  [...new Set(movements.map((item) => item[header]))].map(
                    (value, index) => (
                      <option key={index} value={value}>
                        {value}
                      </option>
                    )
                  )}
                {activeSection === "releaseOrders" &&
                  [...new Set(releaseOrders.map((order) => order[header]))].map(
                    (value, index) => (
                      <option key={index} value={value}>
                        {value}
                      </option>
                    )
                  )}
              </select>
            </th>
          ))}
        </tr>
      </thead>
    );
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return format(date, "dd/MM/yyyy HH:mm");
  };

  return (
    <>
      <Header />
      <div className="query-page">
        <h1>Consultas</h1>

        <div className="query-options-container">
          <div className="query-option-inv"
            title="Inventario"
            onClick={() => setActiveSection("inventory")}
          ><p>Inventario</p></div>
          <div className="query-option-mov"
            title="Movimientos"
            onClick={() => setActiveSection("movements")}
          ><p>Movimientos</p></div>
          <div className="query-option-ro"
            title="Órdenes de salida"
            onClick={() => setActiveSection("releaseOrders")}
          ><p>Órdenes de salida</p></div>
        </div>

        {activeSection === "inventory" && (
          <div className="query-section">
            <h2>Inventario Actual</h2>
            <table>
              <thead>
                <tr>
                  <th>{headerMappings.customerName}</th>
                  <th>{headerMappings.dateAndTime}</th>
                  <th>{headerMappings.customsNumber}</th>
                  <th>{headerMappings.BLNumber}</th>
                  <th>{headerMappings.ticaSequence}</th>
                  <th>{headerMappings.daysInWarehouse}</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <React.Fragment key={item._id}>
                    {/* Fila principal del documento */}
                    <tr>
                      <td>{item.customerName}</td>
                      <td>{formatDateTime(item.dateAndTime)}</td>
                      <td>{item.customsNumber}</td>
                      <td>{item.BLNumber}</td>
                      <td>{item.ticaSequence}</td>
                      <td>{item.daysInWarehouse}</td>
                    </tr>
                    {/* Fila de detalle de líneas del BL */}
                    <tr>
                      <td colSpan="6">
                        <table className="bl-lines-table">
                          <thead>
                            <tr>
                              <th>{headerMappings.lineNumber}</th>
                              <th>{headerMappings.commodity}</th>
                              <th>{headerMappings.initialQuantity}</th>
                              <th>{headerMappings.packageType}</th>
                              <th>{headerMappings.storageLocations}</th>
                              <th>{headerMappings.releaseOrders}</th>
                              <th>{headerMappings.availableQuantity}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.BLLines.map((line, index) => (
                              <tr key={index}>
                                <td>{line.lineNumber}</td>
                                <td>{line.commodity}</td>
                                <td>{line.initialQuantity}</td>
                                <td>{line.packageType}</td>
                                <td>{line.storageLocations.join(", ")}</td>
                                <td>{line.releaseOrders.join(", ")}</td>
                                <td>{line.availableQuantity || ""}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === "movements" && (
          <div className="query-section">
            <h2>Movimientos</h2>
            <table>
              {renderFilterHeader([
                "dateAndTime",
                "gateInOrGateOut",
                "customerName",
                "customsNumber",
                "ticaSequence",
                "BLNumber",
                "BLLines",
                "commodity",
                "quantity",
                "packageType",
                "containerNumber",
                "sealNumber_1",
                "truckCo",
                "truckId",
                "truckDriver",
                "orderNumber",
                "DUANumber",
              ])}
              <tbody>
                {filteredMovements.map((item) => (
                  <tr key={item._id}>
                    <td>{formatDateTime(item.dateAndTime)}</td>
                    <td>{item.gateInOrGateOut}</td>
                    <td>{item.customerName}</td>
                    <td>{item.customsNumber}</td>
                    <td>{item.ticaSequence}</td>
                    <td>{item.BLNumber}</td>
                    <td>{item.BLLineNumber}</td>
                    <td>{item.commodity}</td>
                    <td>{item.quantity}</td>
                    <td>{item.packageType}</td>
                    <td>{item.containerNumber}</td>
                    <td>{item.sealNumber_1}</td>
                    <td>{item.truckCo}</td>
                    <td>{item.truckId}</td>
                    <td>{item.truckDriver}</td>
                    <td>{item.orderNumber}</td>
                    <td>{item.DUANumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === "releaseOrders" && (
          <div className="query-section">
            <h2>Órdenes de Salida</h2>
            <table>
              {renderFilterHeader([
                "customerName",
                "orderNumber",
                "customsNumber",
                "ticaSequence",
                "quantity",
                "packageType",
                "commodity",
                "truckCo",
                "truckId",
                "truckDriver",
                "containerNumber",
                "creationDateTime",
                "DUANumber",
                "status",
              ])}
              <tbody>
                {filteredReleaseOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.customerName}</td>
                    <td>{order.orderNumber}</td>
                    <td>{order.customsNumber}</td>
                    <td>{order.ticaSequence}</td>
                    <td>{order.quantity}</td>
                    <td>{order.packageType}</td>
                    <td>{order.commodity}</td>
                    <td>{order.truckCo}</td>
                    <td>{order.truckId}</td>
                    <td>{order.truckDriver}</td>
                    <td>{order.containerNumber}</td>
                    <td>{formatDateTime(order.creationDateTime)}</td>
                    <td>{order.DUANumber}</td>
                    <td>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

const OptionCard = ({ title, onClick }) => (
  <div className="option-page" onClick={onClick}>
    <h3 className="option-text">{title}</h3>
  </div>
);

export default QueryPage;
