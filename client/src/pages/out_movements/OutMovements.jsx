import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { fetchInventory } from "../../services/fetchInventory.js";
import "./out_movements.css";
import { uploadDataToMongoDB } from "../../services/uploadService.js";
import Footer from "../../components/footer/Footer.js";
import Header from "../../components/header/Header.js";

function OutMovements() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // Utiliza useNavigate para la redirección
  const [isUploading, setIsUploading] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [isReefer, setIsReefer] = useState(false);
  const [requireTempVent, setRequireTempVent] = useState(false);

  const [formData, setFormData] = useState({
    customer: "",
    containerNumber: "",
    truckID: "",
    truckCo: "",
    gateInOrGateOut: "Out",
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
    weight: "",
    notes: "",
  });

  const loadInventory = async () => {
    try {
      const inventoryData = await fetchInventory();
      setInventory(inventoryData);
    } catch (error) {
      console.error("Error al cargar el inventario: ", error);
    }
  };

  // Carga el inventario al montar el componente
  useEffect(() => {
    loadInventory();
  }, []);

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

  // Verifica si el usuario ha iniciado sesión y redirige según el rol del usuario
  useEffect(() => {
    if (!user) {
      // Si 'user' es null o undefined, redirige al inicio de sesión
      navigate("/");
    } else if (user.role === "operator") {
      // Si el usuario tiene el rol de "operator", redirige a la página de ubicación
      navigate("/terminal-map");
    }
    // Puedes agregar más condiciones para otros roles si es necesario
  }, [user, navigate]); // Incluye 'navigate' en la lista de dependencias para evitar advertencias

  // Calcula la fecha máxima permitida (hoy)
  const maxDate = new Date().toISOString().split("T")[0];

  // Calcula la hora máxima permitida (hora actual)
  const maxTime = new Date().toLocaleTimeString("en-GB", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
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
    setIsUploading(true);

    // Combinar la fecha y la hora en un solo campo
    const dateTime = new Date(`${formData.date}T${formData.time}`);

    const dataToUpload = {
      ...formData,
      dateAndTime: dateTime, // Usar el nombre de campo que espera tu backend
      gateInOrGateOut: "Out",
    };

    try {
      // Agrega gateInOrGateOut explícitamente al objeto formData antes de enviarlo

      await uploadDataToMongoDB(dataToUpload);
      toast.success("¡Salida registrada!");
      // Restablecer el formulario a su estado inicial aquí
      setFormData({
        customer: "",
        containerNumber: "",
        truckID: "",
        truckCo: "",
        gateInOrGateOut: "Out",
        containerType: "",
        containerSize: "",
        fullOrEmpty: "",
        originOrDestination: "",
        TIRNumber: "",
        sealNumber_1: "",
        sealNumber_2: "",
        temperature: "",
        ventilation: "",
        weight: "",
        notes: "",
      });
    } catch (error) {
      toast.error(error.message, { autoClose: 6000 });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita el envío tradicional del formulario
    handleUpload(); // Aquí llamas a la función que maneja la carga de datos
  };

  return (
    <>
      <Header />
      <div className="out-movement-container">
        <div className="out-movement-header">
          <h2>SALIDAS</h2>
          <p>
            Registrar movimientos de exportación o salidas hacia otras
            ubicaciones.
          </p>
        </div>
        <div className="out-movement-box">
          <form className="out-movement-form" onSubmit={handleSubmit}>
            <fieldset>
              <legend>Datos obligatorios</legend>
              <section className="data">
              
                <div className="out-movement-item">
                  <label htmlFor="date" className="out-movement-label">
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
                <div className="out-movement-item">
                  <label htmlFor="time" className="out-movement-label">
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
                <div className="out-movement-item">
                  {/*customer*/}
                  <label htmlFor="customer" className="out-movement-label">
                    Cliente
                  </label>
                  <select
                    value={formData.customer}
                    onChange={handleChange}
                    className="select-in"
                    id="customer"
                    name="customer"
                    required
                  >
                    <option value="">Seleccione el cliente</option>
                    <option value="Cool Carriers">Cool Carriers</option>
                    <option value="Baltic Reefers">Baltic Reefers</option>
                    <option value="Seatrade">Seatrade</option>
                    <option value="Hamburg sud">Hamburg Sud</option>
                    <option value="Maersk">Maersk</option>
                    <option value="China Shipping">China Shipping</option>
                    <option value="APL">APL</option>
                    <option value="EWL">EWL :)</option>
                    <option value="Streamlines">Streamlines</option>
                    <option value="CMA-CGM">CMA-CGM</option>
                    <option value="Hapag Lloyd">Hapag Lloyd</option>
                    <option value=""></option>
                  </select>
                </div>
                <div className="out-movement-item">
                  {/*originOrDestination*/}
                  <label
                    htmlFor="originOrDestination"
                    className="out-movement-label"
                  >
                    Destino
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
                <div className="out-movement-item">
                  {/*containerNumber*/}
                  <label
                    htmlFor="containerNumber"
                    className="out-movement-label"
                  >
                    Número de contenedor
                  </label>
                  <input
                    value={formData.containerNumber}
                    onChange={handleChange}
                    type="text"
                    className="input-in"
                    placeholder="Contenedor"
                    id="containerNumber"
                    name="containerNumber"
                    required
                  />
                </div>
                <div className="out-movement-item">
                  {/*truckID*/}
                  <label htmlFor="truckID" className="out-movement-label">
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
                <div className="out-movement-item">
                  {/*truckCo*/}
                  <label htmlFor="truckCo" className="out-movement-label">
                    Transportista
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
                    <option value="Metrocaribe">Metrocaribe</option>
                    <option value="THL">THL</option>
                    <option value="Matamoros">Matamoros</option>
                    <option value="Alamo">Alamo</option>
                    <option value="Grant">Grant</option>
                    <option value="H&H">H&H</option>
                    <option value="Trans Costa Rica">Trans CR</option>
                  </select>
                </div>
                <div className="out-movement-item">
                  {/*containerSize*/}
                  <label htmlFor="" className="out-movement-label">
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
                <div className="out-movement-item">
                  {/*containerType*/}
                  <label htmlFor="containerType" className="out-movement-label">
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
                <div className="out-movement-item">
                  {/*fullOrEmpty*/}
                  <label htmlFor="fullOrEmpty" className="out-movement-label">
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
                <div className="out-movement-item">
                  {/*sealNumber_1*/}
                  <label htmlFor="sealNumber_1" className="out-movement-label">
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
                <div className="out-movement-item">
                  {/*sealNumber_2*/}
                  <label htmlFor="sealNumber_2" className="out-movement-label">
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
                <div className="out-movement-item">
                  {/*temperature*/}
                  <label htmlFor="temperature" className="out-movement-label">
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
                <div className="out-movement-item">
                  {/*ventilation*/}
                  <label htmlFor="ventilation" className="out-movement-label">
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
                <div className="out-movement-item">
                  {/*TIRNumber*/}
                  <label htmlFor="ventilation" className="out-movement-label">
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
                {/* <div className="out-movement-item">
                  {/*weight*/}
                {/* <label htmlFor="weight" className="out-movement-label">
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
                </div> */}
                <div className="out-movement-item">
                  {/*notes*/}
                  <label htmlFor="notes" className="out-movement-label">
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
              </section>
            </fieldset>
            <button type="submit">Confirmar salida de contenedor</button>
          </form>
        </div>
        {/*Fin div out-movement-box*/}
      </div>
      <Footer />
    </>
  );
}
export default OutMovements;
