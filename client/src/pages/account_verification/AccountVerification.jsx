import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import "./account_verification.css";
import logoKontti from "../../assets/images/kontti_logo.png";

const AccountVerification = () => {
  const [verificacionEstado, setVerificacionEstado] = useState("");
  const location = useLocation();

  useEffect(() => {
    const verifyToken = async () => {
      const query = new URLSearchParams(location.search);
      const token = query.get("token");

      try {
        await axios.get(
          `${process.env.VITE_API_URL}/api/auth/verify-email?token=${token}`
        );
        setVerificacionEstado(
          "Success: Your email has been verified. You can close this window and continue using the application."
        );
      } catch (error) {
        setVerificacionEstado(
          "Error: Your email could not be verified. Please try again or contact support."
        );
      }
    };

    verifyToken();
  }, [location]);

  return (
    <div>
      <div className="empty-div"></div>
      <div className="container">
        <img src={logoKontti} alt="Kontti" />
        <h2 className="verification-heading">Email Verification</h2>
        <p className="verification-status">{verificacionEstado}</p>
        <Link to="/" className="return-home-link">
          Get Started with Kontti!
        </Link>
      </div>
    </div>
  );
};

export default AccountVerification;
