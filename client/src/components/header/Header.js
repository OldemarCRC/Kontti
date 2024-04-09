import React from "react";
import "./header.css";
import Navbar from "../navbar/NavBar";
import LogoKontti from "../logos/LogoKontti";


function Header() {
  return (
    <div className="header">
      <LogoKontti />
      <Navbar />
    </div>
  );
}

export default Header;
