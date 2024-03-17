import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./change_password.css";

// User Registration
const ChangePassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // AuthContext Authentication
  const { user } = useContext(AuthContext);

  // Navigation
  /* const navigate = useNavigate(); */

  // Handling changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Notifying if registration was Successful
  const notify = () => {
    toast.success("Password changed successfully!");
  };

  // Delay time & Navigation
  /*  const delay = () => {
        navigate("/login");
    }; */

 // User Submit for Password Change
 const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, newPassword, confirmNewPassword } = formData;
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    try {
      // Replace URL with your API endpoint for changing password
      const response = await axios.post(
        "http://localhost:8800/api/auth/change-password",
        {
          userId: user._id, // Assuming you're storing the user's ID in the AuthContext
          password,
          newPassword,
        }
      );
      console.log("SERVER RESPONSE:", response);
      notify();
    } catch (error) {
      console.log(
        "REQUEST ERROR:",
        error.response ? error.response : error
      );
      toast.error("Password change unsuccessful!");
    }
  };
  
  return (
    <>
      <ToastContainer autoClose={2000} />
      <div className="change-password-container">
        <div className="change-password-form">
          <form onSubmit={handleSubmit}>
            <h5 className="change-password-message">Change Password for {user?.username}</h5>
            <div className="label-input">
              <label className="form-label" htmlFor="password">
                Current Password
              </label>
              <input
                value={formData.password}
                onChange={handleChange}
                type="password"
                className="form-input"
                placeholder="Current Password"
                id="password"
                name="password"
                required
              />
            </div>
            <div className="label-input">
              <label className="form-label" htmlFor="newPassword">
                New Password
              </label>
              <input
                value={formData.newPassword}
                onChange={handleChange}
                type="password"
                className="form-input"
                placeholder="New Password"
                id="newPassword"
                name="newPassword"
                required
              />
            </div>
            <div className="label-input">
              <label className="form-label" htmlFor="confirmNewPassword">
                Confirm New Password
              </label>
              <input
                value={formData.confirmNewPassword}
                onChange={handleChange}
                type="password"
                className="form-input"
                placeholder="Confirm New Password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                required
              />
            </div>
            <div className="change-password-button">
              <button className="lbtn" type="submit">
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;