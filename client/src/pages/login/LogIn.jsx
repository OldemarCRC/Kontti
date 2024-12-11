import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./logIn.css";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const { loading, error, dispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  /* const notify = () => {
    toast.success("Login successful!");
  }; */

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.details.isEmailVerified) {
        const userDetails = data.details;

        dispatch({ type: "LOGIN_SUCCESS", payload: userDetails });
        sessionStorage.setItem("user", JSON.stringify(userDetails));
        toast.success("Login successful!");
        setTimeout(() => navigate(userDetails.role === "operator" ? "/stack-view" : "/home"), 2000);
      } else {
        throw new Error(data.message || "Please verify your email before logging in.");
      }
    } catch (err) {
      const errorMessage = err.message || "Login failed.";
      toast.error(errorMessage);
      dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
    }
  };
  
  return (
    <div className="login-page">
      <ToastContainer autoClose={2000} />
      <div className="login-container">
        <div className="login-form">
          <form onSubmit={handleSubmit}>
            <div>
              <h1 className="app-name">Kontti</h1>
              <h2>Containers Hub App</h2>
            </div>
            <h3 className="login-message">Log in to your account</h3>
            <div className="label-input">
              <label htmlFor="username" className="login-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="form-input"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Enter your username"
                aria-label="Username input" // Añadir
                autoComplete="username"
                required
              />
            </div>
            <div className="label-input">
              <label htmlFor="password" className="login-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-input"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter your password"
                aria-label="Password input"
                autoComplete="current-password"
                required
              />
            </div>
            <div className="login-button">
              <button
                className="lbtn"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;