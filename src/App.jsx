import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/shared/Sidebar";
import HomePage from "./pages/HomePage";
import LegalPage from "./pages/LegalPage";
import ClimatePage from "./pages/ClimatePage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/legal" element={<LegalPage />} />
            <Route path="/climate" element={<ClimatePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
