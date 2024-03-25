import React from "react";
import "./header.css";
import Navbar from "../navbar/NavBar";
import LogoCustomer from "../logos/LogoCustomer";

function Header() {
  return (
    <div className="header">
      <LogoCustomer />
      <Navbar />
    </div>
  );
}

export default Header;
