import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../pages/form_register_styles.css"
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

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

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
      createdBy: user.username,
    }));
  };

  const notify = () => {
    toast.success("Transport Company successfully registered!", {
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
        `${process.env.REACT_APP_API_URL}/api/truck-companies/truck-company-register`,
        {
          idType,
          idNumber,
          companyName,
          contactPerson,
          contactPhone,
          contactEmail,
          address,
          createdBy,
        },
        { withCredentials: true }
      );

      notify();

      setFormData(initialFormData);
    } catch (error) {
      console.log(
        "REQUEST ERROR:",
        error.response ? error.response : error
      );
      if (error.response) {
        toast.error(`Registration failed: ${error.response.data.message}`);
      } else {
        toast.error("Registration failed due to an unknown error.");
      }
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else if (user.role === "operator") {
      navigate("/stack-view");
    }
  }, [user, navigate]);

  return (
    <>
      <ToastContainer autoClose={2000} />
      <Header />

      <div className="register-container">
        <div className="register-form">
          <form onSubmit={handleSubmit}>
            <h1>Transport Company Registration</h1>
            <div className="label-input">
              <label className="form-label" htmlFor="idType">
                ID type
              </label>
              <select
                value={formData.idType}
                onChange={handleChange}
                className="form-input"
                placeholder="Select ID type"
                id="idType"
                name="idType"
                required
              >
                <option value="">Selecct ID type</option>
                <option value="TIC">Tax Identification Code</option>
                <option value="NIC">National Identity Card</option>
              </select>
            </div>

            <div className="label-input">
              <label className="form-label" htmlFor="idNumber">
                ID Number
              </label>
              <input
                value={formData.idNumber}
                onChange={handleChange}
                type="text"
                className="form-input"
                placeholder="ID number"
                id="idNumber"
                name="idNumber"
                required
              />
            </div>

            <div className="label-input">
              <label className="form-label" htmlFor="companyName">
                Transport Company Name
              </label>
              <input
                value={formData.companyName}
                onChange={handleChange}
                type="text"
                className="form-input"
                placeholder="Transport Company Name"
                id="companyName"
                name="companyName"
                required
              />
            </div>

            <div className="label-input">
              <label className="form-label" htmlFor="contactPerson">
                Contact name
              </label>
              <input
                value={formData.contactPerson}
                onChange={handleChange}
                type="text"
                className="form-input"
                placeholder="Contact name"
                id="contactPerson"
                name="contactPerson"
                required
              />
            </div>
            <div className="label-input">
              <label className="form-label" htmlFor="contactPhone">
                Phone number
              </label>
              <input
                value={formData.contactPhone}
                onChange={handleChange}
                type="text"
                className="form-input"
                placeholder="Phone number"
                id="contactPhone"
                name="contactPhone"
              />
            </div>
            <div className="label-input">
              <label className="form-label" htmlFor="contactEmail">
                Email
              </label>
              <input
                value={formData.contactEmail}
                onChange={handleChange}
                type="email"
                className="form-input"
                placeholder="Email"
                id="contactEmail"
                name="contactEmail"
              />
            </div>

            <div className="label-input">
              <label className="form-label" htmlFor="address">
                Address
              </label>
              <input
                value={formData.address}
                onChange={handleChange}
                type="text"
                className="form-input"
                placeholder="Address"
                id="address"
                name="address"
              />
            </div>

            <div className="register-button">
              <button className="lbtn" type="submit">
                Submit Registration
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

