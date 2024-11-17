import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import calculateCheckDigit from "../../services/calculateCheckDigit.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "./in_movements.css";
import { uploadDataToMongoDB } from "../../services/uploadService.js";
import Footer from "../../components/footer/Footer.js";
import Header from "../../components/header/Header.js";

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
    customsNumber: "",
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

  // Este efecto se ejecuta cada vez que formData.containerType cambia
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
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/customers`
        );
        setCustomers(response.data);
      } catch (error) {
        console.error("Error cargando los clientes: ", error);
        toast.error("Error al cargar los clientes.");
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/customs-manifest`
        );
        setManifests(response.data);
      } catch (error) {
        console.error("Error cargando los manifiestos: ", error);
        toast.error("Error al cargar los manifiestos.");
      }
    };

    fetchData();
  }, []);

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

  useEffect(() => {
    if (!user) {
      // Si 'user' es null o undefined, redirige al inicio de sesión
      navigate("/");
    } else if (user.role === "operator") {
      // Si el usuario tiene el rol de "operator", redirige a la página de ubicación
      navigate("/map");
    }

    // Obtener la fecha y hora actual
    const now = new Date();
    const currentDate = now.toISOString().slice(0, 10); // Formato AAAA-MM-DD
    const currentTime = now.toTimeString().slice(0, 5); // Formato HH:MM

    // Actualizar el estado con la fecha y hora actuales
    setCurrentDateTime({ currentDate, currentTime });
  }, [user, navigate, setCurrentDateTime]);

  const handleCheckDigit = () => {
    // Asume que el dígito verificador es el último caracter del número de contenedor
    const containerNumber = formData.containerNumber;
    const actualCheckDigit = parseInt(containerNumber.slice(-1), 10);
    const calculatedCheckDigit = calculateCheckDigit(
      containerNumber.slice(0, -1)
    );

    if (actualCheckDigit !== calculatedCheckDigit) {
      alert("Número de contenedor incorrecto");
      // Limpiar el input de containerNumber al establecer su valor a una cadena vacía
      setFormData({
        ...formData,
        containerNumber: "",
      });
    }
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    const selectedManifest = manifests.find(
      (m) => name === "customsNumber" && m.customsNumber === value
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
      /*       BLLineNumber: parseInt(formData.BLLineNumber, 10),
      quantity: parseInt(formData.quantity, 10), */

      createdBy: user.username,
    };

    // Validar que los valores convertidos sean válidos
    /*     if (isNaN(dataToUpload.BLLineNumber) || dataToUpload.BLLineNumber <= 0) {
      toast.error("BLLineNumber debe ser un número mayor a cero");
      return;
    } */

    /*     if (isNaN(dataToUpload.quantity) || dataToUpload.quantity <= 0) {
      toast.error("quantity debe ser un número mayor a cero");
      return;
    } */

    try {
      await uploadDataToMongoDB(dataToUpload, "movements");
      toast.success("¡Ingreso exitoso!");
      setFormData({
        movement: "In",
        entryType: "",
        customsNumber: "",
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
      console.error("Error subiendo datos:", error);
      let errorMessage = "Error al ingresar el movimiento.";

      if (error.response) {
        // Error de respuesta del servidor
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 400) {
          errorMessage = "Datos inválidos enviados al servidor.";
        } else if (error.response.status === 500) {
          errorMessage = "Error interno del servidor.";
        }
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        errorMessage = "No se pudo conectar con el servidor.";
      } else {
        // Algo sucedió al configurar la solicitud que provocó un error
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
          <h2>Ingreso de contenedores</h2>
          <p>
            Registrar ingreso de contenedores al estacionamiento transitorio.
          </p>
        </div>
        <form className="in-movement-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend className="legend">Ingresos</legend>
            <section className="data">
              <div className="in-movement-item">
                <label htmlFor="entryType" className="in-movement-label">
                  Tipo de ingreso
                </label>
                <select
                  value={formData.entryType}
                  onChange={handleChange}
                  className="select-in"
                  id="entryType"
                  name="entryType"
                  required
                >
                  <option value="">Seleccione tipo de ingreso</option>
                  <option value="import">Importación</option>
                  <option value="customsAux">Ingreso de otros predios</option>
                  <option value="fromShipperOrConsignee">
                    Ingreso de finca
                  </option>
                </select>
              </div>

              <div className="in-movement-item">
                <label htmlFor="customsNumber" className="in-movement-label">
                  No. de manifiesto
                </label>
                <select
                  value={formData.customsNumber}
                  onChange={handleSelectChange}
                  className="select-in"
                  id="customsNumber"
                  name="customsNumber"
                  required
                >
                  <option value="">Seleccione el manifiesto</option>
                  {manifests.map((manifest) => (
                    <option key={manifest._id} value={manifest.customsNumber}>
                      {manifest.customsNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div className="in-movement-item">
                <label htmlFor="motorVessel" className="in-movement-label">
                  Nombre del buque
                </label>
                <p>{formData.motorVessel}</p>
              </div>

              <div className="in-movement-item">
                <label htmlFor="customerName" className="in-movement-label">
                  Cliente
                </label>
                <select
                  value={formData.customerName}
                  onChange={handleChange}
                  className="select-in"
                  id="customerName"
                  name="customerName"
                  required
                >
                  <option value="">Seleccione el cliente</option>
                  {customers.map((customer) => (
                    <option key={customer._id} value={customer.customerName}>
                      {customer.customerName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="in-movement-item">
                <label htmlFor="date" className="in-movement-label">
                  Fecha
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
                  Hora
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

              {/*  <div className="in-movement-item">
                <label htmlFor="BLNumber" className="in-movement-label">
                  BL nro.
                </label>
                <input
                  value={formData.BLNumber}
                  onChange={handleChange}
                  type="text"
                  className="input-in"
                  placeholder="BL"
                  id="BLNumber"
                  name="BLNumber"
                />
              </div> */}

              {/* <div className="in-movement-item">
                <label htmlFor="ticaSequence" className="in-movement-label">
                  Secuencia TICA.
                </label>
                <input
                  value={formData.ticaSequence}
                  onChange={handleChange}
                  type="text"
                  className="input-in"
                  placeholder="Secuencia TICA"
                  id="ticaSequence"
                  name="ticaSequence"
                />
              </div> */}

              {/*  <div className="in-movement-item">
                <label htmlFor="BLLineNumber" className="in-movement-label">
                  Línea del bl.
                </label>
                <input
                  value={formData.BLLineNumber}
                  onChange={handleChange}
                  type="number"
                  className="input-in"
                  placeholder="Línea del bl"
                  id="BLLineNumber"
                  name="BLLineNumber"
                  min="0"
                />
              </div> */}

              <div className="in-movement-item">
                <label htmlFor="containerNumber" className="in-movement-label">
                  Número de contenedor
                </label>
                <input
                  value={formData.containerNumber}
                  onChange={handleChange}
                  onBlur={handleCheckDigit} // Se ejecuta handleCheckDigit cuando el input pierde el foco
                  type="text"
                  className="input-in"
                  placeholder="Contenedor"
                  id="containerNumber"
                  name="containerNumber"
                  required
                />
              </div>

              <div className="in-movement-item">
                <label htmlFor="containerSize" className="in-movement-label">
                  Tam
                </label>
                <select
                  value={formData.containerSize}
                  onChange={handleChange}
                  className="select-in"
                  id="containerSize"
                  name="containerSize"
                  required
                >
                  <option value="">Seleccione tamaño</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="40">40</option>
                  <option value="45">45</option>
                </select>
              </div>

              <div className="in-movement-item">
                <label htmlFor="containerType" className="in-movement-label">
                  Tipo
                </label>
                <select
                  value={formData.containerType}
                  onChange={handleChange}
                  className="select-in"
                  id="containerType"
                  name="containerType"
                  required
                >
                  <option value="">Seleccione tipo</option>
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
                  <option value="">Seleccione status</option>
                  <option value="true">Vacío</option>
                  <option value="false">Cargado</option>
                </select>
              </div>

              <div className="in-movement-item">
                <label htmlFor="commodity" className="in-movement-label">
                  Mercancía
                </label>
                <input
                  value={formData.commodity}
                  onChange={handleChange}
                  type="text"
                  className="input-in"
                  placeholder="Mercancía"
                  id="commodity"
                  name="commodity"
                  disabled={formData.isEmpty === true}
                />
              </div>

              {isNORActive && (
                <div className="in-movement-item">
                  <label htmlFor="isNOR" className="in-movement-label">
                    Indique si la mercancía es refrigerada
                  </label>
                  <select
                    value={formData.isNOR?.toString() ?? ""}
                    onChange={handleChange}
                    className="select-in"
                    id="isNOR"
                    name="isNOR"
                  >
                    <option value="">Seleccione condición</option>
                    <option value="false">Carga refrigerada</option>
                    <option value="true">Carga seca</option>
                  </select>
                </div>
              )}
              {isTempVentActive && (
                <>
                  <div className="in-movement-item">
                    <label htmlFor="temperature" className="in-movement-label">
                      Temp
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
                      Vent
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
                  Puerto de origen
                </label>
                <select
                  value={formData.portOfOrigin}
                  onChange={handleChange}
                  className="select-in"
                  id="portOfOrigin"
                  name="portOfOrigin"
                >
                  <option value="">PO</option>
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
                  Peso
                </label>
                <input
                  value={formData.weight}
                  onChange={handleChange}
                  type="text"
                  className="input-in"
                  placeholder="Peso"
                  id="weight"
                  name="weight"
                />
              </div>

              <div className="in-movement-item">
                <label htmlFor="notes" className="in-movement-label">
                  Observaciones
                </label>
                <input
                  value={formData.notes}
                  onChange={handleChange}
                  type="text"
                  className="input-in"
                  placeholder="Observaciones"
                  id="notes"
                  name="notes"
                />
              </div>

              <div className="in-movement-item">
                <label htmlFor="truckId" className="in-movement-label">
                  Número de placa del camión
                </label>
                <input
                  value={formData.truckId}
                  onChange={handleChange}
                  type="text"
                  className="input-in"
                  placeholder="Placa"
                  id="truckId"
                  name="truckId"
                  required
                />
              </div>

              <div className="in-movement-item">
                <label htmlFor="truckCo" className="in-movement-label">
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

              <div className="in-movement-item">
                <label htmlFor="truckDriver" className="in-movement-label">
                  Nombre del chofer
                </label>
                <input
                  value={formData.truckDriver}
                  onChange={handleChange}
                  type="text"
                  className="input-in"
                  placeholder="Conductor"
                  id="truckDriver"
                  name="truckDriver"
                  required
                />
              </div>

              <div className="in-movement-item">
                <label htmlFor="sealNumber_1" className="in-movement-label">
                  Precinto 1
                </label>
                <input
                  value={formData.sealNumber_1}
                  onChange={handleChange}
                  type="text"
                  className="input-in"
                  placeholder="Marchamo"
                  id="sealNumber_1"
                  name="sealNumber_1"
                />
              </div>

              <div className="in-movement-item">
                <label htmlFor="sealNumber_2" className="in-movement-label">
                  Precinto 2
                </label>
                <input
                  value={formData.sealNumber_2}
                  onChange={handleChange}
                  type="text"
                  className="input-in"
                  placeholder="Marchamo 2"
                  id="sealNumber_2"
                  name="sealNumber_2"
                />
              </div>
            </section>
          </fieldset>
          <button type="submit">Confirmar ingreso de mercancía</button>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default InMovements;
