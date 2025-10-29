import { useEffect, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../pages/form_register_styles.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";


const CustomerRegister = () => {
  const initialFormData = {
    idType: "",
    idNumber: "",
    customerName: "",
    customerAddress: "",
    customerContact: "",
    customerEmail: "",
    customerPhoneNumber: "",
    createdBy: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const notify = () => {
    toast.success("Customer successfully registered!", {
      onClose: () => delay(),
    });
  };

  const delay = () => {
    navigate("/home");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user?.role === "demo") {
      toast.info("Demo users are not allow to register new customers.");
      return;
    }
    
    const {
      idType,
      idNumber,
      customerName,
      customerAddress,
      customerContact,
      customerEmail,
      customerPhoneNumber,
    } = formData;
    try {
      await axios.post(
        `${process.env.VITE_API_URL}/api/customers/customer-register`,
        {
          idType,
          idNumber,
          customerName,
          customerAddress,
          customerContact,
          customerEmail,
          customerPhoneNumber,
          createdBy: user.username,
        },
        { withCredentials: true }
      );
      notify();
      setFormData(initialFormData);
    } catch (error) {
      console.log(
        "REQUEST ERROR:",
        error.response ? error.response : error
      );
      if (error.response) {
        toast.error(`Registration failed: ${error.response.data.message}`);
      } else {
        toast.error("Registration failed due to an unknown error.");
      }
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else if (user.role === "operator") {
      navigate("/stack-view");
    }
  }, [user, navigate]);

  return (
    <>
      <ToastContainer autoClose={5000} />
      <Header />
      <div className="register-container">
        <div className="register-form">
          <form onSubmit={handleSubmit}>
            <h1>Customer Registration</h1>
            <div className="label-input">
              <label className="form-label" htmlFor="idType">
                ID Type
              </label>
              <select
                value={formData.idType}
                onChange={handleChange}
                className="form-input"
                placeholder="Select the ID type"
                id="idType"
                name="idType"
                required
              >
                <option value="">Select ID type</option>
                <option value="TIC">Tax Identification Code</option>
                <option value="NIC">National Identity Card</option>
              </select>
            </div>
            <div className="label-input">
              <label className="form-label" htmlFor="idNumber">
                Number
              </label>
              <input
                value={formData.idNumber}
                onChange={handleChange}
                type="text"
                className="form-input"
                placeholder="ID Number"
                id="idNumber"
                name="idNumber"
                required
              />
            </div>
            <div className="label-input">
              <label className="form-label" htmlFor="customerName">
                Customer name
              </label>
              <input
                value={formData.customerName}
                onChange={handleChange}
                type="text"
                className="form-input"
                placeholder="Customer name"
                id="customerName"
                name="customerName"
                required
              />
            </div>
            <div className="label-input">
              <label className="form-label" htmlFor="customerAddress">
                Address
              </label>
              <input
                value={formData.customerAddress}
                onChange={handleChange}
                type="text"
                className="form-input"
                placeholder="Address"
                id="customerAddress"
                name="customerAddress"
                required
              />
            </div>
            <div className="label-input">
              <label className="form-label" htmlFor="customerContact">
                Contact name
              </label>
              <input
                value={formData.customerContact}
                onChange={handleChange}
                type="text"
                className="form-input"
                placeholder="Contact name"
                id="customerContact"
                name="customerContact"
              />
            </div>
            <div className="label-input">
              <label className="form-label" htmlFor="customerEmail">
                Email
              </label>
              <input
                value={formData.customerEmail}
                onChange={handleChange}
                type="email"
                className="form-input"
                placeholder="email"
                id="customerEmail"
                name="customerEmail"
              />
            </div>
            <div className="label-input">
              <label className="form-label" htmlFor="customerPhoneNumber">
                Phone number
              </label>
              <input
                value={formData.customerPhoneNumber}
                onChange={handleChange}
                type="text"
                className="form-input"
                placeholder="Phone number"
                id="customerPhoneNumber"
                name="customerPhoneNumber"
              />
            </div>
            <div className="register-button">
              <button className="lbtn" type="submit"
                disabled={user?.role === "demo"}
                style={{
                  cursor: user?.role === "demo" ? "not-allowed" : "pointer",
                  opacity: user?.role === "demo" ? 0.6 : 1,
                }}>
                Submit Registration
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CustomerRegister;
