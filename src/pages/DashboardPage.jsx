import React from "react";
import Navbar from "../components/shared/Navbar";
import Dashboard from "../components/dashboard/Dashboard";

export const DashboardPage = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
      <Navbar title="Panel de Analítica de Clima" />
      <div className="page-container">
        <Dashboard />
      </div>
    </div>
  );
};

export default DashboardPage;
