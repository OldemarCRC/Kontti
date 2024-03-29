import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "./location_in_terminal.css";
import { fetchContainers } from "../../services/fetchInventory.js"; // Asegúrate de importar correctamente
import { updateContainerLocation } from "../../services/uploadService.js";
import Header from "../../components/header/Header.js";

function LocationInTerminal() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // Utiliza useNavigate para la redirección
  const [isUploading, setIsUploading] = useState(false);
  const [inventory, setInventory] = useState([]); // Nuevo estado para almacenar el inventario
  // Estado para manejar el filtro de contenedores
  const [filteredInventory, setFilteredInventory] = useState([]);
  // Estado para el número de contenedor seleccionado
  const [selectedContainer, setSelectedContainer] = useState("");

  const [formData, setFormData] = useState({
    containerNumber: "",
    locationInTerminal: "",
  });

  // Verifica si el usuario ha iniciado sesión al montar el componente y cada vez que el valor de 'user' cambie
  useEffect(() => {
    if (!user) {
      // Si 'user' es null o undefined, redirige al inicio de sesión o a cualquier otra página
      navigate("/"); // Ajusta esta ruta según sea necesario
    }
  }, [user, navigate]); // Incluye 'navigate' en la lista de dependencias para evitar advertencias

  // Carga el inventario al montar el componente
  useEffect(() => {
    const loadInventory = async () => {
      const inventoryData = await fetchContainers();
      setInventory(inventoryData);
    };

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

  const handleNavigate = (path) => {
    navigate(path);
  };

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
    setIsUploading(true);

    const dataToUpload = {
      ...formData,
    };

    try {
      const result = await updateContainerLocation(dataToUpload);
      toast.success("¡Posición actualizada!", { autoClose: 5000 });
      // Restablecer el formulario a su estado inicial aquí
      setFormData({
        containerNumber: "",
        locationInTerminal: "",
      });
    } catch (error) {
      toast.error(error.message, { autoClose: 5000 });
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
      <div className="location-container">
        <div className="location-header">
          <h2>POSICIÓN DEL CONTENEDOR EN LA TERMINAL</h2>
        </div>

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
                  <option value="M">M</option>
                  <option value="T">T</option>
                  <option value=""></option>
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
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="6">7</option>
                  <option value="6">8</option>
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
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                  <option value="G">G</option>
                  <option value="H">H</option>
                  <option value="I">I</option>
                  <option value="J">J</option>
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
          <button type="submit" className="position-button">
            Confirmar posición
          </button>
        </form>
      </div>
    </>
  );
}
export default LocationInTerminal;

/* locationInTerminal: {
    type: {
      zone: String,
      stack: Number,
      column: String,
      height: Number,
    },
    required: false,
  }, */
