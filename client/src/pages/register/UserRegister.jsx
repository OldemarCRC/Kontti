import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./user_register.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

// User Registration
const UserRegister = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    phone: "",
  });

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

  // Notifying if registration was Successful
  const notify = () => {
    toast.success("¡Registro exitoso, usuario debe verificar su correo!");
  };

  // User Submit for Regisration
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword, role, phone } =
      formData;
    if (password !== confirmPassword) {
      toast.error("¡Las contraseñas no concuerdan!");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/register`,
        {
          username,
          email,
          password,
          role,
          phone,
        }
      );
      console.log("RESPUESTA DEL SERVIDOR:", response);
      /* dispatch({type: "LOGIN_SUCCESS", payload: response.data.details}); */
      notify();
      /* setTimeout(delay, 2000); */
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
    if (!user || user.role !== "manager") {
      navigate("/"); // Ajusta esta ruta según sea necesario
    }
  }, [user, navigate]);  // Incluye 'navigate' en la lista de dependencias para evitar advertencias

  return (
    <>
      <Header />
      
      <div className="register-container">
        <div className="register-form">
          <form onSubmit={handleSubmit}>
            <h5 className="register-message">Registrar usuario</h5>
            <div className="label-input">
              <label className="form-label" htmlFor="username">
                Nombre de usuario
              </label>
              <input
                value={formData.username}
                onChange={handleChange}
                type="text"
                className="form-input"
                placeholder="Nombre de usuario"
                id="username"
                name="username"
              />
            </div>
            <div className="label-input">
              <label className="form-label" htmlFor="email">
                Correo electrónico
              </label>
              <input
                value={formData.email}
                onChange={handleChange}
                type="email"
                className="form-input"
                placeholder="correo electrónico"
                id="email"
                name="email"
              />
            </div>
            <div className="label-input">
              <label className="form-label" htmlFor="email">
                Rol del usuario
              </label>
              <select
                value={formData.role}
                onChange={handleChange}
                className="form-input"
                id="role"
                name="role"
              >
                <option value="">Selecciona un rol</option>
                <option value="dispatcher">Personal de oficina</option>
                <option value="gate">Chequeador de puerta</option>
                <option value="operator">Operador de stacker</option>
                <option value="externalUser">Agente externo</option>
                <option value="surveyor">Inspector de daños</option>
              </select>
              {/* ["admin", "manager", "dispatcher", "operator", "externalUser", "gate","surveyor"] */}
              {/*  <input
                value={formData.role}
                onChange={handleChange}
                type="text"
                className="form-input"
                placeholder="Rol de trabajo"
                id="role"
                name="role"
              /> */}
            </div>
            <div className="label-input">
              <label className="form-label" htmlFor="email">
                Teléfono
              </label>
              <input
                value={formData.phone}
                onChange={handleChange}
                type="text"
                className="form-input"
                placeholder="Número de teléfono"
                id="phone"
                name="phone"
              />
            </div>
            <div className="label-input">
              <label className="form-label" htmlFor="password">
                Contraseña
              </label>
              <input
                value={formData.password}
                onChange={handleChange}
                type="password"
                className="form-input"
                placeholder="Contraseña"
                id="password"
                name="password"
              />
            </div>
            <div className="label-input">
              <label className="form-label" htmlFor="confirmPassword">
                Confirmar contraseña
              </label>
              <input
                value={formData.confirmPassword}
                onChange={handleChange}
                type="password"
                className="form-input"
                placeholder="Confirmar contraseña"
                id="confirmPassword"
                name="confirmPassword"
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

export default UserRegister;
