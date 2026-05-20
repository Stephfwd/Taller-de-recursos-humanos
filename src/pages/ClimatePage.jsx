import React from "react";
import Navbar from "../components/shared/Navbar";
import ClimateChatbot from "../components/climate/ClimateChatbot";

export const ClimatePage = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
      <Navbar title="Encuesta de Clima Laboral" />
      <div className="page-container">
        <ClimateChatbot />
      </div>
    </div>
  );
};

export default ClimatePage;
