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
  const initialFormData = {
    username: "",
    email: "",
    role: "",
    phone: "",
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
    toast.success("¡Registro exitoso, usuario debe verificar su correo!", {
      onClose: () => delay(),
    });
  };

  // Delay time & Navigation
  const delay = () => {
    navigate("/home");
  };

  // User Submit for Registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, role, phone, createdBy } = formData;

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {
        username,
        email,
        role,
        phone,
      });

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
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <>
      <ToastContainer autoClose={2000} />
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
                required
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
                required
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
                required
              >
                <option value="">Selecciona un rol</option>
                <option value="admin">Kontti staff</option>
                <option value="manager">Jefe de planta</option>
                <option value="dispatcher">Personal de oficina logística</option>
                <option value="accounting">Personal de oficina administrativa</option>
                <option value="gate">Chequeador de puerta</option>
                <option value="operator">Operador de stacker</option>
                <option value="externalUser">Agente externo</option>
                <option value="surveyor">Inspector de daños</option>
              </select>
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
