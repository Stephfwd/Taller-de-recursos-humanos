import React from "react";
import Navbar from "../components/shared/Navbar";
import LegalChatbot from "../components/legal/LegalChatbot";

export const LegalPage = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
      <Navbar title="Consultor Laboral Inteligente" />
      <div className="page-container">
        <LegalChatbot />
      </div>
    </div>
  );
};

export default LegalPage;
