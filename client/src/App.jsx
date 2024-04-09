import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import "./App.css";
import ContainersInventory from "./pages/containers_inventory/ContainersInventory";
import InMovements from "./pages/in_movements/InMovements";
import OutMovements from "./pages/out_movements/OutMovements";
import LogIn from "./pages/login/LogIn";
import Home from "./pages/home/Home";
import UserRegister from "./pages/register/UserRegister";
import AccountVerification from "./pages/account_verification/AccountVerification";
import ChangePassword from "./pages/change_password/ChangePassword";
import TerminalMap from "./pages/terminal_map/TerminalMap"
import ContainerDispatch from "./pages/dispatch/ContainerDispatch";

function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route path="/user-register" element={<UserRegister />} />
          <Route
            path="/account-verification"
            element={<AccountVerification />}
          />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/home" element={<Home />} />
          <Route path="/in-movements" element={<InMovements />} />
          <Route path="/out-movements" element={<OutMovements />} />
          <Route path="/containers-dispatch" element={<ContainerDispatch/>} />
          <Route path="/inventory" element={<ContainersInventory />} />
          <Route path="/terminal-map" element={<TerminalMap />} />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}
export default App;
