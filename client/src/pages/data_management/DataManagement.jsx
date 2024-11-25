import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./data_management.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

function DataManagement() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else if (user.role === "operator") {
      navigate("/stack-view");
    }
  }, [user, navigate]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="data-management-page">
      <Header />
      <div className="data-management-body">
        <h2 className="data-management-header">Data Management</h2>

        <div className="data-management-options">
          <div
            className="customer-register-option"
            onClick={() => handleNavigate("/customer-register")}
          >
            <p>Customer Registration</p>
          </div>
          <div
            className="truck-register-option"
            onClick={() => handleNavigate("/truck-co-register")}
          >
            <p>Transport Company Registration</p>
          </div>
          <div
            className="customs-nr-register-option"
            onClick={() => handleNavigate("/manifest-register")}
          >
            <p>Manifest Registration</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

const OptionCard = ({ title, onClick }) => (
  <div className="option-page" onClick={onClick}>
    <h3 className="option-text">{title}</h3>
  </div>
);

export default DataManagement;