import React, { useState, useEffect, useContext } from "react";
import calculateCheckDigit from "../../services/calculateCheckDigit.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "./in_movements.css";
import { uploadDataToMongoDB } from "../../services/uploadService.js";
import Footer from "../../components/footer/Footer.js";
import Header from "../../components/header/Header.js";
import fetchCustomers from "../../services/fetchCustomers.js";
import fetchManifests from "../../services/fetchManifests.js";
import fetchTruckCompanies from "../../services/fetchTruckCompanies.js";

function InMovements() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [manifests, setManifests] = useState([]);
  const [isReefer, setIsReefer] = useState(false);
  const [truckCompanies, setTruckCompanies] = useState([]);
  const [isNORActive, setIsNORActive] = useState(false);
  const [isTempVentActive, setIsTempVentActive] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState({
    currentDate: "",
    currentTime: "",
  });
  const [formData, setFormData] = useState({
    movement: "In",
    entryType: "",
    manifestNumber: "",
    motorVessel: "",
    dateAndTime: "",
    customerName: "",
    containerNumber: "",
    containerSize: "",
    containerType: "",
    isEmpty: "",
    commodity: "",
    weight: "",
    portOfOrigin: "",
    truckId: "",
    truckCo: "",
    truckDriver: "",
    sealNumber_1: "",
    sealNumber_2: "",
    isNOR: null,
    temperature: "",
    ventilation: "",
    TIRNumber: "",
    notes: "",
    createdBy: "",
  });


  const token = sessionStorage.getItem("userToken");

  useEffect(() => {
    const isReeferContainer = ["RFH", "RF"].includes(formData.containerType);
    setIsReefer(isReeferContainer);

    const shouldActivateNOR = isReeferContainer && formData.isEmpty === false;
    setIsNORActive(shouldActivateNOR);

    const shouldActivateTempVent =
      isReeferContainer &&
      formData.isEmpty === false &&
      formData.isNOR === false;
    setIsTempVentActive(shouldActivateTempVent);

    if (!shouldActivateNOR) {
      setFormData((prev) => ({ ...prev, isNOR: null }));
    }
    if (!shouldActivateTempVent) {
      setFormData((prev) => ({ ...prev, temperature: "", ventilation: "" }));
    }
  }, [formData.containerType, formData.isEmpty, formData.isNOR]);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        if (!token) {
          console.error("No token found in sessionStorage");
          return;
        }
        const customers = await fetchCustomers(token);
        setCustomers(customers);
      } catch (error) {
        toast.error("Error loading customers.");
      }
    };
    loadCustomers();
  }, []);

  useEffect(() => {
    const loadManifests = async () => {
      try {
        if (!token) {
          console.error("No token found in sessionStorage");
          return;
        }
        const manifests = await fetchManifests(token);
        setManifests(manifests);
      } catch (error) {
        console.error("Error loading manifests: ", error);
        toast.error("Error loading manifests.");
      }
    };
    loadManifests();
  }, []);

  useEffect(() => {
    const loadTruckCompanies = async () => {
      try {
        if (!token) {
          console.error("No token found in sessionStorage");
          return;
        }
        const truckCompanies = await fetchTruckCompanies(token);
        setTruckCompanies(truckCompanies);
      } catch (error) {
        console.error("Error loading Truck Companies: ", error);
        toast.error("Error loading Truck Companies.");
      }
    };
    loadTruckCompanies();
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else if (user.role === "operator") {
      navigate("/map");
    }

    const now = new Date();
    const currentDate = now.toISOString().slice(0, 10); // Formato AAAA-MM-DD
    const currentTime = now.toTimeString().slice(0, 5); // Formato HH:MM

    setCurrentDateTime({ currentDate, currentTime });
  }, [user, navigate, setCurrentDateTime]);

  const handleCheckDigit = () => {
    const containerNumber = formData.containerNumber;
    const actualCheckDigit = parseInt(containerNumber.slice(-1), 10);
    const calculatedCheckDigit = calculateCheckDigit(
      containerNumber.slice(0, -1)
    );

    if (actualCheckDigit !== calculatedCheckDigit) {
      alert("Incorrect container number");
      setFormData({
        ...formData,
        containerNumber: "",
      });
    }
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    const selectedManifest = manifests.find(
      (m) => name === "manifestNumber" && m.manifestNumber === value
    );

    if (selectedManifest) {
      setFormData({
        ...formData,
        [name]: value,
        min_date: selectedManifest.officialArrivalDate.split("T")[0],
        motorVessel: selectedManifest.motorVessel,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === "isEmpty" || name === "isNOR") {
      updatedValue = value === "true";
    }

    if (name === "customerName") {
      const selectedCustomer = customers.find(
        (customer) => customer.customerName === value
      );
      setFormData((prev) => ({
        ...prev,
        customerName: value,
        idNumber: selectedCustomer?.idNumber || "",
      }));
    }
    if (name === "isEmpty") {
      const isEmptyValue = value === "true";
      setFormData((prevData) => ({
        ...prevData,
        [name]: isEmptyValue,
        commodity: isEmptyValue ? "Empty" : "",
      }));
    } else {
      const fieldsToUpperCase = [
        "containerNumber",
        "truckId",
        "truckDriver",
        "commodity",
      ];
      const processedValue = fieldsToUpperCase.includes(name)
        ? value.toUpperCase()
        : value;
      setFormData((prevData) => ({
        ...prevData,
        [name]: updatedValue,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dateTime = new Date(
      `${formData.date}T${formData.time}`
    ).toISOString();

    const dataToUpload = {
      ...formData,
      dateAndTime: dateTime,

      createdBy: user.username,
    };

    try {
      if (!token) {
        console.error("No token found in sessionStorage");
        return;
      }
      await uploadDataToMongoDB(token, dataToUpload, "movements");
      toast.success("Successful data entry!");
      setFormData({
        movement: "In",
        entryType: "",
        manifestNumber: "",
        motorVessel: "",
        dateAndTime: "",
        customerName: "",
        containerNumber: "",
        containerSize: "",
        containerType: "",
        isEmpty: "",
        commodity: "",
        weight: "",
        portOfOrigin: "",
        truckId: "",
        truckCo: "",
        truckDriver: "",
        sealNumber_1: "",
        sealNumber_2: "",
        isNOR: null,
        temperature: "",
        ventilation: "",
        TIRNumber: "",
        notes: "",
        createdBy: "",
      });
    } catch (error) {
      console.error("Error loading movement entry data:", error);
      let errorMessage = "Error loading movement entry data.";

      if (error.response) {
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 400) {
          errorMessage = "Invalid data sent to the server.";
        } else if (error.response.status === 500) {
          errorMessage = "Internal server error.";
        }
      } else if (error.request) {
        errorMessage = "Could not connect to the server.";
      } else {
        errorMessage = error.message || errorMessage;
      }
      toast.error(errorMessage);
    }
  };

  const max_date = currentDateTime.currentDate;

  return (
    <>
      <Header />
      <div className="in-movement-container">
        <div className="in-movement-header">
          <h2>Container Movement Entry</h2>
          <p>
          Register Container Entry to Container Terminal.
          </p>
        </div>
        <form className="in-movement-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend className="legend">Container Entries</legend>
            <section className="data">
              <div className="in-movement-item">
                <label htmlFor="entryType" className="in-movement-label">
                  Type of Entry
                </label>
                <select
                  value={formData.entryType}
                  onChange={handleChange}
                  className="select-in"
                  id="entryType"
                  name="entryType"
                  required
                >
                  <option value="">Select Type of Entry</option>
                  <option value="import">Import</option>
                  <option value="customsAux">Entry from Other Container Terminals</option>
                  <option value="fromShipperOrConsignee">
                    Entry from Customers
                  </option>
                </select>
              </div>
              <div className="in-movement-item">
                <label htmlFor="manifestNumber" className="in-movement-label">
                  Manifest number
                </label>
                <select
                  value={formData.manifestNumber}
                  onChange={handleSelectChange}
                  className="select-in"
                  id="manifestNumber"
                  name="manifestNumber"
                  required
                >
                  <option value="">Select the manifest</option>
                  {manifests.map((manifest) => (
                    <option key={manifest._id} value={manifest.manifestNumber}>
                      {manifest.manifestNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div className="in-movement-item">
                <label htmlFor="motorVessel" className="in-movement-label">
                  Vessel name
                </label>
                <p>{formData.motorVessel}</p>
              </div>
              <div className="in-movement-item">
                <label htmlFor="customerName" className="in-movement-label">
                  Customer
                </label>
                <select
                  value={formData.customerName}
                  onChange={handleChange}
                  className="select-in"
                  id="customerName"
                  name="customerName"
                  required
                >
                  <option value="">Select customer</option>
                  {customers.map((customer) => (
                    <option key={customer._id} value={customer.customerName}>
                      {customer.customerName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="in-movement-item">
                <label htmlFor="date" className="in-movement-label">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="input-date"
                  id="date"
                  name="date"
                  min={formData.min_date}
                  max={max_date}
                  required
                />
              </div>
              <div className="in-movement-item">
                <label htmlFor="time" className="in-movement-label">
                  Time
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="input-date"
                  id="time"
                  name="time"
                  max={
                    formData.date === currentDateTime.currentDate
                      ? currentDateTime.currentTime
                      : "23:59"
                  }
                  required
                />
              </div>
              <div className="in-movement-item">
                <label htmlFor="containerNumber" className="in-movement-label">
                  Sea Container Number
                </label>
                <input
                  value={formData.containerNumber}
                  onChange={handleChange}
                  onBlur={handleCheckDigit}
                  type="text"
                  className="input-in"
                  placeholder="Container"
                  id="containerNumber"
                  name="containerNumber"
                  required
                />
              </div>
              <div className="in-movement-item">
                <label htmlFor="containerSize" className="in-movement-label">
                  Container Size
                </label>
                <select
                  value={formData.containerSize}
                  onChange={handleChange}
                  className="select-in"
                  id="containerSize"
                  name="containerSize"
                  required
                >
                  <option value="">Select Container Size</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="40">40</option>
                  <option value="45">45</option>
                </select>
              </div>
              <div className="in-movement-item">
                <label htmlFor="containerType" className="in-movement-label">
                  Container Type
                </label>
                <select
                  value={formData.containerType}
                  onChange={handleChange}
                  className="select-in"
                  id="containerType"
                  name="containerType"
                  required
                >
                  <option value="">Select Container Type</option>
                  <option value="RFH">RFH</option>
                  <option value="RF">RF</option>
                  <option value="HC">HC</option>
                  <option value="DV">DV</option>
                  <option value="DC">DC</option>
                  <option value="OT">OT</option>
                  <option value="TK">TK</option>
                  <option value="FR">FR</option>
                </select>
              </div>
              <div className="in-movement-item">
                <label htmlFor="isEmpty" className="in-movement-label">
                  Status
                </label>
                <select
                  value={formData.isEmpty.toString()}
                  onChange={handleChange}
                  className="select-in"
                  id="isEmpty"
                  name="isEmpty"
                  required
                >
                  <option value="">Select Container Status</option>
                  <option value="true">Empty</option>
                  <option value="false">Full</option>
                </select>
              </div>
              <div className="in-movement-item">
                <label htmlFor="commodity" className="in-movement-label">
                  Commodity
                </label>
                <input
                  value={formData.commodity}
                  onChange={handleChange}
                  type="text"
                  className="input-in"
                  placeholder="Commodity"
                  id="commodity"
                  name="commodity"
                  disabled={formData.isEmpty === true}
                />
              </div>
              {isNORActive && (
                <div className="in-movement-item">
                  <label htmlFor="isNOR" className="in-movement-label">
                    Indicate if the goods are refrigerated
                  </label>
                  <select
                    value={formData.isNOR?.toString() ?? ""}
                    onChange={handleChange}
                    className="select-in"
                    id="isNOR"
                    name="isNOR"
                  >
                    <option value="">Select condition</option>
                    <option value="false">Refrigerated cargo</option>
                    <option value="true">Dry cargo</option>
                  </select>
                </div>
              )}
              {isTempVentActive && (
                <>
                  <div className="in-movement-item">
                    <label htmlFor="temperature" className="in-movement-label">
                      Temperature
                    </label>
                    <input
                      value={formData.temperature}
                      onChange={handleChange}
                      type="text"
                      className="input-in"
                      placeholder="Temp"
                      id="temperature"
                      name="temperature"
                      required
                    />
                  </div>
                  <div className="in-movement-item">
                    <label htmlFor="ventilation" className="in-movement-label">
                      Ventilation
                    </label>
                    <input
                      value={formData.ventilation}
                      onChange={handleChange}
                      type="text"
                      className="input-in"
                      placeholder="Vent"
                      id="ventilation"
                      name="ventilation"
                      required
                    />
                  </div>
                </>
              )}
              <div className="in-movement-item">
                <label htmlFor="portOfOrigin" className="in-movement-label">
                  Port of Origin (PO)
                </label>
                <select
                  value={formData.portOfOrigin}
                  onChange={handleChange}
                  className="select-in"
                  id="portOfOrigin"
                  name="portOfOrigin"
                >
                  <option value="">Select Port of Origin</option>
                  <option value="NLRTM">Rotterdam, Países Bajos</option>
                  <option value="DEHAM">Hamburgo, Alemania</option>
                  <option value="BEAMB">Amberes, Bélgica</option>
                </select>
              </div>
              <div className="in-movement-item">
                <label htmlFor="TIRNumber" className="in-movement-label">
                  TIR
                </label>
                <input
                  value={formData.TIRNumber}
                  onChange={handleChange}
                  type="text"
                  className="input-in"
                  placeholder="TIR"
                  id="TIRNumber"
                  name="TIRNumber"
                />
              </div>
              <div className="in-movement-item">
                <label htmlFor="weight" className="in-movement-label">
                  Weight
                </label>
                <input
                  value={formData.weight}
                  onChange={handleChange}
                  type="text"
                  className="input-in"
                  placeholder="Weight"
                  id="weight"
                  name="weight"
                />
              </div>
              <div className="in-movement-item">
                <label htmlFor="notes" className="in-movement-label">
                  Remarks
                </label>
                <input
                  value={formData.notes}
                  onChange={handleChange}
                  type="text"
                  className="input-in"
                  placeholder="Remarks"
                  id="notes"
                  name="notes"
                />
              </div>
              <div className="in-movement-item">
                <label htmlFor="truckId" className="in-movement-label">
                  Truck Plate Number
                </label>
                <input
                  value={formData.truckId}
                  onChange={handleChange}
                  type="text"
                  className="input-in"
                  placeholder="Truck Plate Number"
                  id="truckId"
                  name="truckId"
                  required
                />
              </div>
              <div className="in-movement-item">
                <label htmlFor="truckCo" className="in-movement-label">
                Transportation Company
                </label>
                <select
                  value={formData.truckCo}
                  onChange={handleChange}
                  className="select-in"
                  id="truckCo"
                  name="truckCo"
                  required
                >
                  <option value="">Select Transportation Company</option>
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
              <div className="in-movement-item">
                <label htmlFor="truckDriver" className="in-movement-label">
                  Driver´s name
                </label>
                <input
                  value={formData.truckDriver}
                  onChange={handleChange}
                  type="text"
                  className="input-in"
                  placeholder="Driver´s name"
                  id="truckDriver"
                  name="truckDriver"
                  required
                />
              </div>
              <div className="in-movement-item">
                <label htmlFor="sealNumber_1" className="in-movement-label">
                  Seal Nr. 1
                </label>
                <input
                  value={formData.sealNumber_1}
                  onChange={handleChange}
                  type="text"
                  className="input-in"
                  placeholder="Seal Nr. 1"
                  id="sealNumber_1"
                  name="sealNumber_1"
                />
              </div>
              <div className="in-movement-item">
                <label htmlFor="sealNumber_2" className="in-movement-label">
                  Seal Nr. 2
                </label>
                <input
                  value={formData.sealNumber_2}
                  onChange={handleChange}
                  type="text"
                  className="input-in"
                  placeholder="Seal Nr. 2"
                  id="sealNumber_2"
                  name="sealNumber_2"
                />
              </div>
            </section>
          </fieldset>
          <button type="submit">Confirm sea container´s entry</button>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default InMovements;