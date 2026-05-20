import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Scale, Heart, BarChart3, Bot, Settings } from "lucide-react";

export const Sidebar = () => {
  const menuItems = [
    { path: "/", label: "Portal de Inicio", icon: Home },
    { path: "/legal", label: "Consultor Laboral", icon: Scale },
    { path: "/climate", label: "Encuestas de Clima", icon: Heart },
    { path: "/dashboard", label: "Dashboard RRHH", icon: BarChart3 }
  ];

  return (
    <div style={{
      width: "260px",
      height: "100vh",
      background: "var(--bg-secondary)",
      borderRight: "1px solid var(--border-color)",
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      left: 0,
      top: 0,
      zIndex: 50,
      padding: "2rem 1.25rem"
    }}>
      {/* Brand Logo / Title */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        marginBottom: "3rem",
        padding: "0 0.5rem"
      }}>
        <div style={{
          width: "40px",
          height: "40px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 15px rgba(99, 102, 241, 0.4)"
        }}>
          <Bot size={22} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 800, lineHeight: 1 }}>
            Aegis<span style={{ color: "var(--color-secondary)", fontWeight: 500 }}>HR</span>
          </h1>
          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "1px", textTransform: "uppercase" }}>
            Workspace v1.0
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        flexGrow: 1
      }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.85rem 1rem",
                borderRadius: "12px",
                textDecoration: "none",
                fontSize: "0.95rem",
                fontWeight: 600,
                color: isActive ? "white" : "var(--text-secondary)",
                background: isActive ? "linear-gradient(90deg, rgba(99, 102, 241, 0.15) 0%, transparent 100%)" : "transparent",
                borderLeft: isActive ? "3px solid var(--color-primary)" : "3px solid transparent",
                transition: "all var(--transition-fast)"
              })}
              className="sidebar-link"
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div style={{
        padding: "1rem 0.5rem",
        borderTop: "1px solid var(--border-color)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: "var(--text-muted)",
        fontSize: "0.8rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Settings size={14} />
          <span>Configuración</span>
        </div>
        <span>Antigravity</span>
      </div>

      <style>{`
        .sidebar-link:hover {
          color: white !important;
          background: rgba(255, 255, 255, 0.03) !important;
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
