import React from "react";

export const SurveyProgress = ({ current, total }) => {
  const percentage = Math.round((current / total) * 100) || 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 600 }}>
        <span style={{ color: "var(--text-secondary)" }}>Progreso de la encuesta</span>
        <span style={{ color: "var(--color-primary)" }}>{current} de {total} ({percentage}%)</span>
      </div>

      <div style={{
        height: "6px",
        background: "rgba(255, 255, 255, 0.05)",
        borderRadius: "10px",
        overflow: "hidden",
        width: "100%",
        position: "relative"
      }}>
        <div style={{
          width: `${percentage}%`,
          height: "100%",
          background: "linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
          borderRadius: "10px",
          transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
        }} />
      </div>
    </div>
  );
};

export default SurveyProgress;
