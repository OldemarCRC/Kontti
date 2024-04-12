import "./navbar.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
/* import LogoCustomer from "../logos/LogoCustomer"; */

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
    <nav className="navbar">
      <ToastContainer autoClose={800} />
      <div className="navbar-container">
        <div className="navbar-container-2">
          <ul className="navbar-nav">
            {user && (
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
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  {user.role === "manager" && (
                    <li className="navbar-list">
                      <Link className="dropdown-item" to="/user-register">
                        Registrar usuario
                      </Link>
                    </li>
                  )}
                  <li className="navbar-list">
                    <Link className="dropdown-item" to="/change-password">
                      Cambiar contraseña
                    </Link>
                  </li>
                  <li className="navbar-list">
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
            )}
          </ul>
          {/* <LogoCustomer /> */}
        </div>
      </div> {/*Fin div navbar container */}
    </nav>
  );
                  } 
  export default Navbar;
  
