import React from 'react';
import { useNavigate } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-options-container">
        <div className="navbar-option-page" onClick={() => handleNavigate("/in-movements")}>
          <h3 className="navbar-option-text">Ingresos</h3>
        </div>
        <div className="navbar-option-page" onClick={() => handleNavigate("/containers-dispatch")}>
          <h3 className="navbar-option-text">Despachos</h3>
        </div>
        <div className="navbar-option-page" onClick={() => handleNavigate("/out-movements")}>
          <h3 className="navbar-option-text">Salidas</h3>
        </div>
        <div className="navbar-option-page" onClick={() => handleNavigate("/query-page")}>
          <h3 className="navbar-option-text">Consultas</h3>
        </div>
        <div className="navbar-option-page" onClick={() => handleNavigate("/terminal-map")}>
          <h3 className="navbar-option-text">Plano de estibas</h3>
        </div>
        <div className="navbar-option-page" onClick={() => handleNavigate("/data-management")}>
          <h3 className="navbar-option-text">Gestión de datos</h3>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;