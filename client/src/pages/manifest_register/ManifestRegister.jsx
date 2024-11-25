import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../pages/form_register_styles.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

const ManifestRegister = () => {
  const initialFormData = {
    manifestNumber: "",
    motorVessel: "",
    voyageNumber: "",
    date: "",
    time: "",
    transportMode: "",
    manifestType: "",
    customsLocationCode: "",
    createdBy: "",
  };

  const [currentDateTime, setCurrentDateTime] = useState({
    currentDate: "",
    currentTime: "",
  });

  const [formData, setFormData] = useState(initialFormData);
  const token = sessionStorage.getItem("userToken");
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
    toast.success("Manifest successfully registered!", {
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
      if (!token) {
        console.error("No token found in sessionStorage");
        return;
      }
      console.log(dataToUpload);
      await axios.post(
        `${process.env.REACT_APP_API_URL}/manifest/manifest-register`,
        dataToUpload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      notify();
      setFormData(initialFormData);
    } catch (error) {
      console.log(
        "REQUEST ERROR:",
        error.response ? error.response : error
      );
      toast.error("Registration failed!");
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else if (user.role === "operator") {
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
            <h1>Manifest Registration</h1>
            <div className="label-input">
              <label className="form-label" htmlFor="manifestNumber">
                Manifest number
              </label>
              <input
                value={formData.manifestNumber}
                onChange={handleChange}
                type="text"
                className="form-input"
                placeholder="Manifest number"
                id="manifestNumber"
                name="manifestNumber"
                required
              />
            </div>
            <div className="label-input">
              <label className="form-label" htmlFor="motorVessel">
                Motor Vessel Name
              </label>
              <input
                value={formData.motorVessel}
                onChange={handleChange}
                type="text"
                className="form-input"
                placeholder="Motor Vessel name"
                id="motorVessel"
                name="motorVessel"
                required
              />
            </div>
            <div className="label-input">
              <label className="form-label" htmlFor="voyageNumber">
                Voyage number
              </label>
              <input
                value={formData.voyageNumber}
                onChange={handleChange}
                type="text"
                className="form-input"
                placeholder="Voyage number"
                id="voyageNumber"
                name="voyageNumber"
                required
              />
            </div>
            <div className="label-input">
              <label className="form-label" htmlFor="date">
                Official Arrival Date
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
                Official Arrival Time
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
                Transport Mode
              </label>
              <select
                id="transportMode"
                name="transportMode"
                className="form-input"
                value={formData.transportMode}
                onChange={handleChange}
                required
              >
                <option value="">Select transport mode</option>
                <option value="Maritime">Maritime Transport Mode</option>
                <option value="Air">Air Transport Mode</option>
                <option value="Inland">Land Transport Mode</option>
              </select>
            </div>
            <div className="label-input">
              <label className="form-label" htmlFor="manifestType">
                Manifest type
              </label>
              <select
                id="manifestType"
                name="manifestType"
                className="form-input"
                value={formData.manifestType}
                onChange={handleChange}
                required
              >
                <option value="">Select manifest type</option>
                <option value="in">Import</option>
                <option value="out">Export</option>
              </select>
            </div>
            <div className="label-input">
              <label className="form-label" htmlFor="customsLocationCode">
                Location
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

export default ManifestRegister;
