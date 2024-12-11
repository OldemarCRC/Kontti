import React, { useContext } from "react";
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
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/logout`,
        { userId: user.id },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      toast.success("Logged out");

      setTimeout(() => {
        sessionStorage.removeItem("user");
        dispatch({ type: "LOGOUT" });
        window.location.reload();
      }, 800);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("There was an issue logging out. Please try again.");
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