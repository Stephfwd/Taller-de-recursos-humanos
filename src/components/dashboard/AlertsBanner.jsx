import React from "react";
import { AlertTriangle, ShieldAlert, CheckCircle2 } from "lucide-react";

const SeverityBadge = ({ type, label }) => {
  const map = {
    danger:  { bg: "rgba(244,63,94,0.15)",  border: "rgba(244,63,94,0.3)",  color: "#f43f5e" },
    warning: { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.3)", color: "#f59e0b" },
    ok:      { bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.3)", color: "#10b981" }
  };
  const s = map[type] || map.warning;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "0.3rem",
      background: s.bg, border: `1px solid ${s.border}`, color: s.color,
      borderRadius: "6px", padding: "0.18rem 0.55rem",
      fontSize: "0.7rem", fontWeight: 700, flexShrink: 0
    }}>
      <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: s.color }} />
      {label}
    </span>
  );
};

export const AlertsBanner = ({ alerts = [] }) => {
  if (alerts.length === 0) {
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: "0.75rem",
        background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)",
        borderRadius: "12px", padding: "1rem 1.25rem"
      }}>
        <CheckCircle2 size={18} style={{ color: "var(--color-secondary)", flexShrink: 0 }} />
        <span style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
          <SeverityBadge type="ok" label="Estado Optimo" />{" "}
          No se detectaron umbrales de insatisfacción crítica ni alertas éticas en los comentarios recientes.
        </span>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {alerts.map((alert) => {
        const isDanger = alert.type === "danger";
        const Icon = isDanger ? ShieldAlert : AlertTriangle;
        const color  = isDanger ? "#f43f5e" : "#f59e0b";
        const bg     = isDanger ? "rgba(244,63,94,0.05)"  : "rgba(245,158,11,0.05)";
        const border = isDanger ? "1px solid rgba(244,63,94,0.15)" : "1px solid rgba(245,158,11,0.15)";

        return (
          <div key={alert.id} className="animate-slide-in" style={{
            background: bg, border, borderRadius: "12px",
            padding: "1rem 1.25rem", display: "flex", gap: "1rem", alignItems: "flex-start"
          }}>
            <Icon size={18} style={{ color, marginTop: "2px", flexShrink: 0 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", flexGrow: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                <SeverityBadge type={isDanger ? "danger" : "warning"} label={isDanger ? "Grave" : "Intermedio"} />
                <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "white" }}>
                  {alert.category} — {alert.message}
                </span>
              </div>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                Accion recomendada: {alert.recommendation}
              </span>
              {alert.commentRef && (
                <div style={{
                  marginTop: "0.4rem", padding: "0.45rem 0.75rem",
                  background: "rgba(0,0,0,0.2)", borderRadius: "6px",
                  fontSize: "0.75rem", color: "var(--text-secondary)",
                  fontStyle: "italic", borderLeft: `2px solid ${color}`
                }}>
                  "{alert.commentRef}"
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AlertsBanner;
