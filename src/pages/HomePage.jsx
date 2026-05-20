import React from "react";
import { Link } from "react-router-dom";
import { Scale, Heart, BarChart3, Bot, ArrowRight } from "lucide-react";

export const HomePage = () => {
  const portals = [
    {
      to: "/legal",
      title: "Consultor Laboral Inteligente",
      description: "Resuelve tus dudas sobre el Código de Trabajo de manera inmediata. Información confiable sobre vacaciones, horas extra, liquidaciones y licencias.",
      icon: Scale,
      color: "var(--color-primary)",
      badge: "Para Colaboradores",
      btnText: "Consultar Leyes"
    },
    {
      to: "/climate",
      title: "Encuesta de Clima Organizacional",
      description: "Participa de forma 100% anónima en nuestra encuesta de satisfacción. Califica el ambiente, liderazgo, compensación y balance vida-trabajo.",
      icon: Heart,
      color: "var(--color-secondary)",
      badge: "Para Colaboradores",
      btnText: "Iniciar Encuesta"
    },
    {
      to: "/dashboard",
      title: "Dashboard Analítico de RRHH",
      description: "Visualiza reportes de clima en tiempo real, rankings de departamentos y alertas críticas como riesgo de burnout o incidentes éticos.",
      icon: BarChart3,
      color: "var(--color-info)",
      badge: "Solo Personal RRHH",
      btnText: "Acceder a Consola"
    }
  ];

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "3rem",
      padding: "2rem 0",
      maxWidth: "1100px",
      margin: "0 auto"
    }} className="animate-fade-in">
      
      {/* Sección Hero */}
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{
          width: "56px",
          height: "56px",
          borderRadius: "16px",
          background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto",
          boxShadow: "0 8px 24px rgba(99, 102, 241, 0.25)",
          color: "white"
        }}>
          <Bot size={28} />
        </div>
        
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800 }} className="gradient-text-indigo">
          Portal Inteligente de Recursos Humanos
        </h1>
        
        <p style={{
          color: "var(--text-secondary)",
          fontSize: "1.1rem",
          maxWidth: "640px",
          margin: "0 auto",
          lineHeight: "1.5"
        }}>
          Bienvenido al centro de servicios de AegisHR. Elige uno de nuestros módulos especializados para comenzar.
        </p>
      </div>

      {/* Grid de Portales */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "1.5rem",
        marginTop: "1rem"
      }}>
        {portals.map((p, i) => {
          const Icon = p.icon;
          return (
            <div 
              key={i} 
              className="glass-card glass-card-interactive"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "2rem",
                padding: "2rem",
                position: "relative",
                overflow: "hidden"
              }}
            >
              {/* Brillo de Fondo */}
              <div style={{
                position: "absolute",
                top: "-50px",
                right: "-50px",
                width: "120px",
                height: "120px",
                background: p.color,
                borderRadius: "50%",
                filter: "blur(60px)",
                opacity: 0.15,
                pointerEvents: "none"
              }} />

              {/* Contenido Superior */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: `${p.color}15`,
                    color: p.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Icon size={24} />
                  </div>
                  
                  <span style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: p.color,
                    background: `${p.color}10`,
                    padding: "0.25rem 0.5rem",
                    borderRadius: "6px"
                  }}>
                    {p.badge}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <h3 style={{ fontSize: "1.35rem", fontWeight: 700, color: "white" }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                    {p.description}
                  </p>
                </div>
              </div>

              {/* Botón de Entrada */}
              <Link 
                to={p.to} 
                className="btn btn-primary"
                style={{
                  background: p.color,
                  boxShadow: `0 4px 14px ${p.color}25`,
                  width: "100%",
                  textDecoration: "none",
                  display: "flex",
                  justifyContent: "center",
                  gap: "0.5rem"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = "brightness(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = "none";
                }}
              >
                {p.btnText}
                <ArrowRight size={16} />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
