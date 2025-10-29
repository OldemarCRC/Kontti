import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./change_password.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";


const ChangePassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);


  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const notify = () => {
    toast.success("Password changed successfully!", {
      onClose: () => delay(),
    });
  };

  const delay = () => {
    sessionStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user?.role === "demo") {
      toast.info("Demo user cannot change the password in this version.");
      return;
    }

    const { password, newPassword, confirmNewPassword } = formData;
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    try {
      await axios.put(
        `${process.env.VITE_API_URL}/api/auth/change-password`,
        {
          userId: user._id,
          currentPassword: password,
          newPassword,
        },
        { withCredentials: true }
      );
      notify();
    } catch (error) {
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        console.log("REQUEST ERROR:", error.response);
        toast.error(`Error ${error.response.status}: ${error.response.data.message || "Password change unsuccessful!"}`);
      } else if (error.request) {
        // La solicitud se envió pero no se recibió respuesta
        console.log("REQUEST ERROR: No response received", error.request);
        toast.error("No response from the server. Please try again later.");
      } else {
        // Algo pasó al configurar la solicitud que desencadenó un error
        console.log("REQUEST ERROR: General error", error.message);
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <>
      <Header />
      <div className="change-password-container">
        <div className="change-password-form">
          <form onSubmit={handleSubmit}>
            <h4 className="change-password-text">
              Change password for:
            </h4>
            <p className="change-password-text">{user?.username}</p>
            <div className="label-input">
              <label className="form-label" htmlFor="password">
                Current password
              </label>
              <input
                value={formData.password}
                onChange={handleChange}
                type="password"
                className="form-input"
                placeholder="Current password"
                id="password"
                name="password"
                required
              />
            </div>
            <div className="label-input">
              <label className="form-label" htmlFor="newPassword">
                New password
              </label>
              <input
                value={formData.newPassword}
                onChange={handleChange}
                type="password"
                className="form-input"
                placeholder="New password"
                id="newPassword"
                name="newPassword"
                required
              />
            </div>
            <div className="label-input">
              <label className="form-label" htmlFor="confirmNewPassword">
                Confirm new password
              </label>
              <input
                value={formData.confirmNewPassword}
                onChange={handleChange}
                type="password"
                className="form-input"
                placeholder="Confirm new password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                required
              />
            </div>
            <div className="change-password-button">
              <button className="lbtn" type="submit"
                disabled={user?.role === "demo"}
                style={{
                  cursor: user?.role === "demo" ? "not-allowed" : "pointer",
                  opacity: user?.role === "demo" ? 0.6 : 1,
                }}>
                Confirm password change
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default ChangePassword;
