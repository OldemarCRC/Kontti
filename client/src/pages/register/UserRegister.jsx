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
    fullName: "",
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
    toast.success("Registration successful, user must verify their email!", {
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

    const token = sessionStorage.getItem("userToken");
    if (!token) {
      console.error("No token found in sessionStorage");
      return;
    }

    const { username, fullName, email, role, phone, createdBy } = formData;
    const payload = { username, fullName, email, role, phone, createdBy };
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/register`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      notify();
      // Limpiar el formulario después del registro exitoso
      setFormData(initialFormData);
    } catch (error) {
      console.log(
        "ERROR IN THE REQUEST:",
        error.response ? error.response : error
      );
      toast.error("Registration failed!");
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
            <h5 className="register-message">Register user</h5>
            <div className="label-input">
              <label className="form-label" htmlFor="fullName">
              User's full name
              </label>
              <input
                value={formData.fullName}
                onChange={handleChange}
                type="text"
                className="form-input"
                placeholder="User´s full name"
                id="fullName"
                name="fullName"
                required
              />
            </div>
            <div className="label-input">
              <label className="form-label" htmlFor="username">
              User name
              </label>
              <input
                value={formData.username}
                onChange={handleChange}
                type="text"
                className="form-input"
                placeholder="User name"
                id="username"
                name="username"
                required
              />
            </div>
            <div className="label-input">
              <label className="form-label" htmlFor="email">
              Email
              </label>
              <input
                value={formData.email}
                onChange={handleChange}
                type="email"
                className="form-input"
                placeholder="Email"
                id="email"
                name="email"
                required
              />
            </div>
            <div className="label-input">
              <label className="form-label" htmlFor="email">
              User role
              </label>
              <select
                value={formData.role}
                onChange={handleChange}
                className="form-input"
                id="role"
                name="role"
                required
              >
                <option value="">Select a role</option>
                <option value="admin">Kontti staff</option>
                <option value="manager">Container terminal manager</option>
                <option value="dispatcher">Logistic´s assistant</option>
                <option value="gate">Gate talli</option>
                <option value="operator">Stacker operator</option>
                <option value="externalUser">External user</option>
                <option value="surveyor">Container surveyor</option>
              </select>
            </div>
            <div className="label-input">
              <label className="form-label" htmlFor="email">
                Phone
              </label>
              <input
                value={formData.phone}
                onChange={handleChange}
                type="text"
                className="form-input"
                placeholder="Phone´s number"
                id="phone"
                name="phone"
              />
            </div>

            <div className="register-button">
              <button className="lbtn" type="submit">
                Register
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
