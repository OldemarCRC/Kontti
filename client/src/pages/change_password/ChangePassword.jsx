import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./change_password.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

// User Registration
const ChangePassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // AuthContext Authentication
  const { user, dispatch } = useContext(AuthContext);

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
    toast.success("Password changed successfully!", {
      onClose: () => delay(), // Llama a delay cuando la notificación se cierra
    });
  };

  // Delay time & Navigation
  const delay = () => {
    sessionStorage.removeItem("user"); // Opcional: Limpiar el estado de autenticación local
    navigate("/"); // Redirige al usuario a la página de inicio de sesión
  };

  // User Submit for Password Change
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, newPassword, confirmNewPassword } = formData;
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    try {
      // Replace URL with your API endpoint for changing password
      const response = await axios.put(
        "http://localhost:8800/api/auth/change-password",
        {
          userId: user._id, // Asumiendo que estás almacenando el ID del usuario en AuthContext
          currentPassword: password, // Cambiado de 'password' a 'currentPassword'
          newPassword,
        }
      );
      notify(); // Notificar al usuario sobre el cambio exitoso
      // Limpia el estado local y global de autenticación
      sessionStorage.removeItem("user"); // Limpia el estado de autenticación en sessionStorage
      dispatch({ type: "LOGOUT" }); // Actualiza el estado global para reflejar que el usuario no está autenticado
      setTimeout(() => navigate("/"), 2000); // Redirige al usuario a la página de inicio de sesión después de un breve retraso
    } catch (error) {
      console.log("REQUEST ERROR:", error.response ? error.response : error);
      toast.error("Password change unsuccessful!");
    }
  };

  return (
    <>
      <Header />
      <ToastContainer autoClose={2000} />
      <div className="change-password-container">
        <div className="change-password-form">
          <form onSubmit={handleSubmit}>
            <h5 className="change-password-message">
              Change Password for {user?.username}
            </h5>
            <div className="label-input">
              <label className="form-label" htmlFor="password">
                Current Password
              </label>
              <input
                value={formData.password}
                onChange={handleChange}
                type="password"
                className="form-input"
                placeholder="Current Password"
                id="password"
                name="password"
                required
              />
            </div>
            <div className="label-input">
              <label className="form-label" htmlFor="newPassword">
                New Password
              </label>
              <input
                value={formData.newPassword}
                onChange={handleChange}
                type="password"
                className="form-input"
                placeholder="New Password"
                id="newPassword"
                name="newPassword"
                required
              />
            </div>
            <div className="label-input">
              <label className="form-label" htmlFor="confirmNewPassword">
                Confirm New Password
              </label>
              <input
                value={formData.confirmNewPassword}
                onChange={handleChange}
                type="password"
                className="form-input"
                placeholder="Confirm New Password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                required
              />
            </div>
            <div className="change-password-button">
              <button className="lbtn" type="submit">
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ChangePassword;
