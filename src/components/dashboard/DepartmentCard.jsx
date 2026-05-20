import React, { useState } from "react";
import { ChevronDown, ChevronUp, FileSpreadsheet } from "lucide-react";

// Badge de score con color + etiqueta de texto
const ScoreBadge = ({ score }) => {
  if (score < 60) return (
    <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "#f43f5e",
      background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.2)",
      borderRadius: "4px", padding: "0.1rem 0.35rem" }}>Grave</span>
  );
  if (score < 75) return (
    <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "#f59e0b",
      background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)",
      borderRadius: "4px", padding: "0.1rem 0.35rem" }}>Intermedio</span>
  );
  return (
    <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "#10b981",
      background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)",
      borderRadius: "4px", padding: "0.1rem 0.35rem" }}>Optimo</span>
  );
};

const getColor = (score) => {
  if (score < 60) return "#f43f5e";
  if (score < 75) return "#f59e0b";
  return "#10b981";
};

export const DepartmentCard = ({ dept }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { name, score, categories, surveyCount } = dept;

  return (
    <div className="glass-card glass-card-interactive animate-fade-in"
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

      {/* Fila principal */}
      <div onClick={() => setIsOpen(!isOpen)}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>{name}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <FileSpreadsheet size={11} /> {surveyCount} {surveyCount === 1 ? "encuesta" : "encuestas"}
            </span>
            <ScoreBadge score={score} />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Indicador circular de score */}
          <div style={{
            width: "50px", height: "50px", borderRadius: "50%",
            background: "rgba(255,255,255,0.02)",
            border: `2px dashed ${getColor(score)}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: "0.9rem", color: getColor(score)
          }}>
            {score}%
          </div>
          <button style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>
            {isOpen ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
          </button>
        </div>
      </div>

      {/* Detalle por categoría */}
      {isOpen && (
        <div className="animate-fade-in" style={{
          borderTop: "1px solid var(--border-color)", paddingTop: "1rem",
          display: "flex", flexDirection: "column", gap: "0.7rem"
        }}>
          {categories.map((cat, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem" }}>
                <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{cat.categoryName}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <ScoreBadge score={cat.score} />
                  <span style={{ fontWeight: 700, color: getColor(cat.score), minWidth: "35px", textAlign: "right" }}>
                    {cat.score}%
                  </span>
                </div>
              </div>
              <div style={{ height: "4px", background: "rgba(255,255,255,0.03)", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ width: `${cat.score}%`, height: "100%", background: getColor(cat.score), borderRadius: "2px", transition: "width 0.5s ease" }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DepartmentCard;
