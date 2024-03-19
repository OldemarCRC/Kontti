import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./../../pages/login/logIn.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

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
    toast.success("¡Inicio de sesión exitoso!");
  };

  // Checking username and password
  useEffect(() => {
    if (error) {
      toast.error("Inicio de sesión fallido");
    }
  }, [error]);

  // Delay time & Navigation
  const delay = () => {
    navigate("/home");
  };

  // User Submit for Login
  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post(
        "http://localhost:8800/api/auth/login",
        credentials
      );
      if (res.data.details.isEmailVerified) {
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
        sessionStorage.setItem("user", JSON.stringify(res.data.details)); // Asegúrate de usar JSON.stringify aquí
        notify();
        setTimeout(delay, 2000);
      } else {
        const errorMessage =
          "Por favor, verifica tu correo electrónico antes de iniciar sesión.";
        toast.error(errorMessage);
        dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
      }
    } catch (err) {
      // Este bloque ahora manejará todos los mensajes de error.
      const errorMessage =
        err.response?.data?.message || "Inicio de sesión fallido.";
      toast.error(errorMessage);
      dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
    }
  };

  return (
    <>
      <ToastContainer autoClose={2000} />
      <div className="empty-div"></div>
      <div className="login-container">
        <div className="login-form">
          <form>
            <div className="app-name">
              <h3>Kontti</h3>
            </div>
            <h5 className="login-message">Inicia sesión en tu cuenta</h5>
            <div className="label-input">
              <label form="username" className="form-label">
                Nombre de usuario
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
              <label form="passowrd" className="form-label">
                Contraseña
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
                type="button"
              >
                {loading && (
                  <div className="" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                )}
                Iniciar sesión
              </button>
              <br />
            </div>
          </form>
        </div>
        {/*Fin de login-form */}
      </div>
      {/*Fin de login-container */}
      <Footer />
    </>
  );
};

export default Login;
