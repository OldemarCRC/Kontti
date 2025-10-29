import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./user_menu.css";
import axios from "axios";

const UserMenu = () => {
  const { user, dispatch } = useContext(AuthContext);


  const handleLogout = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      if (!user || !user.id) {
        throw new Error("No user found in sessionStorage");
      }
      // Hacer la solicitud de logout
      const response = await axios.post(
        `${process.env.VITE_API_URL}/api/logout`,
        { userId: user.id },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
  
      if (response.status === 200) {
        toast.success("Session closed successfully");
        setTimeout(() => {
          sessionStorage.removeItem("user");
          dispatch({ type: "LOGOUT" });
          window.location.reload();
        }, 800);
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      // Manejo detallado de errores para mostrar en pantalla
      let errorMessage = "There was a problem logging out. Please try again.";
      if (error.response) {
        // El servidor respondió con un error (por ejemplo, 401, 403, 500)
        errorMessage = `Server Error - Status ${error.response.status}: ${error.response.data.message || 'Error desconocido'}`;
      } else if (error.request) {
        // La solicitud se envió pero no se recibió respuesta
        errorMessage = "No server response. Check your internet connection.";
      } else {
        // Error al configurar la solicitud
        errorMessage = `Error preparing the request: ${error.message}`;
      }
      toast.error(errorMessage);
    }
  };

  return (
    <nav className="user-menu">
      <ToastContainer autoClose={800} />
      <div className="user-menu-container">
        {user && (
          <div className="dropdown">
            <span className="dropdown-toggle">{user.username}</span>
            <ul className="dropdown-menu">
              {user.role === "admin" && (
                <>
                  <li><Link to="/dashboard">Dashboard</Link></li>
                  <li><Link to="/user-register">Register user</Link></li>
                </>
              )}
              <li><Link to="/change-password">Change password</Link></li>
              <li><span onClick={handleLogout}>Log out</span></li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default UserMenu;

