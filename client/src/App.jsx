import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import StackView from "./pages/stack_view/StackView";
import ContainerDispatch from "./pages/dispatch/ContainerDispatch";
import CustomerRegister from "./pages/customer_register/CustomerRegister";
import DataManagement from "./pages/data_management/DataManagement";
import TruckCoRegister from "./pages/truck_co_register/TruckCoRegister";
import ManifestRegister from "./pages/manifest_register/ManifestRegister";
import Dashboard from "./pages/dashboard_page/DashboardPage";
import QueryPage from "./pages/query_page/QueryPage";

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
          <Route path="/containers-dispatch" element={<ContainerDispatch />} />
          <Route path="/inventory" element={<ContainersInventory />} />
          <Route path="/stack-view" element={<StackView />} />
          <Route path="/customer-register" element={<CustomerRegister />} />
          <Route path="/data-management" element={<DataManagement />} />
          <Route path="/truck-co-register" element={<TruckCoRegister />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/manifest-register"
            element={<ManifestRegister />}
          />
          <Route path="/query-page" element={<QueryPage />} />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}
export default App;
