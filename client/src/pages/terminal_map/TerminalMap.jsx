import React from 'react';
import './terminal_map.css';
import Footer from "../../components/footer/Footer.js";
import Header from "../../components/header/Header.js";

function TerminalMap() {
  return (
    <>
    <Header />
    <div className="container">
      <div className="contenedor">
        <div className="cara"></div>
        <div className="lado"></div>
        <div className="top"></div>
      </div>
    </div>
    <Footer />
    </>
    
  );
}

export default TerminalMap;
