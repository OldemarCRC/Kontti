import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { fetchInventory } from "../../services/fetchInventory";
import { fetchDispatchOrders } from "../../services/dispatchOrdersService.js";
import { toast } from "react-toastify";
import "./container_dispatch.css";
import { uploadDataToMongoDB } from "../../services/uploadService.js";
/* import { generatePDF } from "../../services/pdfService.js"; */
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
    ticaSequence: "",
    BLNumber: "",
    BLLineNumber: "",
    commodity: "",
    DUANumber: "",
    quantity: "",
    packageType: "",
    containerNumber: "",
    truckId: "",
    truckCo: "",
    truckDriver: "",
    sealNumber_1: "",
    sealNumber_2: "",
    storageLocations: "",
    createdBy: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
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
      console.error("Error loading release orders:", error);
      toast.error("Error loading release orders");
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
        idNumber: selectedInventory.idNumber,
        customerName: selectedInventory.customerName,
        customsNumber: selectedInventory.customsNumber,
        commodity: selectedInventory.commodity,
        locationInTerminal: selectedInventory.locationInTerminal, // Corrige el valor de storageLocations
        containerNumber: selectedContainerNumber,
        truckId: formData.truckId,
        truckCo: formData.truckCo,
        truckDriver: formData.truckDriver,
        sealNumber_1: formData.sealNumber_1,
        sealNumber_2: formData.sealNumber_2,
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
      console.error("Error uploading releaseOrder data:", error);
      toast.error("Error uploading releaseOrder data");
    }
  };

  /*  const handleGeneratePDF = async () => {
    try {
      const pdfURL = await generatePDF(selectedReleaseOrder, user.username);
      toast.success("¡Boleta generada correctamente!");
      window.open(pdfURL, "_blank");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Error generating PDF");
    }
  }; */

  return (
    <>
      <Header />
      <div className="release-order-container">
        <div className="release-order-header">
          <h2>Órdenes de salida</h2>
          <p>Confección de boleta de salida.</p>
        </div>
        <div className="release-order-box">
          <form className="release-order-form" onSubmit={handleSubmit}>
            <fieldset>
              <legend className="legend">Despachos</legend>
              <section className="data">
                <div className="release-order-item">
                  <label
                    htmlFor="containerNumber"
                    className="release-order-label"
                  >
                    Nro. de Contenedor
                  </label>
                  <select
                    value={selectedContainerNumber}
                    onChange={handleContainerNumberChange}
                    className="release-order-select"
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
                  <fieldset>
                    <div className="release-order-item">
                      <label
                        htmlFor="customerName"
                        className="release-order-label"
                      >
                        Cliente
                      </label>
                      <input
                      type="text"
                      className="release-order-input"
                      id="customerName"
                      name="customerName"
                      value={selectedInventory.customerName || ""}
                      onChange={handleChange}
                      readOnly
                    />
                    </div>

                    <div className="release-order-item">
                      <label
                        htmlFor="customerName"
                        className="release-order-label"
                      >
                        Manifiesto
                      </label>
                      <p>{selectedInventory.customsNumber}</p>
                    </div>

                    <div className="release-order-item">
                      <label
                        htmlFor="orderNumber"
                        className="release-order-label"
                      >
                        Número de Orden
                      </label>
                      <div id="orderNumber" className="order-number-text">
                        {formData.orderNumber}
                      </div>
                    </div>
                  </fieldset>
                )}
              </section>
            </fieldset>

            <section className="data">
              <div className="release-order-item">
                <label htmlFor="truckId" className="release-order-label">
                  Nro. de Camión/Placa
                </label>
                <input
                  type="text"
                  className="release-order-input"
                  id="truckId"
                  name="truckId"
                  value={formData.truckId}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="release-order-item">
                <label htmlFor="truckCo" className="release-order-label">
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

              <div className="release-order-item">
                <label htmlFor="truckDriver" className="release-order-label">
                  Nombre del Chofer
                </label>
                <input
                  type="text"
                  className="release-order-input"
                  id="truckDriver"
                  name="truckDriver"
                  value={formData.truckDriver}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="release-order-item">
                <label htmlFor="sealNumber_1" className="release-order-label">
                  Nro. Precinto 1
                </label>
                <input
                  type="text"
                  className="release-order-input"
                  id="sealNumber_1"
                  name="sealNumber_1"
                  value={formData.sealNumber_1}
                  onChange={handleChange}
                />
              </div>

              <div className="release-order-item">
                <label htmlFor="sealNumber_2" className="release-order-label">
                  Nro. Precinto 2
                </label>
                <input
                  type="text"
                  className="release-order-input"
                  id="sealNumber_2"
                  name="sealNumber_2"
                  value={formData.sealNumber_2}
                  onChange={handleChange}
                />
              </div>
            </section>

            <button type="submit" className="submit-button">
              Registrar boleta de salida
            </button>
          </form>

          <div className="release-order-section">
            <h3>Despachos por salir</h3>
            <select
              value={selectedDispatchOrder ? selectedDispatchOrder._id : ""}
              onChange={handleDispatchOrderChange}
              className="release-order-select"
            >
              <option value="">Seleccione una orden de salida</option>
              {sortedDispatchOrders.map((order) => (
                <option key={order._id} value={order._id}>
                  {order.orderNumber} - {""}
                </option>
              ))}
            </select>

            {/*  {selectedReleaseOrder && (
               <button
                onClick={handleGeneratePDF}
                className="generate-pdf-button"
              >
                Generar Boleta
              </button> 
            )} */}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default DispatchOrder;
