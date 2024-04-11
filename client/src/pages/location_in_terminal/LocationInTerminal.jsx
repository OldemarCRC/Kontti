import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./location_in_terminal.css";
import { fetchInventory } from "../../services/fetchInventory.js"; // Asegúrate de importar correctamente
import { updateContainerLocation } from "../../services/uploadService.js";

function LocationInTerminal() {
  /* const [isUploading, setIsUploading] = useState(false); */
  const [inventory, setInventory] = useState([]); // Nuevo estado para almacenar el inventario
  // Estado para manejar el filtro de contenedores
  const [filteredInventory, setFilteredInventory] = useState([]);
  // Estado para el número de contenedor seleccionado
  const [selectedContainer, setSelectedContainer] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [formData, setFormData] = useState({
    containerNumber: "",
    locationInTerminal: "",
  });

  // Define la función para cargar el inventario
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

  // Maneja el cambio en el input de búsqueda
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSelectedContainer(value); // Actualiza el contenedor seleccionado con el valor actual

    // Filtra el inventario basado en la entrada del usuario
    const filteredData = inventory.filter((container) =>
      container.containerNumber.startsWith(value.toUpperCase())
    );
    setFilteredInventory(filteredData); // Actualiza los contenedores filtrados
  };

  // Actualiza `setSelectedContainer` para también actualizar `formData.containerNumber`
  const handleContainerSelection = (containerNumber) => {
    setSelectedContainer(containerNumber); // Actualiza el contenedor seleccionado
    setFormData((prevFormData) => ({
      ...prevFormData,
      containerNumber: containerNumber, // Asegúrate de que el número de contenedor se actualice en formData
    }));
  };

  useEffect(() => {
    // Función para verificar la existencia de la posición actual en el inventario
    const checkPositionInInventory = () => {
      const currentPosition = formData.locationInTerminal;

      if (currentPosition.length === 4) {
        // Asegúrate de que se haya completado una posición válida
        // Buscar en el inventario si existe un contenedor con la posición actual
        const exists = inventory.some(
          (container) => container.locationInTerminal === currentPosition
        );
        setIsSubmitDisabled(exists);
        if (exists) {
          // Mostrar mensaje de error si la posición ya existe
          alert(
            "La posición especificada ya está ocupada por otro contenedor.",
          );
        }
        } else {
          // Deshabilitar el botón si la posición no está completamente definida
          setIsSubmitDisabled(true);
        }
      };
    checkPositionInInventory();
  }, [formData.locationInTerminal, inventory]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Concatenar la nueva selección con los valores existentes
    let newLocationString = formData.locationInTerminal;

    if (name === "locationZone") {
      newLocationString = value + newLocationString.substring(1);
    } else if (name === "locationStack") {
      newLocationString =
        newLocationString.charAt(0) + value + newLocationString.substring(2);
    } else if (name === "locationColumn") {
      newLocationString =
        newLocationString.substring(0, 2) + value + newLocationString.charAt(3);
    } else if (name === "locationHeight") {
      newLocationString = newLocationString.substring(0, 3) + value;
    }

    setFormData((prevData) => ({
      ...prevData,
      locationInTerminal: newLocationString,
    }));
  };

  const handleUpload = async () => {
   /*  setIsUploading(true); */

    const dataToUpload = {
      ...formData,
    };

    try {
      await updateContainerLocation(dataToUpload);
      toast.success("¡Posición actualizada!", { autoClose: 5000 });
      // Restablecer el formulario a su estado inicial aquí
      setFormData({
        containerNumber: "",
        locationInTerminal: "",
      });
      loadInventory();
    } catch (error) {
      toast.error(error.message, { autoClose: 5000 });
    } /* finally {
      setIsUploading(false);
    } */
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita el envío tradicional del formulario
    handleUpload(); // Aquí llamas a la función que maneja la carga de datos
  };

  return (
    <>
      <div className="location-container">
       

        <form className="location-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Actualizar posición</legend>
            <div>
              <label htmlFor="containerSearch">Número de contenedor:</label>
              <input
                id="containerSearch"
                type="text"
                value={selectedContainer}
                onChange={handleSearchChange}
                autoComplete="off" // Desactiva la autocompletación del navegador
              />
              <ul>
                {filteredInventory.map((container) => (
                  <li
                    key={container.containerNumber}
                    onClick={() =>
                      handleContainerSelection(container.containerNumber)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {container.containerNumber}
                  </li>
                ))}
              </ul>
            </div>

            <div className="container-location">
              <div className="container-location-item">
                {/*containerType*/}
                <label htmlFor="containerType" className="in-movement-label">
                  Zona
                </label>
                <select
                  value={formData.locationInTerminal.charAt(0)}
                  onChange={handleChange}
                  type="text"
                  className="location-select"
                  id="locationZone"
                  name="locationZone"
                  required
                >
                  <option value="">Zona</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  {/* <option value="M">M</option>
                  <option value="T">T</option> */}
                  {/* <option value=""></option> */}
                </select>
              </div>

              <div className="container-location-item">
                {/*containerType*/}
                <label htmlFor="containerType" className="in-movement-label">
                  Stack
                </label>
                <select
                  value={formData.locationInTerminal.charAt(1)}
                  onChange={handleChange}
                  type="number"
                  className="location-select"
                  id="locationStack"
                  name="locationStack"
                  required
                >
                  <option value="">Stack</option>
                  {[...Array(8).keys()].map((i) => {
                    const stackNumber = i + 1;
                    // Desactivar opciones de stack > 7 si la zona es A o B
                    const isDisabled =
                      (formData.locationInTerminal.charAt(0) === "A" ||
                        formData.locationInTerminal.charAt(0) === "B") &&
                      stackNumber > 7;

                    return (
                      <option
                        key={stackNumber}
                        value={stackNumber}
                        disabled={isDisabled}
                      >
                        {stackNumber}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="container-location-item">
                {/*containerType*/}
                <label htmlFor="containerType" className="in-movement-label">
                  Columna
                </label>
                <select
                  value={formData.locationInTerminal.charAt(2)}
                  onChange={handleChange}
                  type="text"
                  className="location-select"
                  id="locationColumn"
                  name="locationColumn"
                  required
                >
                  <option value="">Columna</option>
                  {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"].map(
                    (column, index) => {
                      // Desactivar opciones de columna F-J si la zona es A o B
                      const isDisabled =
                        (formData.locationInTerminal.charAt(0) === "A" ||
                          formData.locationInTerminal.charAt(0) === "B") &&
                        index >= 5;

                      return (
                        <option
                          key={column}
                          value={column}
                          disabled={isDisabled}
                        >
                          {column}
                        </option>
                      );
                    }
                  )}
                </select>
              </div>

              <div className="container-location-item">
                <label htmlFor="containerType" className="in-movement-label">
                  Altura
                </label>
                <select
                  value={formData.locationInTerminal.charAt(3)}
                  onChange={handleChange}
                  type="number"
                  className="location-select"
                  id="locationHeight"
                  name="locationHeight"
                  required
                >
                  <option value="">Altura</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
            </div>
            {/*Fin container-location*/}
          </fieldset>
          <button type="submit" disabled={isSubmitDisabled} className="position-button">
            Confirmar posición
          </button>
        </form>

      </div>
    </>
  );
}
export default LocationInTerminal;
