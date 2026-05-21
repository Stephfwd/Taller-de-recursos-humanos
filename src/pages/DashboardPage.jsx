import React, { useState } from "react";
import Navbar from "../components/shared/Navbar";
import Dashboard from "../components/dashboard/Dashboard";
import AdminChatbot from "../components/dashboard/AdminChatbot";

export const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'agent'

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
      <Navbar title="Panel de Administración RRHH" />
      
      {/* Tabs Selector */}
      <div style={{
        display: "flex",
        gap: "1rem",
        padding: "0 2rem",
        marginTop: "1.5rem",
        borderBottom: "1px solid var(--border-color)"
      }}>
        <button
          onClick={() => setActiveTab('analytics')}
          style={{
            background: "none",
            border: "none",
            padding: "0.75rem 1rem",
            color: activeTab === 'analytics' ? "var(--color-primary)" : "var(--text-secondary)",
            borderBottom: activeTab === 'analytics' ? "2px solid var(--color-primary)" : "2px solid transparent",
            fontWeight: activeTab === 'analytics' ? 700 : 500,
            cursor: "pointer",
            transition: "all var(--transition-fast)",
            fontSize: "0.9rem"
          }}
        >
          📊 Dashboard Analítico
        </button>
        <button
          onClick={() => setActiveTab('agent')}
          style={{
            background: "none",
            border: "none",
            padding: "0.75rem 1rem",
            color: activeTab === 'agent' ? "var(--color-primary)" : "var(--text-secondary)",
            borderBottom: activeTab === 'agent' ? "2px solid var(--color-primary)" : "2px solid transparent",
            fontWeight: activeTab === 'agent' ? 700 : 500,
            cursor: "pointer",
            transition: "all var(--transition-fast)",
            fontSize: "0.9rem"
          }}
        >
          🤖 HR Admin Agent
        </button>
      </div>

      <div className="page-container" style={{ paddingTop: "1.5rem" }}>
        {activeTab === 'analytics' ? <Dashboard /> : <AdminChatbot />}
      </div>
    </div>
  );
};

export default DashboardPage;
