import React from "react";
import "./header.css";
import UserMenu from "../user_menu/UserMenu";
import Navbar from "../navbar/NavBar";
import LogoKontti from "../logos/LogoKontti";


function Header() {
  return (
    <div className="header">
      <LogoKontti />
      <Navbar />
      <UserMenu />
    </div>
  );
}

export default Header;
