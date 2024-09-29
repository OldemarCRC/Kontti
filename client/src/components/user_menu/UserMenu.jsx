import "./user_menu.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserMenu = () => {
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
    <nav className="user-menu">
      <ToastContainer autoClose={800} />
      <div className="user-menu-container">
        <ul className="user-menu-nav">
          {user && (
            <li className="user-menu-item dropdown">
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
                {user.role === "admin" && (
                  <li className="user-menu-list">
                    <Link className="dropdown-item" to="/user-register">
                      Registrar usuario
                    </Link>
                  </li>
                )}
                <li className="user-menu-list">
                  <Link className="dropdown-item" to="/change-password">
                    Cambiar contraseña
                  </Link>
                </li>
                <li className="user-menu-list">
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
      </div>
    </nav>
  );
};

export default UserMenu;

