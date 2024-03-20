import "./navbar.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const logoImage = "https://www.grupodelsol.cr/Imagenes/logos/Decaprom_logosinfondo.png";

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);

  const notify = () => {
    toast.success("Logged out");
  };

  const handleLogout = () => {
    notify();
    setTimeout(() => {
      sessionStorage.removeItem("user");
      dispatch({ type: "LOGOUT" });
      window.location.reload();
    }, 800);
  };

  return (
    <>
      <nav className="navbar">
        <ToastContainer autoClose={800} />
        <div className="navbar-container">
          <Link to="/home" className="navbar-brand">
            <img src={logoImage} alt="Decaprom" className="navbar-logo" />
          </Link>
          {/* <Link className="navbar-brand" to="/home">
            KONTTI
          </Link> */}
          <div className="navbar-container-2">
            <ul className="navbar-nav">
              {user && (
                <>
                  {user.role === "manager" && (
                    <li className="nav-item">
                      <Link to="/user-register" className="nav-link">
                        Registrar usuario
                      </Link>
                    </li>
                  )}
                  <li className="nav-item dropdown">
                    <span
                      className="nav-link dropdown-toggle"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {user.username}
                    </span>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdown"
                    >
                      <li>
                        <Link className="dropdown-item" to="/change-password">
                          Cambiar contraseña
                        </Link>
                      </li>
                      <li>
                        <span
                          className="dropdown-item"
                          onClick={handleLogout}
                          style={{ cursor: "pointer" }}
                        >
                          Cerrar sesión
                        </span>
                      </li>
                    </ul>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
