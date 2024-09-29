import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./truck_co_register.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

// Truck company registration
const TruckCoRegister = () => {
  const initialFormData = {
    idType: "",
    idNumber: "",
    companyName: "",
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    address: "",
    createdBy: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  // AuthContext Authentication
  const { user } = useContext(AuthContext);

  // Navigation
  const navigate = useNavigate();

  // Handling changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
      createdBy: user.username,
    }));
  };

  const notify = () => {
    toast.success("¡Cliente registrado exitosamente!", {
      onClose: () => delay(),
    });
  };


  const delay = () => {
    navigate("/home");
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      idType,
      idNumber,
      companyName,
      contactPerson,
      contactPhone,
      contactEmail,
      address,
      createdBy
    } = formData;
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/truck-companies/truck-company-register`,
        {
            idType,
            idNumber,
            companyName,
            contactPerson,
            contactPhone,
            contactEmail,
            address,
            createdBy,
        }
      );

      notify();

      // Limpiar el formulario después del registro exitoso
      setFormData(initialFormData);
    } catch (error) {
      console.log(
        "ERROR EN LA SOLICITUD:",
        error.response ? error.response : error
      );
      toast.error("¡Registro fallido!");
    }
  };

  // Verifica si el usuario ha iniciado sesión al montar el componente y cada vez que el valor de 'user' cambie
  useEffect(() => {
    if (!user) {
      navigate("/"); // Ajusta esta ruta según sea necesario
    }
  }, [user, navigate]); // Incluye 'navigate' en la lista de dependencias para evitar advertencias

  return (
    <>
    <ToastContainer autoClose={2000} />
      <Header />

      <div className="register-container">
        <div className="register-form">
          <form onSubmit={handleSubmit}>
            <h5 className="register-message">REGISTRAR EMPRESA TRANSPORTISTA</h5>

            <div className="label-input">
              <label className="form-label" htmlFor="idType">
              Tipo de identificación
              </label>
              <select
                value={formData.idType}
                onChange={handleChange}
                className="form-input"
                placeholder="Selecciona el tipo de identificación"
                id="idType"
                name="idType"
                required
              >
                <option value="">Selecciona el tipo de identificación</option>
                <option value="J">Jurídica</option>
                <option value="F">Física</option>
              </select>
            </div>

            <div className="label-input">
              <label className="form-label" htmlFor="idNumber">
                Número de identificación
              </label>
              <input
                value={formData.idNumber}
                onChange={handleChange}
                type="text"
                className="form-input"
                placeholder="Número de identificación"
                id="idNumber"
                name="idNumber"
                required
              />
            </div>

            <div className="label-input">
              <label className="form-label" htmlFor="companyName">
                Nombre del transportista
              </label>
              <input
                value={formData.companyName}
                onChange={handleChange}
                type="text"
                className="form-input"
                placeholder="Nombre de empresa transportista"
                id="companyName"
                name="companyName"
                required
              />
            </div>

            <div className="label-input">
              <label className="form-label" htmlFor="contactPerson">
                Nombre del contacto
              </label>
              <input
                value={formData.contactPerson}
                onChange={handleChange}
                type="text"
                className="form-input"
                placeholder="Contacto"
                id="contactPerson"
                name="contactPerson"
                required
              />
            </div>

            <div className="label-input">
              <label className="form-label" htmlFor="contactPhone">
                Número de teléfono del contacto
              </label>
              <input
                value={formData.contactPhone}
                onChange={handleChange}
                type="text"
                className="form-input"
                placeholder="Teléfono de contacto"
                id="contactPhone"
                name="contactPhone"
              />
            </div>

            <div className="label-input">
              <label className="form-label" htmlFor="contactEmail">
                Correo electrónico del contacto
              </label>
              <input
                value={formData.contactEmail}
                onChange={handleChange}
                type="email"
                className="form-input"
                placeholder="correo electrónico"
                id="contactEmail"
                name="contactEmail"
              />
            </div>

            <div className="label-input">
              <label className="form-label" htmlFor="address">
                Dirección
              </label>
              <input
                value={formData.address}
                onChange={handleChange}
                type="text"
                className="form-input"
                placeholder="Dirección"
                id="address"
                name="address"
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

export default TruckCoRegister;

