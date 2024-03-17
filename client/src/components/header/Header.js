import React from "react";
import "./header.css";
import Navbar from "../navbar/NavBar";

function Header({ type }) {
  return (
    <header className="header">
      <Navbar />
      {/* <img
        className="header-img"
        src="https://www.grupodelsol.cr/Imagenes/logos/Decaprom_logosinfondo.png"
        alt="Logo"
      ></img> */}
      
       
         {/* <h2>Sea Container LedgerHub</h2> */}
      
    </header>
  );
}

export default Header;
