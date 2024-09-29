import React, { useContext, useState, useEffect } from "react";
import { useNavigate} from "react-router-dom";
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


  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

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
    sessionStorage.removeItem("user"); 
    dispatch({ type: "LOGOUT" }); 
    navigate("/"); 
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
      
      await axios.put(
        `${process.env.REACT_APP_API_URL}/auth/change-password`,
        {
          userId: user._id,
          currentPassword: password,
          newPassword,
        }
      );
      notify(); // Notificar al usuario sobre el cambio exitoso
    } catch (error) {
      console.log("REQUEST ERROR:", error.response ? error.response : error);
      toast.error("Password change unsuccessful!");
    }
  };

  return (
    <>
      <Header />
      
      <div className="change-password-container">
        <div className="change-password-form">
          <form onSubmit={handleSubmit}>
            <h5 className="change-password-message">
              Cambiar contraseña para: {user?.username}
            </h5>
            <div className="label-input">
              <label className="form-label" htmlFor="password">
                Contraseña actual
              </label>
              <input
                value={formData.password}
                onChange={handleChange}
                type="password"
                className="form-input"
                placeholder="Contraseña actual"
                id="password"
                name="password"
                required
              />
            </div>
            <div className="label-input">
              <label className="form-label" htmlFor="newPassword">
                Nueva contraseña
              </label>
              <input
                value={formData.newPassword}
                onChange={handleChange}
                type="password"
                className="form-input"
                placeholder="Nueva contraseña"
                id="newPassword"
                name="newPassword"
                required
              />
            </div>
            <div className="label-input">
              <label className="form-label" htmlFor="confirmNewPassword">
                Confirmar nueva contraseña
              </label>
              <input
                value={formData.confirmNewPassword}
                onChange={handleChange}
                type="password"
                className="form-input"
                placeholder="Confirmar nueva contraseña"
                id="confirmNewPassword"
                name="confirmNewPassword"
                required
              />
            </div>
            <div className="change-password-button">
              <button className="lbtn" type="submit">
                Cambiar contraseña
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
