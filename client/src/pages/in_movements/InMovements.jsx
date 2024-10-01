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
  const [customsNumbers, setcustomsNumbers] = useState([]);
  const [isReefer, setIsReefer] = useState(false);
  const [requireTempVent, setRequireTempVent] = useState(false);
  const [truckCompanies, setTruckCompanies] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState({
    currentDate: "",
    currentTime: "",
  });
  const [formData, setFormData] = useState({
    gateInOrGateOut: "In",
    idNumber: "",
    customerName: "",
    containerNumber: "",
    truckId: "",
    truckCo: "",
    truckDriver: "",
    date: "",
    time: "",
    customsNumber: "",
    BLNumber: "",
    ticaSequence: "",
    BLLineNumber: "",
    commodity: "",
    sealNumber_1: "",
    sealNumber_2: "",
    storageLocation: "",
    createdBy: "",
  });

  // Este efecto se ejecuta cada vez que formData.containerType o formData.fullOrEmpty cambian
  useEffect(() => {
    const isReeferContainer =
      formData.containerType === "RFH" || formData.containerType === "RFS";
    setIsReefer(isReeferContainer);

    // Requiere temp y vent solo si es reefer y está lleno
    const requiresTemperatureAndVentilation =
      isReeferContainer && formData.fullOrEmpty === "Full";
    setRequireTempVent(requiresTemperatureAndVentilation);
  }, [formData.containerType, formData.fullOrEmpty]);

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
    const fetchCustomsNumbers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/customs-manifest`
        );
        setcustomsNumbers(response.data);
      } catch (error) {
        console.error("Error cargando los manifiestos: ", error);
        toast.error("Error al cargar los manifiestos.");
      }
    };

    fetchCustomsNumbers();
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
      navigate("/terminal-map");
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
    const selectedNumber = e.target.value;

    // Encuentra el manifiesto seleccionado para obtener su fecha
    const selectedManifest = customsNumbers.find(
      (manifest) => manifest.customsNumber === selectedNumber
    );

    // Actualiza el estado del formulario y establece el límite de fecha mínima
    setFormData({
      ...formData,
      customsNumber: selectedNumber,
      min_date: selectedManifest ? selectedManifest.officialArrivalDate.split("T")[0] : "", // Fecha mínima
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "customerName") {
      const selectedCustomer = customers.find(
        (customer) => customer.customerName === value
      );
      setFormData((prev) => ({
        ...prev,
        customerName: value,
        idNumber: selectedCustomer?.idNumber || "",
      }));
    } else {
      const fieldsToUpperCase = [
        "containerNumber",
        "truckId",
        "truckDriver",
        "BLNumber",
        "commodity",
        "storageLocation",
      ];
      const processedValue = fieldsToUpperCase.includes(name)
        ? value.toUpperCase()
        : value;
      setFormData((prev) => ({
        ...prev,
        [name]: processedValue,
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
      BLLineNumber: parseInt(formData.BLLineNumber, 10),
      quantity: parseInt(formData.quantity, 10),
      createdBy: user.username,
    };

    // Validar que los valores convertidos sean válidos
    if (isNaN(dataToUpload.BLLineNumber) || dataToUpload.BLLineNumber <= 0) {
      toast.error("BLLineNumber debe ser un número mayor a cero");
      return;
    }

    if (isNaN(dataToUpload.quantity) || dataToUpload.quantity <= 0) {
      toast.error("quantity debe ser un número mayor a cero");
      return;
    }

    try {
      await uploadDataToMongoDB(dataToUpload, "movements");
      toast.success("¡Ingreso exitoso!");
      setFormData({
        gateInOrGateOut: "In",
        idNumber: "",
        customerName: "",
        containerNumber: "",
        truckId: "",
        truckCo: "",
        truckDriver: "",
        date: "",
        time: "",
        customsNumber: "",
        BLNumber: "",
        ticaSequence: "",
        BLLineNumber: "",
        quantity: "",
        packageType: "",
        commodity: "",
        sealNumber_1: "",
        sealNumber_2: "",
        storageLocation: "",
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
          <p>Registrar ingreso de contenedores al estacionamiento transitorio.</p>
        </div>
        <form className="in-movement-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend className="legend">Ingresos</legend>
            <section className="data">
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
                  {customsNumbers.map((manifest) => (
                    <option key={manifest._id} value={manifest.customsNumber}>
                      {manifest.customsNumber}
                    </option>
                  ))}
                </select>
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


              <div className="in-movement-item">
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
              </div>

              <div className="in-movement-item">
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
              </div>

              <div className="in-movement-item">
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
              </div>


              <div className="in-movement-item">
                  <label
                    htmlFor="containerNumber"
                    className="in-movement-label"
                  >
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
                  {" "}
                  
                  <label htmlFor="" className="in-movement-label">
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
                    <option value="40">40</option>
                    <option value="20">20</option>
                    <option value="10">10</option>
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
                    <option value="RFS">RFS</option>
                    <option value="DV">DV</option>
                    <option value="OT">OT</option>
                    <option value="TK">TK</option>
                    <option value="FR">FR</option>
                  </select>
                </div>

                <div className="in-movement-item">
                  <label htmlFor="fullOrEmpty" className="in-movement-label">
                    Status
                  </label>
                  <select
                    value={formData.fullOrEmpty}
                    onChange={handleChange}
                    className="select-in"
                    id="fullOrEmpty"
                    name="fullOrEmpty"
                    required
                  >
                    <option value="">Seleccione status</option>
                    <option value="Empty">Vacío</option>
                    <option value="Full">Cargado</option>
                  </select>
                </div>

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
                    disabled={!isReefer} // Deshabilita si no es reefer
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
                    disabled={!isReefer} // Deshabilita si no es reefer
                  />
                </div>

                <div className="in-movement-item">
                  <label
                    htmlFor="portOfDestination"
                    className="in-movement-label"
                  >
                    Puerto de destino
                  </label>
                  <select
                    value={formData.portOfDestination}
                    onChange={handleChange}
                    className="select-in"
                    id="portOfDestination"
                    name="portOfDestination"
                  >
                    <option value="">POD</option>
                    <option value="NLRTM">Rotterdam, Países Bajos</option>
                    <option value="DEHAM">Hamburgo, Alemania</option>
                    <option value="BEAMB">Amberes, Bélgica</option>

                  </select>
                </div>

                <div className="in-movement-item">
                  <label htmlFor="exportVessel" className="in-movement-label">
                    Barco de exportación
                  </label>
                  <select
                    value={formData.exportVessel}
                    onChange={handleChange}
                    className="select-in"
                    id="exportVessel"
                    name="exportVessel"
                  >
                    <option value="">Barco</option>
                    <option value="MV Puerto Limón">MV Puerto Limón</option>
                    <option value="MV Cahuita">MV Cahuita</option>
                    <option value="MV Costa Rica Carrier">
                      MV Costa Rica carrier
                    </option>
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

              <div className="in-movement-item">
                <label htmlFor="storageLocation" className="in-movement-label">
                  Ubicación en bodega
                </label>
                <input
                  value={formData.storageLocation}
                  onChange={handleChange}
                  type="text"
                  className="input-in"
                  placeholder="Ubicación en bodega"
                  id="storageLocation"
                  name="storageLocation"
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










/*

function InMovements() {


  const [formData, setFormData] = useState({
    gateInOrGateOut: "In",
    customer: "",
    containerNumber: "",
    truckID: "",
    truckCo: "",
    containerType: "",
    containerSize: "",
    fullOrEmpty: "",
    date: "",
    time: "",
    dateAndTime: "",
    originOrDestination: "",
    TIRNumber: "",
    sealNumber_1: "",
    sealNumber_2: "",
    temperature: "",
    ventilation: "",
    portOfDestination: "",
    exportVessel: "",
    weight: "",
    notes: "",
  });

  // Validación de fecha y hora futura
  const validateDateTime = () => {
    const currentDateTime = new Date();
    const selectedDateTime = new Date(`${formData.date}T${formData.time}`);

    if (selectedDateTime > currentDateTime) {
      toast.error("No se puede seleccionar una fecha y hora futuras.", {
        autoClose: 8000,
      });
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Determina si el campo actual debe convertirse a mayúsculas
    let updatedValue = value;
    if (
      [
        "containerNumber",
        "truckID",
        "originOrDestination",
        "temperature",
        "ventilation",
      ].includes(name)
    ) {
      updatedValue = value.toUpperCase();
    }

    // Actualiza el estado con el valor (convertido a mayúsculas si es necesario)
    setFormData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
    }));
  };

  const handleUpload = async () => {
    if (!validateDateTime()) {
      return;
    }
    // Validación adicional para temperatura y ventilación
    if (requireTempVent && (!formData.temperature || !formData.ventilation)) {
      toast.error(
        "Obligatorio temp y vent, si no es carga refrigerada digitar NOR en ambos campos",
        { autoClose: 8000 }
      );
      return;
    }
    // Validación para sealNumber_1 cuando el contenedor está Cargado
    if (
      formData.fullOrEmpty === "Full" &&
      formData.containerType !== "FR" &&
      !formData.sealNumber_1
    ) {
      toast.error(
        "El número de marchamo 1 es obligatorio para contenedores llenos.",
        { autoClose: 8000 }
      );
      return; // Detiene la ejecución del envío si la validación falla
    }

    // Combinar la fecha y la hora en un solo campo
    const dateTime = new Date(`${formData.date}T${formData.time}`);
    // Eliminar los campos de fecha y hora individuales si ya no son necesarios

    const dataToUpload = {
      ...formData,
      dateAndTime: dateTime, // Usar el nombre de campo que espera tu backend
      gateInOrGateOut: "In",
    };

    try {
      // Agrega gateInOrGateOut explícitamente al objeto formData antes de enviarlo

      await uploadDataToMongoDB(dataToUpload);
      toast.success("¡Ingreso exitoso!");
      // Restablecer el formulario a su estado inicial aquí
      setFormData({
        customer: "",
        containerNumber: "",
        truckID: "",
        truckCo: "",
        gateInOrGateOut: "In",
        containerType: "",
        containerSize: "",
        fullOrEmpty: "",
        originOrDestination: "",
        TIRNumber: "",
        sealNumber_1: "",
        sealNumber_2: "",
        temperature: "",
        ventilation: "",
        portOfDestination: "",
        exportVessel: "",
        weight: "",
        notes: "",
      });
    } catch (error) {
      toast.error(error.message, { autoClose: 5000 });
    } 
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita el envío tradicional del formulario
    handleUpload(); // Aquí llamas a la función que maneja la carga de datos
  };

  return (
    <>
      <Header />
      <div className="in-movement-container">
        <div className="in-movement-header">
          <h2>INGRESOS</h2>
          <p>
            Registrar movimientos de importación o ingresos desde otras
            ubicaciones.
          </p>
        </div>
        <div className="in-movement-box">
          <form className="in-movement-form" onSubmit={handleSubmit}>
            <fieldset>
              <legend>Datos obligatorios</legend>
              <section className="data">
                
                <div className="in-movement-item">
                  <label htmlFor="date" className="in-movement-label">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    max={maxDate} // Establece la fecha máxima permitida
                    className="input-date"
                    id="date"
                    name="date"
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
                    max={maxTime} // Establece la hora máxima permitida basada en la fecha seleccionada
                    className="input-date"
                    id="time"
                    name="time"
                    required
                  />
                </div>
                
                <div className="in-movement-item">
                  
                  <label
                    htmlFor="originOrDestination"
                    className="in-movement-label"
                  >
                    Origen
                  </label>
                  <input
                    value={formData.originOrDestination}
                    onChange={handleChange}
                    type="text"
                    className="input-in"
                    placeholder="Origen o destino"
                    id="originOrDestination"
                    name="originOrDestination"
                    required
                  />
                </div>
            
                <div className="in-movement-item">
                  
                  <label htmlFor="truckID" className="in-movement-label">
                    Placa
                  </label>
                  <input
                    value={formData.truckID}
                    onChange={handleChange}
                    type="text"
                    className="input-in"
                    placeholder="Placa"
                    id="truckID"
                    name="truckID"
                    required
                  />
                </div>
                
                
                
                <div className="in-movement-item">
                  
                  <label htmlFor="sealNumber_1" className="in-movement-label">
                    Marchamo 1
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
              </section>
            </fieldset>
            <fieldset>
              <legend>Datos opcionales</legend>
              <section className="optional-data">
                <div className="in-movement-item">
                
                  <label htmlFor="sealNumber_2" className="in-movement-label">
                    Marchamo 2
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
            <button type="submit">Confirmar ingreso de contenedor</button>
          </form>
        </div>
        
      </div>
      <Footer />
    </>
  );
}
export default InMovements;
*/
