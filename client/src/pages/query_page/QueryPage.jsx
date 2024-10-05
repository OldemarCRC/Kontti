import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { fetchInventory } from "../../services/fetchInventory";
import { fetchMovements } from "../../services/fetchMovements";
import {
  fetchDispatchOrders,
  fetchDispatchOrdersByCustomer,
} from "../../services/dispatchOrdersService";
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
  const [dispatchOrders, setDispatchOrders] = useState([]);
  const [filteredDispatchOrders, setFilteredDispatchOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  /* const [customerName, setCustomerName] = useState("");
  const [filterDate, setFilterDate] = useState(""); */
  const [activeSection, setActiveSection] = useState(null);
  /* const [selectedLine, setSelectedLine] = useState(null);*/

  const headerMappings = {
    customerName: "Cliente",
    dateAndTime: "Ingreso",
    customsNumber: "Manifiesto",
    commodity: "Mercancía",
    dispatchOrders: "Órdenes de salida",
    daysInTerminal: "Días en inventario",
    movement: "In/Out",
    containerNumber: "Contenedor",
    containerSize: "Tam",
    containerType: "Tipo",
    weight: "Peso",
    sealNumber_1: "Marchamo",
    truckCo: "Transportista",
    truckId: "Placa",
    truckDriver: "Chofer",
    orderNumber: "Despacho Nr",
    creationDateTime: "Fecha creación",
    status: "Estado",
    locationInTerminal: "Ubicaciones",
    portOfOrigin: "Puerto de Origen",
    portOfDestination: "POD",
    temperature: "Temp",
    ventilation: "Vent",
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
            const daysInTerminal = Math.floor(
              (currentDate - entryDate) / (1000 * 60 * 60 * 24)
            );
            return { ...item, daysInTerminal };
          });

          setInventory(updatedInventoryData);
          setFilteredInventory(updatedInventoryData);

          const dispatchOrdersData = await fetchDispatchOrders();
          setDispatchOrders(dispatchOrdersData);
          setFilteredDispatchOrders(dispatchOrdersData);

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
    } else if (activeSection === "dispatchOrders") {
      const filtered = dispatchOrders.filter((order) =>
        order[filterType].toString().toLowerCase().includes(value.toLowerCase())
      );
      setFilteredDispatchOrders(filtered);
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
                {activeSection === "dispatchOrders" &&
                  [
                    ...new Set(dispatchOrders.map((order) => order[header])),
                  ].map((value, index) => (
                    <option key={index} value={value}>
                      {value}
                    </option>
                  ))}
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
          <div
            className="query-option-inv"
            title="Inventario"
            onClick={() => setActiveSection("inventory")}
          >
            <p>Inventario</p>
          </div>
          <div
            className="query-option-mov"
            title="Movimientos"
            onClick={() => setActiveSection("movements")}
          >
            <p>Movimientos</p>
          </div>
          <div
            className="query-option-ro"
            title="Órdenes de salida"
            onClick={() => setActiveSection("dispatchOrders")}
          >
            <p>Despachos</p>
          </div>
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
                  <th>{headerMappings.portOfOrigin}</th>
                  <th>{headerMappings.containerNumber}</th>
                  <th>{headerMappings.containerSize}</th>
                  <th>{headerMappings.containerType}</th>
                  <th>{headerMappings.weight}</th>
                  <th>{headerMappings.temperature}</th>
                  <th>{headerMappings.ventilation}</th>
                  <th>{headerMappings.portOfDestination}</th>
                  <th>{headerMappings.daysInTerminal}</th>
                </tr>
              </thead>
              <tbody>
              {filteredInventory.map((item) => (
                  <tr key={item._id}>
                      <td>{item.customerName}</td>
                      <td>{formatDateTime(item.dateAndTime)}</td>
                      <td>{item.customsNumber}</td>
                      <td>{item.portOfOrigin}</td>
                      <td>{item.containerNumber}</td>
                      <td>{item.containerSize}</td>
                      <td>{item.containerType}</td>
                      <td>{item.weight}</td>
                      <td>{item.temperature}</td>
                      <td>{item.ventilation}</td>
                      <td>{item.portOfDestination}</td>
                      <td>{item.daysInTerminal}</td>
                    </tr>
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
                "movement",
                "customerName",
                "customsNumber",
                "commodity",
                "containerNumber",
                "sealNumber_1",
                "truckCo",
                "truckId",
                "truckDriver",
                "orderNumber",
              ])}
              <tbody>
                {filteredMovements.map((item) => (
                  <tr key={item._id}>
                    <td>{formatDateTime(item.dateAndTime)}</td>
                    <td>{item.movement}</td>
                    <td>{item.customerName}</td>
                    <td>{item.customsNumber}</td>
                    <td>{item.commodity}</td>
                    <td>{item.containerNumber}</td>
                    <td>{item.sealNumber_1}</td>
                    <td>{item.truckCo}</td>
                    <td>{item.truckId}</td>
                    <td>{item.truckDriver}</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === "dispatchOrders" && (
          <div className="query-section">
            <h2>Despachos</h2>
            <table>
              {renderFilterHeader([
                "customerName",
                "orderNumber",
                "customsNumber",
                "commodity",
                "truckCo",
                "truckId",
                "truckDriver",
                "containerNumber",
                "creationDateTime",
                "status",
              ])}
              <tbody>
                {filteredDispatchOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.customerName}</td>
                    <td>{order.orderNumber}</td>
                    <td>{order.customsNumber}</td>
                    <td>{order.commodity}</td>
                    <td>{order.truckCo}</td>
                    <td>{order.truckId}</td>
                    <td>{order.truckDriver}</td>
                    <td>{order.containerNumber}</td>
                    <td>{formatDateTime(order.creationDateTime)}</td>
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
