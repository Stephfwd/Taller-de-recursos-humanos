import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Scale, BarChart3, Bot, Settings, ClipboardList, TrendingUp, ChevronRight } from "lucide-react";

// ── Datos de navegación agrupados por sección ────────────────────────────────
const NAV_SECTIONS = [
  {
    // Sección raíz (sin título de grupo)
    items: [
      { path: "/", label: "Inicio", icon: Home, exact: true }
    ]
  },
  {
    label: "Consultas Laborales",
    color: "var(--color-primary)",
    items: [
      { path: "/legal", label: "Asesor Legal", icon: Scale, description: "Código de Trabajo" }
    ]
  },
  {
    label: "Clima Organizacional",
    color: "var(--color-secondary)",
    items: [
      { path: "/climate", label: "Encuesta de Clima", icon: ClipboardList, description: "Participación anónima" },
      { path: "/dashboard", label: "Dashboard RRHH", icon: TrendingUp, description: "Analítica en tiempo real" }
    ]
  }
];

export const Sidebar = () => {
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
      padding: "1.5rem 1rem"
    }}>
      {/* ── Logotipo ─────────────────────────────────────────────────── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        marginBottom: "2rem",
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
          boxShadow: "0 4px 15px rgba(99, 102, 241, 0.4)",
          flexShrink: 0
        }}>
          <Bot size={22} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: "1.2rem", fontWeight: 800, lineHeight: 1 }}>
            Aegis<span style={{ color: "var(--color-secondary)", fontWeight: 500 }}>HR</span>
          </h1>
          <span style={{
            fontSize: "0.65rem",
            color: "var(--text-muted)",
            letterSpacing: "1.2px",
            textTransform: "uppercase"
          }}>
            Portal RRHH v1.0
          </span>
        </div>
      </div>

      {/* ── Secciones de navegación ──────────────────────────────────── */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "1.5rem", flexGrow: 1 }}>
        {NAV_SECTIONS.map((section, si) => (
          <div key={si} style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>

            {/* Título de sección (si existe) */}
            {section.label && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0 0.5rem",
                marginBottom: "0.25rem"
              }}>
                <div style={{
                  height: "1px",
                  width: "12px",
                  background: section.color,
                  borderRadius: "1px",
                  opacity: 0.6
                }} />
                <span style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: section.color,
                  opacity: 0.8
                }}>
                  {section.label}
                </span>
              </div>
            )}

            {/* Items del grupo */}
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  style={({ isActive }) => ({
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.7rem 0.85rem",
                    borderRadius: "10px",
                    textDecoration: "none",
                    color: isActive ? "white" : "var(--text-secondary)",
                    background: isActive
                      ? `linear-gradient(90deg, ${section.color || "var(--color-primary)"}18 0%, transparent 100%)`
                      : "transparent",
                    borderLeft: isActive
                      ? `3px solid ${section.color || "var(--color-primary)"}`
                      : "3px solid transparent",
                    transition: "all var(--transition-fast)",
                    position: "relative"
                  })}
                  className="sidebar-nav-link"
                >
                  {({ isActive }) => (
                    <>
                      <div style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: isActive
                          ? `${section.color || "var(--color-primary)"}20`
                          : "rgba(255,255,255,0.03)",
                        color: isActive
                          ? (section.color || "var(--color-primary)")
                          : "var(--text-muted)",
                        flexShrink: 0,
                        transition: "all var(--transition-fast)"
                      }}>
                        <Icon size={15} />
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, minWidth: 0 }}>
                        <span style={{
                          fontSize: "0.88rem",
                          fontWeight: isActive ? 700 : 500,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}>
                          {item.label}
                        </span>
                        {item.description && (
                          <span style={{
                            fontSize: "0.68rem",
                            color: isActive ? "rgba(255,255,255,0.5)" : "var(--text-muted)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}>
                            {item.description}
                          </span>
                        )}
                      </div>

                      {isActive && (
                        <ChevronRight size={13} style={{ flexShrink: 0, color: section.color || "var(--color-primary)" }} />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <div style={{
        padding: "0.85rem 0.5rem 0",
        borderTop: "1px solid var(--border-color)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: "var(--text-muted)",
        fontSize: "0.75rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Settings size={13} />
          <span>Configuración</span>
        </div>
        <span style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}>Antigravity</span>
      </div>

      <style>{`
        .sidebar-nav-link:hover {
          color: white !important;
          background: rgba(255, 255, 255, 0.03) !important;
        }
        .sidebar-nav-link:hover > div:first-child {
          background: rgba(255, 255, 255, 0.06) !important;
          color: white !important;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
