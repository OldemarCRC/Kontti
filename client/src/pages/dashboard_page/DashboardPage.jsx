import React, { useEffect, useState } from 'react';
import UserCount from '../../components/dashboard/UserCount';
/* import FailedLogins from '../../components/Dashboard/FailedLogins';
import HttpRequests from '../../components/Dashboard/HttpRequests';*/
import { fetchDashboardData } from '../../services/dashboardService';
import './dashboard.css';
import Header from "../../components/header/Header";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchDashboardData();
      setDashboardData(data);
    };
    loadData();
  }, []);

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