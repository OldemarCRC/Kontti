import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./logIn.css";

// User or Admin LogIn
const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  // AuthContext Authentication
  const { loading, error, dispatch } = useContext(AuthContext);

  // Navigate
  const navigate = useNavigate();

  // Handling changes
  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  // Notifying if login was Successful
  const notify = () => {
    toast.success("Login successful!");
  };

  // Checking username and password
  useEffect(() => {
    if (error) {
      toast.error("Login failed");
    }
  }, [error]);

  // User Submit for Login
  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`,
        credentials
      );
      if (res.data.details.isEmailVerified) {

        const token = res.data.details.token;
        const userDetails = res.data.details;

        dispatch({ type: "LOGIN_SUCCESS", payload: userDetails });
        sessionStorage.setItem("userToken", token); // Guardar el token
        sessionStorage.setItem("user", JSON.stringify(userDetails)); // Asegúrate de usar JSON.stringify aquí

        // Redireccionar según el rol del usuario
        let destinationRoute = "/home"; // Ruta predeterminada
        if (userDetails.role === "operator") {
          destinationRoute = "/map"; // Ruta específica para operadores
        }
        notify();
        setTimeout(() => navigate(destinationRoute), 2000);
      } else {
        const errorMessage =
          "Please verify your email before logging in.";
        toast.error(errorMessage);
        dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
      }
    } catch (err) {
      // Este bloque ahora manejará todos los mensajes de error.
      const errorMessage =
        err.response?.data?.message || "Login failed.";
      toast.error(errorMessage);
      dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
    }
  };

  return (
    <div className="login-page">
      <ToastContainer autoClose={2000} />
      <div className="login-container">
        <div className="login-form">
          <form>
            <div>
              <h1 className="app-name">Kontti</h1>
              <h2>Containers Hub App</h2>
            </div>
            <h5 className="login-message">Log in to your account</h5>
            <div className="label-input">
              <label form="username" className="login-label">
                User name
              </label>
              <input
                value={credentials.username}
                type="text"
                className="form-input"
                id="username"
                onChange={handleChange}
                placeholder="Nombre de usuario"
              />
            </div>
            <div className="label-input">
              <label form="passowrd" className="login-label">
                Password
              </label>
              <input
                value={credentials.password}
                type="password"
                className="form-input"
                id="password"
                onChange={handleChange}
                placeholder="Contraseña"
              />
            </div>
            <div className="login-button">
              <button
                className="lbtn"
                disabled={loading}
                onClick={handleClick}
                type="submit"
              >
                {loading && (
                  <div className="" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                )}
                Login
              </button>
              <br />
            </div>
          </form>
        </div>
        {/*Fin de login-form */}
      </div>
      {/*Fin de login-container */}
    </div>
  );
};

export default Login;