import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../pages/form_register_styles.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

// Customer Registration
const CustomerRegister = () => {
  const initialFormData = {
    idType: "",
    idNumber: "",
    customerName: "",
    customerAddress: "",
    customerContact: "",
    customerEmail: "",
    customerPhoneNumber: "",
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
    }));
  };

  const notify = () => {
    toast.success("¡Cliente registrado exitosamente!", {
      onClose: () => delay(), // Llama a delay cuando la notificación se cierra
    });
  };

  // Delay time & Navigation
  const delay = () => {
    navigate("/home"); // Redirige al usuario a la página home
  };

  // User Submit for Registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      idType,
      idNumber,
      customerName,
      customerAddress,
      customerContact,
      customerEmail,
      customerPhoneNumber,
      createdBy,
    } = formData;
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/customers/customer-register`,
        {
          idType,
          idNumber,
          customerName,
          customerAddress,
          customerContact,
          customerEmail,
          customerPhoneNumber,
          createdBy: user.username,
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
            <h1>Registrar cliente</h1>
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
              <label className="form-label" htmlFor="customerName">
                Nombre del cliente
              </label>
              <input
                value={formData.customerName}
                onChange={handleChange}
                type="text"
                className="form-input"
                placeholder="Nombre del cliente"
                id="customerName"
                name="customerName"
                required
              />
            </div>

            <div className="label-input">
              <label className="form-label" htmlFor="customerAddress">
                Dirección
              </label>
              <input
                value={formData.customerAddress}
                onChange={handleChange}
                type="text"
                className="form-input"
                placeholder="Dirección"
                id="customerAddress"
                name="customerAddress"
                required
              />
            </div>

            <div className="label-input">
              <label className="form-label" htmlFor="customerContact">
                Contacto
              </label>
              <input
                value={formData.customerContact}
                onChange={handleChange}
                type="text"
                className="form-input"
                placeholder="Contacto"
                id="customerContact"
                name="customerContact"
              />
            </div>

            <div className="label-input">
              <label className="form-label" htmlFor="customerEmail">
                Correo electrónico
              </label>
              <input
                value={formData.customerEmail}
                onChange={handleChange}
                type="email"
                className="form-input"
                placeholder="correo electrónico"
                id="customerEmail"
                name="customerEmail"
              />
            </div>

            <div className="label-input">
              <label className="form-label" htmlFor="customerPhoneNumber">
                Teléfono
              </label>
              <input
                value={formData.customerPhoneNumber}
                onChange={handleChange}
                type="text"
                className="form-input"
                placeholder="Número de teléfono"
                id="customerPhoneNumber"
                name="customerPhoneNumber"
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

export default CustomerRegister;
