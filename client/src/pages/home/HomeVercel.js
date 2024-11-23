import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./home.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import cai_logo from "../../assets/images/cai.png";
import triton_logo from "../../assets/images/Triton.png";
import tica_logo from "../../assets/images/LogoTicaB.png";
import tracktrace_logo from "../../assets/images/track_trace.png";
import check_digit_logo from "../../assets/images/check_digit_logo.png";

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else if (user.role === "operator") {
      navigate("/stack-view");
    }
  }, [user, navigate]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="home-page">
      <Header />
      <div className="home">
        <div className="text-and-options">
          <h2 className="home-header">
            Container Terminal Operations Dashboard
          </h2>

          <div className="home-options-container">
            <div
              className="option-card option-card-in"
              onClick={() => handleNavigate("/in-movements")}
            >
              <p>Incomings</p>
            </div>

            <div
              className="option-card option-card-di"
              onClick={() => handleNavigate("/containers-dispatch")}
            >
              <p>Dispatches</p>
            </div>

            <div
              className="option-card option-card-out"
              onClick={() => handleNavigate("/out-movements")}
            >
              <p>Outgoings</p>
            </div>

            <div className="option-card option-card-tm">
              <div
                onClick={() => handleNavigate("/stack-view")}
              >
                <p>Stack view</p>
              </div>
            </div>

            <div
              className="option-card option-card-qp"
              onClick={() => handleNavigate("/query-page")}
            >
              <p>Queries</p>
            </div>
          </div>
        </div>
        <aside className="links-units-inquiry">
          <h3>Useful Links</h3>
          <ul>
            <li>
              <a
                href="https://oldemarcrc.github.io/Sea-container-Check-Digit/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="logo-link"
                  src={check_digit_logo}
                  alt="Check-Digit logo"
                />
              </a>
            </li>
            <li>
              <a
                href="https://www.track-trace.com/container"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="logo-link"
                  src={tracktrace_logo}
                  alt="Tracktrace logo"
                />
              </a>
            </li>
            <li>
              <a
                href="https://www.capps.com/cgi-bin/publicUnitInfo"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="logo-link"
                  src={cai_logo}
                  alt="CAI logo"
                />
              </a>
            </li>
            <li>
              <a
                href="https://tools.tritoncontainer.com/tritoncontainer/unitStatus/list?"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="logo-link"
                  src={triton_logo}
                  alt="Triton logo"
                />
              </a>
            </li>
            <li>
              <a
                href="https://ticaconsultas.hacienda.go.cr/Tica/hcicgmic.aspx"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="logo-link"
                  src={tica_logo}
                  alt="tica logo"
                />
              </a>
            </li>
          </ul>
        </aside>
      </div>
      <Footer />
    </div>
  );
}

export default Home;

