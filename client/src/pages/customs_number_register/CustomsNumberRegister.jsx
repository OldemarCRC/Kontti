import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../pages/form_register_styles.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

const CustomsNumberRegister = () => {
  const initialFormData = {
    customsNumber: "",
    motorVessel: "",
    voyageNumber: "",
    date: "",
    time: "",
    transportMode: "",
    customsManifestType: "",
    customsLocationCode: "",
    createdBy: "",
  };

  const [currentDateTime, setCurrentDateTime] = useState({
    currentDate: "",
    currentTime: "",
  });

  const [formData, setFormData] = useState(initialFormData);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const notify = () => {
    toast.success("¡Manifiesto registrado exitosamente!", {
      onClose: () => navigate("/home"),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dateTime = new Date(
      `${formData.date}T${formData.time}`
    ).toISOString();

    const dataToUpload = {
      ...formData,
      officialArrivalDate: dateTime,
      createdBy: user.username,
    };

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/customs-manifest/manifest-register`,
        dataToUpload
      );

      notify();
      setFormData(initialFormData);
    } catch (error) {
      console.log(
        "ERROR EN LA SOLICITUD:",
        error.response ? error.response : error
      );
      toast.error("¡Registro fallido!");
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    }else if(user.role === "operator") {
      navigate("/stack-view");
    }
    const now = new Date();
    setCurrentDateTime({
      currentDate: now.toISOString().split("T")[0],
      currentTime: now.toTimeString().split(" ")[0].slice(0, 5),
    });
  }, [user, navigate]);

  return (
    <>
      <ToastContainer autoClose={2000} />
      <Header />

      <div className="register-container">
        <div className="register-form">
          <form onSubmit={handleSubmit}>
            <h1>Registrar manifiesto de aduana</h1>

            <div className="label-input">
              <label className="form-label" htmlFor="customsNumber">
                Número de manifiesto
              </label>
              <input
                value={formData.customsNumber}
                onChange={handleChange}
                type="text"
                className="form-input"
                placeholder="Número de manifiesto"
                id="customsNumber"
                name="customsNumber"
                required
              />
            </div>

            <div className="label-input">
              <label className="form-label" htmlFor="motorVessel">
                Nombre del barco
              </label>
              <input
                value={formData.motorVessel}
                onChange={handleChange}
                type="text"
                className="form-input"
                placeholder="Nombre del barco"
                id="motorVessel"
                name="motorVessel"
                required
              />
            </div>

            <div className="label-input">
              <label className="form-label" htmlFor="voyageNumber">
                Viaje
              </label>
              <input
                value={formData.voyageNumber}
                onChange={handleChange}
                type="text"
                className="form-input"
                placeholder="Viaje"
                id="voyageNumber"
                name="voyageNumber"
                required
              />
            </div>

            <div className="label-input">
              <label className="form-label" htmlFor="date">
                Fecha de arribo oficial
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="form-input"
                id="date"
                name="date"
                max={currentDateTime.currentDate}
                required
              />
            </div>

            <div className="label-input">
              <label className="form-label" htmlFor="time">
                Hora de arribo oficial
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={handleChange}
                className="form-input"
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

            <div className="label-input">
              <label className="form-label" htmlFor="transportMode">
                Modalidad de transporte
              </label>
              <select
                id="transportMode"
                name="transportMode"
                className="form-input"
                value={formData.transportMode}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un tipo</option>
                <option value="Maritime">Marítimo</option>
                <option value="Air">Aéreo</option>
                <option value="Inland">Terrestre</option>
              </select>
            </div>

            <div className="label-input">
              <label className="form-label" htmlFor="customsManifestType">
                Tipo de manifiesto
              </label>
              <select
                id="customsManifestType"
                name="customsManifestType"
                className="form-input"
                value={formData.customsManifestType}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un tipo</option>
                <option value="in">Ingreso</option>
                <option value="out">Salida</option>
              </select>
            </div>

            <div className="label-input">
              <label className="form-label" htmlFor="customsLocationCode">
                Ubicación
              </label>
              <input
                value={formData.customsLocationCode}
                onChange={handleChange}
                type="text"
                className="form-input"
                placeholder="Ubicación"
                id="customsLocationCode"
                name="customsLocationCode"
                required
              />
            </div>

            <div className="register-button">
              <button className="lbtn" type="submit">
                Registrar
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CustomsNumberRegister;
