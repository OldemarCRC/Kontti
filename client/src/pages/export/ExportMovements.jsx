import React from "react";
/* import * as XLSX from "xlsx"; */
import "./export_movements.css"; 
/* import uploadDataToMongoDB from "../../services/uploadService.js";
import calculateCheckDigit from "../../services/calculateCheckDigit.js"; */
import Footer from  '../../components/footer/Footer';
import Header from "../../components/header/Header";

function ExportMovements() {


  return (
    <>
    <Header />
    <div className="export-movements-container">
      <h2>EXPORT MOVEMENTS</h2>
    </div>
    <Footer />
    </>
  );
}
export default ExportMovements;