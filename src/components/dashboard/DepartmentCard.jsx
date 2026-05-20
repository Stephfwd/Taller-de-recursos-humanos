import React, { useState } from "react";
import { ChevronDown, ChevronUp, FileSpreadsheet } from "lucide-react";

export const DepartmentCard = ({ dept }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { name, score, categories, surveyCount } = dept;

  const getColorForScore = (val) => {
    if (val < 60) return "var(--color-danger)";
    if (val < 75) return "var(--color-warning)";
    return "var(--color-secondary)";
  };

  return (
    <div className="glass-card glass-card-interactive animate-fade-in" style={{
      display: "flex",
      flexDirection: "column",
      gap: "1rem"
    }}>
      {/* Resumen Principal */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <h3 style={{ fontSize: "1.15rem", fontWeight: 700 }}>{name}</h3>
          <span style={{
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem"
          }}>
            <FileSpreadsheet size={12} /> {surveyCount} {surveyCount === 1 ? "encuesta" : "encuestas"}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.02)",
            border: `2px dashed ${getColorForScore(score)}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: "0.95rem",
            color: getColorForScore(score)
          }}>
            {score}%
          </div>
          <button style={{
            background: "none",
            border: "none",
            color: "var(--text-secondary)",
            cursor: "pointer"
          }}>
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Detalle Desplegable por Categoría */}
      {isOpen && (
        <div 
          className="animate-fade-in"
          style={{
            borderTop: "1px solid var(--border-color)",
            paddingTop: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem"
          }}
        >
          {categories.map((cat, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
                <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{cat.categoryName}</span>
                <span style={{ fontWeight: 700, color: getColorForScore(cat.score) }}>{cat.score}%</span>
              </div>
              <div style={{
                height: "4px",
                background: "rgba(255, 255, 255, 0.03)",
                borderRadius: "2px",
                overflow: "hidden"
              }}>
                <div style={{
                  width: `${cat.score}%`,
                  height: "100%",
                  background: getColorForScore(cat.score),
                  borderRadius: "2px"
                }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DepartmentCard;
