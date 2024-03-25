import React from "react";
import "./logo_kontti.css";
import { Link } from "react-router-dom";
import logoKontti from "./kontti_logo.png";


function LogoKontti() {
  return (
    <>
      <Link to="/home">
        <img src={logoKontti} alt="Kontti" className="navbar-logo-kontti" />
      </Link>
    </>
  );
}

export default LogoKontti;