import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom"; // Importa useNavigate
import { AuthContext } from "../../context/AuthContext";
import "./home.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import import_img from "./images/import.png";
import triton_logo from "./images/Triton.png";
import export_img from "./images/export.png";
import seaco_logo from "./images/seacologo.png";
import seatrade_logo from "./images/seatrade_logo.svg";
import tracktrace_logo from "./images/track_trace.png";
import inventory_img from "./images/inventory.png";
import dispatch_img from "./images/in_movements.png";
import stack_img from "./images/stack.png";

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // Utiliza useNavigate para la redirección

  // Verifica si el usuario ha iniciado sesión y redirige según el rol del usuario
useEffect(() => {
  if (!user) {
    // Si 'user' es null o undefined, redirige al inicio de sesión
    navigate("/");
  } else if (user.role === "operator") {
    // Si el usuario tiene el rol de "operator", redirige a la página de ubicación
    navigate("/location");
  }
  // Puedes agregar más condiciones para otros roles si es necesario
}, [user, navigate]); // Incluye 'navigate' en la lista de dependencias para evitar advertencias

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="home-page">
      <Header />
      <div className="home">
        <div className="text-and-options">
          <h2 className="home-header">
            Registro de movimientos e inventario de contenedores
          </h2>

          <div className="home-options-container">

            <div
              className="option-page"
              onClick={() => handleNavigate("/in-movements")}
            >
              <h3 className="option-text">Ingresos</h3>
              <img
                src={import_img} // Reemplaza con la ruta correcta de tu imagen
                alt="import"
                className="option-img"
              />
            </div>

            <div
              className="option-page"
              onClick={() => handleNavigate("/out-movements")}
            >
              <h3 className="option-text">Salidas</h3>
              <img
                src={export_img} // Reemplaza con la ruta correcta de tu imagen
                alt="otros ingresos"
                className="option-img"
              />
            </div>

            <div
              className="option-page"
              onClick={() => handleNavigate("/containers-dispatch")}
            >
              <h3 className="option-text">Despachos</h3>
              <img
                src={dispatch_img} // Reemplaza con la ruta correcta de tu imagen
                alt="despachos"
                className="option-img"
              />
            </div>

            <div
              className="option-page"
              onClick={() => handleNavigate("/inventory")}
            >
              <h3 className="option-text">Inventario</h3>
              <img
                src={inventory_img} // Reemplaza con la ruta correcta de tu imagen
                alt="inventory"
                className="option-img"
              />

            </div>

            <div
              className="option-page"
              onClick={() => handleNavigate("/terminal-map")}
            >
              <h3 className="option-text">Plano de estibas</h3>
              <img
                src={stack_img} // Reemplaza con la ruta correcta de tu imagen
                alt="terminal map"
                className="option-img"
              />

            </div>

          </div>{" "}
          {/*Fin options-container */}
        </div>{" "}
        {/*Fin div text-and-options*/}
        <aside className="links-units-inquiry">
          <h3>Búsqueda de contenedores</h3>
          <p>
            Estos enlaces le llevan a las paginas oficiales donde puede revisar
            más detalles de los contenedores
          </p>
          <ul>
            <li>
              <a href="https://www.track-trace.com/container" target="_blank">
                <img
                  className="logo-link"
                  src={tracktrace_logo} // Reemplaza con la ruta correcta de tu imagen
                  alt="seaco_logo"
                />
              </a>
            </li>
            <li>
              <a
                href="https://www.capps.com/cgi-bin/publicUnitInfo"
                target="_blank"
              >
                CAI
              </a>
            </li>
            <li>
              <a
                href="https://tools.tritoncontainer.com/tritoncontainer/unitStatus/list?"
                target="_blank"
              >
                <img
                  className="logo-link"
                  src={triton_logo} // Reemplaza con la ruta correcta de tu imagen
                  alt="triton_logo"
                />
              </a>
            </li>
            <li>
              <a
                href="https://newseaweb.seacoglobal.com/sap/bc/ui5_ui5/sap/zseaco_ue17/index.html"
                target="_blank"
              >
                <img
                  className="logo-link"
                  src={seaco_logo} // Reemplaza con la ruta correcta de tu imagen
                  alt="seaco_logo"
                />
              </a>
            </li>
            <li>
              <a href="https://portal.seatrade.com/" target="_blank">
                <img
                  className="logo-link"
                  src={seatrade_logo} // Reemplaza con la ruta correcta de tu imagen
                  alt="seaco_logo"
                />
              </a>
            </li>
            {/*<li><a href="">Página 1</a></li>
             */}

            {/* Agrega más enlaces según sea necesario */}
          </ul>
        </aside>
      </div>
      {/*Fin div home */}

      <Footer />
    </div>
  );
}

export default Home;
