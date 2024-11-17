import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { fetchInventory } from "../../services/fetchInventory";
import { fetchDispatchOrders } from "../../services/dispatchOrdersService.js";
import { toast } from "react-toastify";
import "./container_dispatch.css";
import { uploadDataToMongoDB } from "../../services/uploadService.js";
import { generatePDF } from "../../services/pdfService.js";
import Footer from "../../components/footer/Footer.js";
import Header from "../../components/header/Header.js";

function DispatchOrder() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [inventoryData, setInventoryData] = useState([]);
  const [containersNumbers, setContainersNumbers] = useState([]);
  const [selectedContainerNumber, setSelectedContainerNumber] = useState("");
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [dispatchOrders, setDispatchOrders] = useState([]);
  const [dispatchOrdersAll, setDispatchOrdersAll] = useState([]);
  const [selectedDispatchOrder, setSelectedDispatchOrder] = useState(null);
  const [truckCompanies, setTruckCompanies] = useState([]);

  const initialFormData = {
    orderNumber: "",
    idNumber: "",
    customerName: "",
    customsNumber: "",
    motorVessel: "",
    dateIn: "",
    containerNumber: "",
    containerSize: "",
    containerType: "",
    isEmpty: "",
    commodity: "",
    isNOR: "",
    weight: "",
    portOfOrigin: "",
    sealNumber_1: "",
    sealNumber_2: "",
    temperature: "",
    ventilation: "",
    locationInTerminal: "",
    truckId: "",
    truckCo: "",
    truckDriver: "",
    consigneeName: "",
    destination: "",
    createdBy: "",
    creationDateTime: "",
    DUANumber: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else if (user.role === "operator") {
      // Si el usuario tiene el rol de "operator", redirige a la página de ubicación
      navigate("/map");
    }else {
      loadInventoryData();
      loadDispatchOrders();
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchTruckCompanies = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/truck-companies`
        );
        setTruckCompanies(response.data);
      } catch (error) {
        console.error("Error cargando los clientes: ", error);
        toast.error("Error al cargar los clientes.");
      }
    };

    fetchTruckCompanies();
  }, []);

  const loadInventoryData = async () => {
    try {
      const inventory = await fetchInventory();
      setInventoryData(inventory);

      const containersNumbers = Array.from(
        new Set(inventory.map((item) => item.containerNumber))
      );
      setContainersNumbers(containersNumbers);
    } catch (error) {
      console.error("Error loading inventory data:", error);
      toast.error("Error loading inventory data");
    }
  };

  const loadDispatchOrders = async () => {
    try {
      const orders = await fetchDispatchOrders();
      const createdOrders = orders.filter(
        (order) => order.status === "created"
      );
      setDispatchOrdersAll(orders);
      setDispatchOrders(createdOrders);
    } catch (error) {
      console.error("Error loading dispatch orders:", error);
      toast.error("Error loading dispatch orders");
    }
  };

  const generateDispatchOrderNumber = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const dateString = `${year}${month}${day}`;

    const todayOrders = dispatchOrdersAll.filter((order) => {
      const orderDate = new Date(order.creationDateTime);
      return (
        orderDate.getFullYear() === year &&
        orderDate.getMonth() === today.getMonth() &&
        orderDate.getDate() === today.getDate()
      );
    });

    const nextSequence = String(todayOrders.length + 1).padStart(3, "0");
    return `${dateString}-${nextSequence}`;
  };
  const orderNumber = generateDispatchOrderNumber();
  const handleDispatchOrderChange = (event) => {
    const selectedOrderId = event.target.value;
    const selectedOrder = dispatchOrders.find(
      (order) => order._id === selectedOrderId
    );
    setSelectedDispatchOrder(selectedOrder);
  };

  const handleContainerNumberChange = (event) => {
    const containerNumber = event.target.value;
    setSelectedContainerNumber(containerNumber);

    const inventory = inventoryData.find(
      (item) => item.containerNumber === containerNumber
    );

    if (inventory) {
      setSelectedInventory(inventory);

      const orderNumber = generateDispatchOrderNumber();
      setFormData((prevData) => ({
        ...prevData,
        orderNumber,
      }));
    } else {
      console.error(
        "No se encontró inventario para el contenedor seleccionado"
      );
      setSelectedInventory(null);
    }
  };

  // Ordena las órdenes de salida de más reciente a más antigua
  const sortedDispatchOrders = [...dispatchOrders].sort((a, b) => {
    return b.orderNumber.localeCompare(a.orderNumber);
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedInventory) {
      toast.error("No hay inventario");
      return;
    }

    try {
      const currentDateTime = new Date().toISOString();

      const payload = {
        ...formData,
        orderNumber,
        departureType: formData.departureType,
        idNumber: selectedInventory.idNumber,
        customerName: selectedInventory.customerName,
        customsNumber: selectedInventory.customsNumber,
        motorVessel: selectedInventory.motorVessel,
        dateIn: selectedInventory.dateAndTime,
        containerNumber: selectedContainerNumber,
        containerSize: selectedInventory.containerSize,
        containerType: selectedInventory.containerType,
        isEmpty: selectedInventory.isEmpty,
        commodity: selectedInventory.commodity,
        isNOR: selectedInventory.isNOR,
        weight: selectedInventory.weight,
        portOfOrigin: selectedInventory.portOfOrigin,
        sealNumber_1: formData.sealNumber_1,
        sealNumber_2: formData.sealNumber_2,
        temperature: selectedInventory.temperature,
        ventilation: selectedInventory.ventilation,
        locationInTerminal: selectedInventory.locationInTerminal,
        truckId: formData.truckId,
        truckCo: formData.truckCo,
        truckDriver: formData.truckDriver,
        consigneeName: formData.consigneeName,
        destination: formData.destination,
        createdBy: user.username,
        creationDateTime: currentDateTime,
        status: "created",
      };
      await uploadDataToMongoDB(payload, "dispatchOrder");
      toast.success("¡Orden de salida registrada!");

      loadInventoryData();
      loadDispatchOrders();
      setFormData(initialFormData);
    } catch (error) {
      console.error("Error uploading dispatchOrder data:", error);
      toast.error("Error uploading dispatchOrder data");
    }
  };

  const handleGeneratePDF = async () => {
    try {
      const pdfURL = await generatePDF(selectedDispatchOrder, user.username);
      toast.success("¡Despacho generado correctamente!");
      window.open(pdfURL, "_blank");
    } catch (error) {
      console.error("Error generando el PDF:", error);
      toast.error("Error generando el PDF");
    }
  };

  return (
    <>
      <Header />
      <div className="dispatch-order-container">
        <div className="dispatch-order-header">
          <h1>Despacho de contenedores</h1>
          <h2>Confección de boleta de despacho.</h2>
        </div>
        <div className="dispatch-order-box">
          <form className="dispatch-order-form" onSubmit={handleSubmit}>
            <fieldset>
              <legend className="legend">Despachos</legend>
              <section className="data">
                <div className="dispatch-order-item">
                  <label
                    htmlFor="containerNumber"
                    className="dispatch-order-label"
                  >
                    Nro. de Contenedor
                  </label>
                  <select
                    value={selectedContainerNumber}
                    onChange={handleContainerNumberChange}
                    className="dispatch-order-select"
                    id="containerNumber"
                    name="containerNumber"
                    required
                  >
                    <option value="">Seleccione el contenedor</option>
                    {containersNumbers.map((container, index) => (
                      <option key={index} value={container}>
                        {container}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedInventory && (
                  <>
                    <div className="dispatch-order-item">
                      <label
                        htmlFor="containerSize"
                        className="dispatch-order-label"
                      >
                        Size
                      </label>
                      <input
                        type="text"
                        className="dispatch-order-input"
                        id="containerSize"
                        name="containerSize"
                        value={selectedInventory.containerSize || ""}
                        onChange={handleChange}
                        readOnly
                      />
                    </div>

                    <div className="dispatch-order-item">
                      <label
                        htmlFor="containerType"
                        className="dispatch-order-label"
                      >
                        Type
                      </label>
                      <input
                        type="text"
                        className="dispatch-order-input"
                        id="containerType"
                        name="containerType"
                        value={selectedInventory.containerType || ""}
                        onChange={handleChange}
                        readOnly
                      />
                    </div>

                    <div className="dispatch-order-item">
                      <label
                        htmlFor="commodity"
                        className="dispatch-order-label"
                      >
                        Mercancía
                      </label>
                      <input
                        type="text"
                        className="dispatch-order-input"
                        id="commodity"
                        name="commodity"
                        value={selectedInventory.commodity || ""}
                        onChange={handleChange}
                        readOnly
                      />
                    </div>

                    <div className="dispatch-order-item">
                      <label
                        htmlFor="temperature"
                        className="dispatch-order-label"
                      >
                        Temperatura
                      </label>
                      <input
                        type="text"
                        className="dispatch-order-input"
                        id="temperature"
                        name="temperature"
                        value={selectedInventory.temperature || ""}
                        onChange={handleChange}
                        readOnly
                      />
                    </div>

                    <div className="dispatch-order-item">
                      <label
                        htmlFor="ventilation"
                        className="dispatch-order-label"
                      >
                        Ventilación
                      </label>
                      <input
                        type="text"
                        className="dispatch-order-input"
                        id="ventilation"
                        name="ventilation"
                        value={selectedInventory.ventilation || ""}
                        onChange={handleChange}
                        readOnly
                      />
                    </div>

                    <div className="dispatch-order-item">
                      <label
                        htmlFor="customerName"
                        className="dispatch-order-label"
                      >
                        Cliente
                      </label>
                      <input
                        type="text"
                        className="dispatch-order-input"
                        id="customerName"
                        name="customerName"
                        value={selectedInventory.customerName || ""}
                        onChange={handleChange}
                        readOnly
                      />
                    </div>

                    <div className="dispatch-order-item">
                      <label
                        htmlFor="customsNumber"
                        className="dispatch-order-label"
                      >
                        Manifiesto de ingreso
                      </label>
                      <input
                        type="text"
                        className="dispatch-order-input"
                        id="customsNumber"
                        name="customsNumber"
                        value={selectedInventory.customsNumber || ""}
                        onChange={handleChange}
                        readOnly
                      />
                    </div>

                    <div className="dispatch-order-item">
                      <label
                        htmlFor="locationInTerminal"
                        className="dispatch-order-label"
                      >
                        Ubicación en la terminal
                      </label>
                      <input
                        type="text"
                        className="dispatch-order-input"
                        id="locationInTerminal"
                        name="locationInTerminal"
                        value={selectedInventory.locationInTerminal || ""}
                        onChange={handleChange}
                        readOnly
                      />
                    </div>

                    <div className="dispatch-order-item">
                      <label
                        htmlFor="orderNumber"
                        className="dispatch-order-label"
                      >
                        Número de despacho
                      </label>
                      <input
                        type="text"
                        className="dispatch-order-input"
                        id="orderNumber"
                        name="orderNumber"
                        value={formData.orderNumber || ""}
                        onChange={handleChange}
                        readOnly
                      />
                    </div>
                  </>
                )}
              </section>
            </fieldset>

            <section className="data">
              <div className="dispatch-order-item">
                <label htmlFor="departureType" className="dispatch-order-label">
                  Tipo de salida
                </label>
                <select
                  value={formData.departureType}
                  onChange={handleChange}
                  className="select-in"
                  id="departureType"
                  name="departureType"
                  required
                >
                  <option value="">Seleccione tipo de salida</option>
                  <option value="export">Exportación</option>
                  <option value="toConsignee">Al consignatario</option>
                  <option value="toShipper">Al shipper</option>
                  <option value="toCustomsAux">Otro predio</option>
                </select>
              </div>

              <div className="dispatch-order-item">
                <label htmlFor="consigneeName" className="dispatch-order-label">
                  Consignatario
                </label>
                <input
                  type="text"
                  className="dispatch-order-input"
                  id="consigneeName"
                  name="consigneeName"
                  value={formData.consigneeName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="dispatch-order-item">
                <label htmlFor="destination" className="dispatch-order-label">
                  Destino
                </label>
                <input
                  type="text"
                  className="dispatch-order-input"
                  id="destination"
                  name="destination"
                  value={formData.destination || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="dispatch-order-item">
                <label htmlFor="truckId" className="dispatch-order-label">
                  Nro. de Camión/Placa
                </label>
                <input
                  type="text"
                  className="dispatch-order-input"
                  id="truckId"
                  name="truckId"
                  value={formData.truckId}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="dispatch-order-item">
                <label htmlFor="truckCo" className="dispatch-order-label">
                  Empresa de transporte
                </label>
                <select
                  value={formData.truckCo}
                  onChange={handleChange}
                  className="select-in"
                  id="truckCo"
                  name="truckCo"
                  required
                >
                  <option value="">Seleccione transportista</option>
                  {truckCompanies.map((truckCompany) => (
                    <option
                      key={truckCompany._id}
                      value={truckCompany.companyName}
                    >
                      {truckCompany.companyName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="dispatch-order-item">
                <label htmlFor="truckDriver" className="dispatch-order-label">
                  Nombre del Chofer
                </label>
                <input
                  type="text"
                  className="dispatch-order-input"
                  id="truckDriver"
                  name="truckDriver"
                  value={formData.truckDriver}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="dispatch-order-item">
                <label htmlFor="sealNumber_1" className="dispatch-order-label">
                  Nro. Precinto 1
                </label>
                <input
                  type="text"
                  className="dispatch-order-input"
                  id="sealNumber_1"
                  name="sealNumber_1"
                  value={formData.sealNumber_1 || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="dispatch-order-item">
                <label htmlFor="sealNumber_2" className="dispatch-order-label">
                  Nro. Precinto 2
                </label>
                <input
                  type="text"
                  className="dispatch-order-input"
                  id="sealNumber_2"
                  name="sealNumber_2"
                  value={formData.sealNumber_2 || ""}
                  onChange={handleChange}
                />
              </div>
            </section>

            <button type="submit" className="submit-button">
              Registrar boleta de salida
            </button>
          </form>

          <div className="dispatch-order-section">
            <h3>Despachos por salir</h3>
            <select
              value={selectedDispatchOrder ? selectedDispatchOrder._id : ""}
              onChange={handleDispatchOrderChange}
              className="dispatch-order-select"
            >
              <option value="">Seleccione una orden de salida</option>
              {sortedDispatchOrders.map((order) => (
                <option key={order._id} value={order._id}>
                  {order.orderNumber} - {order.containerNumber}
                </option>
              ))}
            </select>

            {selectedDispatchOrder && (
              <button
                onClick={handleGeneratePDF}
                className="generate-pdf-button"
              >
                Generar Boleta
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default DispatchOrder;
