import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { fetchDispatchOrders } from "../../services/dispatchOrdersService";
import { updateDispatchOrderStatus } from "../../services/updateDispatchOrderStatus";
import { uploadDataToMongoDB } from "../../services/uploadService.js";
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

  const token = sessionStorage.getItem("userToken");

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else if (user.role === "operator") {
      navigate("/stack-view");
    }
    else {
      const now = new Date();
      const currentDate = now.toISOString().slice(0, 10); // Formato AAAA-MM-DD
      const currentTime = now.toTimeString().slice(0, 5); // Formato HH:MM
      setCurrentDateTime({ currentDate, currentTime });
      loadDispatchOrders();
    }
  }, [user, navigate]);

  const loadDispatchOrders = async () => {
    try {
      if (!token) {
        console.error("No token found in sessionStorage");
        return;
      }
      const orders = await fetchDispatchOrders(token);
      const createdOrders = orders.filter(
        (order) => order.status === "created"
      );
      setDispatchOrders(createdOrders);
    } catch (error) {
      console.error("Error Loading Dispatch Orders:", error);
      toast.error("Error Loading Dispatch Orders");
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
      if (!token) {
        console.error("No token found in sessionStorage");
        return;
      }
      const { date, time } = formData;

      if (!date || !time) {
        return toast.error("Please enter the departure date and time");
      }

      const dateAndTime = new Date(`${date}T${time}:00`);

      const movementData = {
        ...selectedDispatchOrder,
        movement: "Out",
        dateAndTime,
        createdBy: user.username,
      };
      await uploadDataToMongoDB(token, movementData, "movements");

      await updateDispatchOrderStatus(
        token,
        selectedDispatchOrder.orderNumber,
        "dispatched"
      );

      loadDispatchOrders();
      setSelectedDispatchOrder(null);
      setFormData({ date: "", time: "", createdBy: "", });

      toast.success("Container exit movement successfully generated!");
    } catch (error) {
      console.error("Error confirming container exit movement:", error);
      toast.error("Error confirming container exit movement");
    }
  };

  const min_date = selectedDispatchOrder ? selectedDispatchOrder.creationDateTime.split("T")[0] : "";

  return (
    <>
      <Header />
      <div className="out-movement-container">
        <div className="out-movement-header">
          <h1>Container Departure</h1>
          <h2>Register container departure from the terminal.</h2>
        </div>
        <div className="out-movement-box">
          <form
            className="out-movement-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <fieldset>
              <legend className="legend">Departures</legend>
              <div className="release-orders-section">
                <p>Container departure confirmation</p>
                <p>Select the dispatch to confirm</p>
                <select
                  value={selectedDispatchOrder ? selectedDispatchOrder._id : ""}
                  onChange={handleDispatchOrderChange}
                  className="select-in"
                >
                  <option value="">Select a dispatch</option>
                  {dispatchOrders.map((order) => (
                    <option key={order._id} value={order._id}>
                      {order.containerNumber} - {order.orderNumber} - {order.consigneeName}
                    </option>
                  ))}
                </select>

                {selectedDispatchOrder && (
                  <>
                    <div>
                      <label htmlFor="date">Departure date:</label>
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
                      <label htmlFor="time">Departure time:</label>
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
                      <h4>Dispatch details</h4>

                      <p>
                        <strong>Customer:</strong>{" "}
                        {selectedDispatchOrder.customerName}
                      </p>

                      <p>
                        <strong>Dispatch order number:</strong>{" "}
                        {selectedDispatchOrder.orderNumber}
                      </p>
                      <p>
                        <strong>Manifest number:</strong>{" "}
                        {selectedDispatchOrder.manifestNumber}
                      </p>


                      <p>
                        <strong>Goods:</strong>{" "}
                        {selectedDispatchOrder.commodity}
                      </p>
                      <p>
                        <strong>Weight:</strong>{" "}
                        {selectedDispatchOrder.weight}
                      </p>

                      <p>
                        <strong>Trucking Company:</strong>{" "}
                        {selectedDispatchOrder.truckCo}
                      </p>
                      <p>
                        <strong>Truck license plate Nr.:</strong>{" "}
                        {selectedDispatchOrder.truckId}
                      </p>
                      <p>
                        <strong>Truck driver:</strong>{" "}
                        {selectedDispatchOrder.truckDriver}
                      </p>
                      <p>
                        <strong>Container number:</strong>{" "}
                        {selectedDispatchOrder.containerNumber}
                      </p>
                      <p>
                        <strong>Seal Nr. 1:</strong>{" "}
                        {selectedDispatchOrder.sealNumber_1}
                      </p>
                      <p>
                        <strong>Seal Nr. 2:</strong>{" "}
                        {selectedDispatchOrder.sealNumber_2}
                      </p>
                    </div>
                    <button onClick={handleConfirmRelease}>
                      Confirm container departure
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
