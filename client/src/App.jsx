import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import "./App.css";
import ContainersInventory from "./pages/containers_inventory/ContainersInventory";
import ImportMovements from "./pages/import/ImportMovements";
import ExportMovements from "./pages/export/ExportMovements";
import InMovements from "./pages/in_movements/InMovements";
import OutMovements from "./pages/out_movements/OutMovements";
import LogIn from "./pages/login/LogIn";
import Home from "./pages/home/Home";
import UserRegister from "./pages/register/UserRegister";
import AccountVerification from "./pages/account_verification/AccountVerification";
import ChangePassword from "./pages/change_password/ChangePassword";

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
          <Route path="/import" element={<ImportMovements />} />
          <Route path="/export" element={<ExportMovements />} />
          <Route path="/in-movements" element={<InMovements />} />
          <Route path="/out-movements" element={<OutMovements />} />
          <Route path="/inventory" element={<ContainersInventory />} />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}
export default App;
