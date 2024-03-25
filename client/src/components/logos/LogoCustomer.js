import React from "react";
import "./logo_customer.css";
import { Link } from "react-router-dom";

const logoImage = "https://www.grupodelsol.cr/Imagenes/logos/Decaprom_logosinfondo.png";
function LogoCustomer() {
  return (
    <>
      <Link to="/home">
        <img src={logoImage} alt="Decaprom" className="navbar-logo" />
      </Link>
    </>
  );
}

export default LogoCustomer;
