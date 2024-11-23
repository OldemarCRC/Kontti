import React from 'react';
import { useNavigate } from 'react-router-dom';
import './navbar.css';

const NavBar = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-options-container">
        <div className="navbar-option-page" onClick={() => handleNavigate("/in-movements")}>
          <h3 className="navbar-option-text">Incomings</h3>
        </div>
        <div className="navbar-option-page" onClick={() => handleNavigate("/containers-dispatch")}>
          <h3 className="navbar-option-text">Dispatches</h3>
        </div>
        <div className="navbar-option-page" onClick={() => handleNavigate("/out-movements")}>
          <h3 className="navbar-option-text">Outgoings</h3>
        </div>
        <div className="navbar-option-page" onClick={() => handleNavigate("/query-page")}>
          <h3 className="navbar-option-text">Queries</h3>
        </div>
        <div className="navbar-option-page" onClick={() => handleNavigate("/stack-view")}>
          <h3 className="navbar-option-text">Stack View</h3>
        </div>
        <div className="navbar-option-page" onClick={() => handleNavigate("/data-management")}>
          <h3 className="navbar-option-text">Data Management</h3>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;