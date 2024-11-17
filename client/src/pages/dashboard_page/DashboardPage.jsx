import React, { useEffect, useState, useContext } from 'react';
import UserCount from '../../components/dashboard/UserCount';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
/* import FailedLogins from '../../components/Dashboard/FailedLogins';
import HttpRequests from '../../components/Dashboard/HttpRequests';*/
import { fetchDashboardData } from '../../services/dashboardService';
import './dashboard.css';
import Header from "../../components/header/Header";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  // AuthContext Authentication
  const { user } = useContext(AuthContext);

  // Navigation
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchDashboardData();
      setDashboardData(data);
    };
    loadData();
  }, []); 

    // Verifica si el usuario ha iniciado sesión al montar el componente y cada vez que el valor de 'user' cambie
    useEffect(() => {
      if (!user || user.role !== "admin") {
        navigate("/");
      }
    }, [user, navigate]);

  if (!dashboardData) return <div className="loading">Cargando...</div>;

  return (
    <div className="dashboard">
        <Header />
      <h1 className="dashboard-title">Panel de Control</h1>
      <div className="dashboard-grid">
        <UserCount count={dashboardData.activeUsers} />
        {/* <FailedLogins count={dashboardData.failedLogins} />
        <HttpRequests data={dashboardData.requestsData} /> */}
      </div>
    </div>
  );
};

export default Dashboard;