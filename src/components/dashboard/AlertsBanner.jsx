import React from "react";
import { AlertTriangle, ShieldAlert, CheckCircle2 } from "lucide-react";

export const AlertsBanner = ({ alerts = [] }) => {
  if (alerts.length === 0) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        background: "rgba(16, 185, 129, 0.05)",
        border: "1px solid rgba(16, 185, 129, 0.15)",
        borderRadius: "12px",
        padding: "1rem 1.25rem",
        color: "var(--color-secondary)",
        fontSize: "0.9rem"
      }}>
        <CheckCircle2 size={20} />
        <div>
          <strong>Estado Óptimo:</strong> No se han detectado umbrales de insatisfacción crítica ni alertas éticas en los comentarios.
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {alerts.map((alert) => {
        const isDanger = alert.type === "danger";
        const Icon = isDanger ? ShieldAlert : AlertTriangle;
        const color = isDanger ? "var(--color-danger)" : "var(--color-warning)";
        const bg = isDanger ? "rgba(244, 63, 94, 0.06)" : "rgba(245, 158, 11, 0.06)";
        const border = isDanger ? "1px solid rgba(244, 63, 94, 0.15)" : "1px solid rgba(245, 158, 11, 0.15)";

        return (
          <div
            key={alert.id}
            className="animate-slide-in"
            style={{
              background: bg,
              border: border,
              borderRadius: "12px",
              padding: "1rem 1.25rem",
              display: "flex",
              gap: "1rem",
              alignItems: "start"
            }}
          >
            <div style={{
              color: color,
              marginTop: "2px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Icon size={20} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flexGrow: 1 }}>
              <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "white" }}>
                {alert.message}
              </span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                👉 <strong>Acción recomendada:</strong> {alert.recommendation}
              </span>
              {alert.commentRef && (
                <div style={{
                  marginTop: "0.5rem",
                  padding: "0.5rem 0.75rem",
                  background: "rgba(0,0,0,0.2)",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  color: "var(--text-secondary)",
                  fontStyle: "italic",
                  borderLeft: `2px solid ${color}`
                }}>
                  " {alert.commentRef} "
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
