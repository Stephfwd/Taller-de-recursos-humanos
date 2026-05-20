import React from "react";
import { AlertCircle, Activity, Award } from "lucide-react";

export const CompanyRanking = ({ rankings = [] }) => {
  const getPriorityBadgeStyle = (level) => {
    if (level === "Crítica") {
      return {
        background: "rgba(244, 63, 94, 0.15)",
        color: "var(--color-danger)",
        border: "1px solid rgba(244, 63, 94, 0.25)"
      };
    }
    if (level === "Media") {
      return {
        background: "rgba(245, 158, 11, 0.15)",
        color: "var(--color-warning)",
        border: "1px solid rgba(245, 158, 11, 0.25)"
      };
    }
    return {
      background: "rgba(16, 185, 129, 0.15)",
      color: "var(--color-secondary)",
      border: "1px solid rgba(16, 185, 129, 0.25)"
    };
  };

  const getScoreColor = (score) => {
    if (score < 60) return "var(--color-danger)";
    if (score < 75) return "var(--color-warning)";
    return "var(--color-secondary)";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
          fontSize: "0.85rem"
        }}>
          <thead>
            <tr style={{
              borderBottom: "1px solid var(--border-color)",
              color: "var(--text-secondary)",
              fontWeight: 600
            }}>
              <th style={{ padding: "0.75rem 0.5rem" }}>#</th>
              <th style={{ padding: "0.75rem 0.5rem" }}>Departamento</th>
              <th style={{ padding: "0.75rem 0.5rem", textAlign: "center" }}>Score</th>
              <th style={{ padding: "0.75rem 0.5rem" }} className="hide-on-mobile">Área más Débil</th>
              <th style={{ padding: "0.75rem 0.5rem", textAlign: "right" }}>Prioridad de Acción</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((row) => (
              <tr 
                key={row.departmentName} 
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.03)",
                  transition: "background var(--transition-fast)"
                }}
                className="ranking-row"
              >
                {/* Ranking Icon / Number */}
                <td style={{ padding: "0.9rem 0.5rem", fontWeight: 700 }}>
                  {row.rank === 1 ? (
                    <span style={{ color: "var(--color-danger)" }}>🥇</span>
                  ) : row.rank === rankings.length ? (
                    <span style={{ color: "var(--color-secondary)" }}>⭐</span>
                  ) : (
                    <span>{row.rank}</span>
                  )}
                </td>

                {/* Dept name */}
                <td style={{ padding: "0.9rem 0.5rem", fontWeight: 600, color: "white" }}>
                  {row.departmentName}
                </td>

                {/* Score */}
                <td style={{ 
                  padding: "0.9rem 0.5rem", 
                  textAlign: "center",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  color: getScoreColor(row.score)
                }}>
                  {row.score}%
                </td>

                {/* Weakest Area */}
                <td style={{ padding: "0.9rem 0.5rem", color: "var(--text-secondary)" }} className="hide-on-mobile">
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 500 }}>{row.weakestCategory}</span>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Score: {row.weakestScore}%</span>
                  </div>
                </td>

                {/* Action Priority Badge */}
                <td style={{ padding: "0.9rem 0.5rem", textAlign: "right" }}>
                  <span style={{
                    padding: "0.25rem 0.5rem",
                    borderRadius: "6px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    ...getPriorityBadgeStyle(row.priorityLevel)
                  }}>
                    {row.priorityLevel === "Crítica" ? <AlertCircle size={10} /> : <Activity size={10} />}
                    {row.priorityLevel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .ranking-row:hover {
          background: rgba(255, 255, 255, 0.01);
        }
      `}</style>
    </div>
  );
};

export default CompanyRanking;
