import React from "react";
import { User, Bell, Shield } from "lucide-react";

export const Navbar = ({ title }) => {
  return (
    <nav style={{
      height: "70px",
      borderBottom: "1px solid var(--border-color)",
      background: "rgba(10, 14, 26, 0.5)",
      backdropFilter: "var(--glass-blur)",
      display: "flex",
      alignItems: "center",
      justifyContent: "between",
      padding: "0 2rem",
      position: "sticky",
      top: 0,
      zIndex: 40,
      width: "100%",
      display: "flex",
      justifyContent: "space-between"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <h2 style={{ fontSize: "1.35rem", fontWeight: 700 }} className="gradient-text-indigo">
          {title || "Portal de RRHH"}
        </h2>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
        {/* Alertas Rápidas */}
        <button style={{
          background: "none",
          border: "none",
          color: "var(--text-secondary)",
          cursor: "pointer",
          position: "relative",
          display: "flex",
          alignItems: "center"
        }}>
          <Bell size={20} />
          <span style={{
            position: "absolute",
            top: "-2px",
            right: "-2px",
            width: "8px",
            height: "8px",
            background: "var(--color-danger)",
            borderRadius: "50%"
          }} />
        </button>

        {/* Info del usuario logueado */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          paddingLeft: "1rem",
          borderLeft: "1px solid var(--border-color)"
        }}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--color-primary), #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 10px rgba(99, 102, 241, 0.3)"
          }}>
            <User size={18} color="white" />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }} className="hide-on-mobile">
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>
              Laura Martínez
            </span>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <Shield size={10} /> Administradora
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
