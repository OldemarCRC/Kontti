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

  const dataManagementOptions = [
    { 
      title: "", 
      path: "#",
      className: "customer-register-option"
    },
    { 
      title: "Customer Registration", 
      path: "/customer-register",
      className: "customer-register-option"
    },
    { 
      title: "Transport Company Registration", 
      path: "/truck-co-register",
      className: "truck-register-option"
    },
    { 
      title: "Manifest Registration", 
      path: "/manifest-register",
      className: "customs-nr-register-option"
    },
    { 
      title: "", 
      path: "#",
      className: "customer-register-option"
    },
    { 
      title: "", 
      path: "#",
      className: "customer-register-option"
    },
    { 
      title: "", 
      path: "#",
      className: "customer-register-option"
    },
    { 
      title: "", 
      path: "#",
      className: "customer-register-option"
    },
    { 
      title: "", 
      path: "#",
      className: "customer-register-option"
    },
    { 
      title: "", 
      path: "#",
      className: "customer-register-option"
    },

  ];

  return (
    <div className="data-management-page">
      <Header />
      <div className="data-management-body">
        <h1 className="data-management-header">Data Management</h1>
        <div className="data-management-options">
          {dataManagementOptions.map((option, index) => (
            <div
              key={index}
              className={option.className}
              onClick={() => navigate(option.path)}
            >
              <p>{option.title}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default DataManagement;