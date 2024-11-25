import React, { useState } from "react";
import "./header.css";
import UserMenu from "../user_menu/UserMenu";
import NavBar from "../navbar/NavBar";
import LogoKontti from "../logos/LogoKontti";

function Header() {
  const [isNavVisible, setIsNavVisible] = useState(false);

  const toggleNav = () => {
    setIsNavVisible(!isNavVisible);
  };

  return (
    <div className="header">
      <div className="header-content">
        <LogoKontti />
        <div className={`nav-container ${isNavVisible ? 'nav-visible' : ''}`}>
          <NavBar />
        </div>
        <UserMenu className="user-menu" />
        <button className="nav-toggle" onClick={toggleNav}>
          ☰
        </button>
      </div>
    </div>
  );
}

export default Header;
