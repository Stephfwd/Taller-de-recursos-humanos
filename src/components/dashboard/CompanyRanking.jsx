import React from "react";
import { AlertCircle, Activity, TrendingDown } from "lucide-react";

// Badge de prioridad con color + texto (sin emojis)
const PriorityBadge = ({ level }) => {
  const map = {
    "Crítica":  { bg: "rgba(244,63,94,0.15)",  border: "rgba(244,63,94,0.25)",  color: "#f43f5e", label: "Grave",       Icon: AlertCircle },
    "Media":    { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.25)", color: "#f59e0b", label: "Intermedio",  Icon: Activity    },
    "Baja":     { bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.25)", color: "#10b981", label: "Optimo",      Icon: TrendingDown }
  };
  const s = map[level] || map["Media"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "0.25rem",
      background: s.bg, border: `1px solid ${s.border}`,
      color: s.color, borderRadius: "6px",
      padding: "0.2rem 0.5rem", fontSize: "0.7rem", fontWeight: 700
    }}>
      <s.Icon size={10} />
      {s.label}
    </span>
  );
};

// Indicador de posición en el ranking (color según lugar)
const RankIndicator = ({ rank, total }) => {
  const isWorst  = rank === 1;           // posición 1 = peor score (mayor prioridad)
  const isBest   = rank === total;       // última = mejor score
  const color    = isWorst ? "#f43f5e" : isBest ? "#10b981" : "var(--text-muted)";
  const label    = isWorst ? "Prioridad Alta" : isBest ? "Mejor Score" : "";
  return (
    <span style={{ fontWeight: 700, color, fontSize: "0.88rem", minWidth: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
      {rank}
      {label && (
        <span style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.3px", color, opacity: 0.85 }}>
          {label}
        </span>
      )}
    </span>
  );
};

const getScoreColor = (score) => {
  if (score < 60) return "#f43f5e";
  if (score < 75) return "#f59e0b";
  return "#10b981";
};

export const CompanyRanking = ({ rankings = [] }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)", fontWeight: 600 }}>
              <th style={{ padding: "0.75rem 0.5rem" }}>#</th>
              <th style={{ padding: "0.75rem 0.5rem" }}>Departamento</th>
              <th style={{ padding: "0.75rem 0.5rem", textAlign: "center" }}>Score</th>
              <th style={{ padding: "0.75rem 0.5rem" }} className="hide-on-mobile">Area mas Debil</th>
              <th style={{ padding: "0.75rem 0.5rem", textAlign: "right" }}>Prioridad</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((row) => (
              <tr key={row.departmentName} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }} className="ranking-row">
                <td style={{ padding: "0.9rem 0.5rem" }}>
                  <RankIndicator rank={row.rank} total={rankings.length} />
                </td>
                <td style={{ padding: "0.9rem 0.5rem", fontWeight: 600, color: "white" }}>
                  {row.departmentName}
                </td>
                <td style={{ padding: "0.9rem 0.5rem", textAlign: "center", fontWeight: 800, color: getScoreColor(row.score) }}>
                  {row.score}%
                </td>
                <td style={{ padding: "0.9rem 0.5rem", color: "var(--text-secondary)" }} className="hide-on-mobile">
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 500 }}>{row.weakestCategory}</span>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Score: {row.weakestScore}%</span>
                  </div>
                </td>
                <td style={{ padding: "0.9rem 0.5rem", textAlign: "right" }}>
                  <PriorityBadge level={row.priorityLevel} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style>{`.ranking-row:hover { background: rgba(255,255,255,0.01); }`}</style>
    </div>
  );
};

export default CompanyRanking;
