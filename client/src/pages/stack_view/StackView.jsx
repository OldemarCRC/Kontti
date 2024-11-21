import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { toast } from "react-toastify";
import { fetchInventory } from "../../services/fetchInventory.js";
import { updateContainerLocation } from "../../services/uploadService.js";
import "./stack_view_copilot.css";
import Footer from "../../components/footer/Footer.js";
import Header from "../../components/header/Header.js";

const zones = [
  { id: "A", stacks: [7, 6, 5, 4, 3, 2, 1] },
  { id: "B", stacks: [7, 6, 5, 4, 3, 2, 1] },
  { id: "C", stacks: [8, 7, 6, 5, 4, 3, 2, 1] },
];

function StackView() {
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("userToken");

  const loadInventory = async () => {
    setIsLoading(true);
    try {
      if (!token) {
        console.error("No token found in sessionStorage");
        return;
      }
      const inventoryData = await fetchInventory(token);
      setInventory(inventoryData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setIsLoading(false);
    }
  };


  const [filteredInventory, setFilteredInventory] = useState([]);
  const [selectedContainer, setSelectedContainer] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [formData, setFormData] = useState({
    containerNumber: "",
    locationInTerminal: "",
  });

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSelectedContainer(value);

    const filteredData = inventory.filter((container) =>
      container.containerNumber.startsWith(value.toUpperCase())
    );
    setFilteredInventory(filteredData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

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

  useEffect(() => {
    const checkPositionInInventory = () => {
      const currentPosition = formData.locationInTerminal;

      if (currentPosition.length === 4) {
        const exists = inventory.some(
          (container) => container.locationInTerminal === currentPosition
        );
        setIsSubmitDisabled(exists);
        if (exists) {
          alert(
            "The specified position is already occupied by another container."
          );
        }
      } else {
        setIsSubmitDisabled(true);
      }
    };
    checkPositionInInventory();
  }, [formData.locationInTerminal, inventory]);

  useEffect(() => {
    loadInventory();
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const [selectedStack, setSelectedStack] = useState("INITIAL_VIEW");

  const countContainersInStack = (zoneId, stackNumber) => {
    return inventory.filter(
      (container) =>
        container.locationInTerminal &&
        container.locationInTerminal.startsWith(`${zoneId}${stackNumber}`)
    ).length;
  };

  const containersWithoutPosition = inventory.filter(
    (container) =>
      !container.locationInTerminal ||
      container.locationInTerminal.trim() === ""
  );

  const columnsAtoB = ["A", "B", "C", "D", "E"];
  const columnsC = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const heights = [/* 6, 5, */ 4, 3, 2, 1];

  const findContainerByLocation = (location) => {
    return inventory.find(
      (container) => container.locationInTerminal === location
    );
  };

  const renderInitialStackView = () => (
    <div className="stack-view">
      {columnsAtoB.map((column) => (
        <div className="column" key={column}>
          {heights.map((height) => (
            <div className="empty-slot" key={`${column}${height}`}>
              Empty
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.containerNumber) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        containerNumber: selectedContainer,
      }));
    }
    handleUpload();
  };

  const handleUpload = async () => {
    console.log("handleUpload 1");
    const dataToUpload = {
      ...formData,
    };
    console.log("handleUpload 2", dataToUpload);
    try {
      if (!token) {
        console.error("No token found in sessionStorage");
        return;
      }
      await updateContainerLocation(token, dataToUpload);
      toast.success("Position updated!", { autoClose: 5000 });
      setFormData({
        containerNumber: "",
        locationInTerminal: "",
      });
      loadInventory();
    } catch (error) {
      toast.error(error.message, { autoClose: 5000 });
    }
  };

  const handleContainerSelection = (containerNumber) => {
    setSelectedContainer(containerNumber);
    setFormData((prevFormData) => ({
      ...prevFormData,
      containerNumber: containerNumber,
    }));
  };

  return (
    <>
      <Header />
      <>
          <div className="terminal-stack-view">
            <div className="zones-container">
              {zones.map((zone) => (
                <div
                  key={zone.id}
                  className={`zone zone-${zone.id.toLowerCase()}`}
                >
                  {zone.stacks.map((stack) => {
                    const containerCount = countContainersInStack(zone.id, stack);
                    return (
                      <div
                        key={`${zone.id}${stack}`}
                        className="stack"
                        onClick={() => setSelectedStack(`${zone.id}${stack}`)}
                      >
                        {`${zone.id}${stack} (${containerCount} cont)`}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="containers-without-position">
              {containersWithoutPosition.length > 0 ? (
                <>
                  <button onClick={loadInventory} disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update misplaced"}
                  </button>
                  <h4>List of containers without location in the system</h4>
                  <ol>
                    {containersWithoutPosition.map((container) => (
                      <li key={container.containerNumber}>
                        {container.containerNumber}
                      </li>
                    ))}
                  </ol>
                </>
              ) : (
                <>
                  <button onClick={loadInventory} disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update misplaced"}
                  </button>
                  <p>All containers have a position in the system.</p>
                </>
              )}
            </div>
            <form className="location-form" onSubmit={handleSubmit}>
              <fieldset>
                <legend>Update position</legend>
                <div>
                  <label htmlFor="containerSearch">Container number:</label>
                  <input
                    id="containerSearch"
                    type="text"
                    value={selectedContainer}
                    onChange={handleSearchChange}
                    autoComplete="off"
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
                    <label
                      htmlFor="locationZone"
                      className="in-movement-label"
                    >
                      Zone
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
                      <option value="">Zone</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      {/* <option value="M">M</option>
                  <option value="T">T</option> */}
                      {/* <option value=""></option> */}
                    </select>
                  </div>
                  <div className="container-location-item">
                    <label
                      htmlFor="locationStack"
                      className="in-movement-label"
                    >
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
                    <label
                      htmlFor="locationColumn"
                      className="in-movement-label"
                    >
                      Column
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
                      <option value="">Column</option>
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
                    <label
                      htmlFor="locationHeight"
                      className="in-movement-label"
                    >
                      Height
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
                      <option value="">Height</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>
                </div>
              </fieldset>
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="position-button"
              >
                Confirm position
              </button>
            </form>
            {/*Fin container-location*/}
            {selectedStack && (
              <div className="stack-details">
                {selectedStack === "INITIAL_VIEW"
                  ? renderInitialStackView()
                  : selectedStack && (
                    <div className="stack-view">
                      {(selectedStack.startsWith("C")
                        ? columnsC
                        : columnsAtoB
                      ).map((column) => (
                        <div className="column" key={column}>
                          {heights.map((height) => {
                            const location = `${selectedStack}${column}${height}`;
                            const container = findContainerByLocation(location);
                            return (
                              <div
                                className={`${container ? "height" : "empty-slot"
                                  }`}
                                key={`${column}${height}`}
                              >
                                {container ? (
                                  <>
                                    {container.containerNumber} {/*-{" "}
                                    {container.portOfDestination} -{" "}
                                    {container.exportVessel} */}
                                  </>
                                ) : (
                                  "Empty"
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  )}
                <div className="stack-title">Stack {selectedStack}</div>
              </div>
            )}
          </div>
      </>
      <Footer />
    </>
  );
}

export default StackView;