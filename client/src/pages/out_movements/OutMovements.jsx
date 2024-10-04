import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { fetchDispatchOrders } from "../../services/dispatchOrdersService";
import { updateDispatchOrderStatus } from "../../services/updateDispatchOrderStatus";
import { uploadDataToMongoDB } from "../../services/uploadService.js"; // Servicio para crear movimiento
import "./out_movements.css";
import Footer from "../../components/footer/Footer.js";
import Header from "../../components/header/Header.js";

function OutMovements() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState({
    currentDate: "",
    currentTime: "",
  });

  const [formData, setFormData] = useState({
    date: "",
    time: "",
  });

  const [dispatchOrders, setDispatchOrders] = useState([]);
  const [selectedDispatchOrder, setSelectedDispatchOrder] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      const now = new Date();
      const currentDate = now.toISOString().slice(0, 10); // Formato AAAA-MM-DD
      const currentTime = now.toTimeString().slice(0, 5); // Formato HH:MM
      setCurrentDateTime({ currentDate, currentTime });
      loadDispatchOrders();
    }
  }, [user, navigate]);

  const loadDispatchOrders = async () => {
    try {
      const orders = await fetchDispatchOrders();
      const createdOrders = orders.filter(
        (order) => order.status === "created"
      );
      setDispatchOrders(createdOrders);
    } catch (error) {
      console.error("Error cargando los despachos:", error);
      toast.error("Error cargando los despachos");
    }
  };

  const handleDispatchOrderChange = (event) => {
    const selectedOrderId = event.target.value;
    const selectedOrder = dispatchOrders.find(
      (order) => order._id === selectedOrderId
    );
    setSelectedDispatchOrder(selectedOrder);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleConfirmRelease = async () => {
    try {
      const { date, time } = formData;

      if (!date || !time) {
        return toast.error("Por favor, ingrese la fecha y la hora de salida");
      }

      const dateAndTime = new Date(`${date}T${time}:00`);

      const movementData = {
        ...selectedDispatchOrder,
        movement: "Out",
        dateAndTime,
        createdBy: user.username,
      };
      await uploadDataToMongoDB(movementData, "movements");

      await updateDispatchOrderStatus(
        selectedDispatchOrder.orderNumber,
        "dispatched"
      );

      loadDispatchOrders();
      setSelectedDispatchOrder(null);
      setFormData({ date: "", time: "", createdBy: "",});

      toast.success("¡Salida de contenedor confirmada!");
    } catch (error) {
      console.error("Error al confirmar la salida:", error);
      toast.error("Error al confirmar la salida");
    }
  };

  const min_date = selectedDispatchOrder ? selectedDispatchOrder.creationDateTime.split("T")[0] : "";

  return (
    <>
      <Header />
      <div className="out-movement-container">
        <div className="out-movement-header">
          <h1>Salidas</h1>
          <p>Registrar salidas de contenedores de la terminal.</p>
        </div>
        <div className="out-movement-box">
          <form
            className="out-movement-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <fieldset>
              <legend className="legend">Salidas de contenedores</legend>
              <div className="release-orders-section">
                <h2>Confirmación de salida de contenedores</h2>
                <h3>Seleccione el despacho a confirmar</h3>
                <select
                  value={selectedDispatchOrder ? selectedDispatchOrder._id : ""}
                  onChange={handleDispatchOrderChange}
                  className="select-in"
                >
                  <option value="">Seleccione un despacho</option>
                  {dispatchOrders.map((order) => (
                    <option key={order._id} value={order._id}>
                      {order.containerNumber} - {order.orderNumber} - {order.consigneeName}
                    </option>
                  ))}
                </select>

                {selectedDispatchOrder && (
                  <>
                    <div>
                      <label htmlFor="date">Fecha de salida:</label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        max={currentDateTime.currentDate}
                        min={min_date}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="time">Hora de salida:</label>
                      <input
                        type="time"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        max={
                          formData.date === currentDateTime.currentDate
                            ? currentDateTime.currentTime
                            : "23:59"
                        }
                        required
                      />
                    </div>
                    <div className="order-details">
                      <h4>Detalles del despacho</h4>
                      
                      <p>
                        <strong>Cliente:</strong>{" "}
                        {selectedDispatchOrder.customerName}
                      </p>
                   
                      <p>
                        <strong>Número de Orden:</strong>{" "}
                        {selectedDispatchOrder.orderNumber}
                      </p>
                      <p>
                        <strong>Número de Aduana:</strong>{" "}
                        {selectedDispatchOrder.customsNumber}
                      </p>
                     
                    
                      <p>
                        <strong>Mercancía:</strong>{" "}
                        {selectedDispatchOrder.commodity}
                      </p>
                      <p>
                        <strong>Peso:</strong>{" "}
                        {selectedDispatchOrder.weight}
                      </p>
                   
                      <p>
                        <strong>Transportista:</strong>{" "}
                        {selectedDispatchOrder.truckCo}
                      </p>
                      <p>
                        <strong>Placa del camión:</strong>{" "}
                        {selectedDispatchOrder.truckId}
                      </p>
                      <p>
                        <strong>Conductor:</strong>{" "}
                        {selectedDispatchOrder.truckDriver}
                      </p>
                      <p>
                        <strong>Número de Contenedor:</strong>{" "}
                        {selectedDispatchOrder.containerNumber}
                      </p>
                      <p>
                        <strong>Número de precinto 1:</strong>{" "}
                        {selectedDispatchOrder.sealNumber_1}
                      </p>
                      <p>
                        <strong>Número de precinto 2:</strong>{" "}
                        {selectedDispatchOrder.sealNumber_2}
                      </p>
                    </div>
                    <button onClick={handleConfirmRelease}>
                      Confirmar salida de contenedor
                    </button>
                  </>
                )}
              </div>
            </fieldset>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default OutMovements;
