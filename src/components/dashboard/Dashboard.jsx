import React, { useState } from "react";
import { useDashboard } from "../../hooks/useDashboard";
import PriorityChart from "../climate/PriorityChart";
import AlertsBanner from "./AlertsBanner";
import CompanyRanking from "./CompanyRanking";
import DepartmentCard from "./DepartmentCard";
import LoadingSpinner from "../shared/LoadingSpinner";
import { 
  BarChart3, 
  RefreshCw, 
  RotateCcw, 
  MessageSquare, 
  ShieldAlert, 
  HelpCircle,
  TrendingUp,
  FileText
} from "lucide-react";

export const Dashboard = () => {
  const { analytics, isLoading, refreshData, resetData } = useDashboard();
  const [commentFilter, setCommentFilter] = useState("all"); // all, critical, dept-...

  if (isLoading || !analytics) {
    return <LoadingSpinner label="Analizando respuestas de clima laboral..." size="large" />;
  }

  const {
    overallScore,
    totalSurveys,
    categoryScores,
    departmentScores,
    priorityRankings,
    alerts,
    recentComments
  } = analytics;

  // Filtrar comentarios
  const filteredComments = recentComments.filter((c) => {
    if (commentFilter === "all") return true;
    if (commentFilter === "critical") return c.isCritical;
    if (commentFilter.startsWith("dept-")) {
      const deptName = commentFilter.replace("dept-", "");
      return c.department === deptName;
    }
    return true;
  });

  const getScoreColor = (val) => {
    if (val < 60) return "var(--color-danger)";
    if (val < 75) return "var(--color-warning)";
    return "var(--color-secondary)";
  };

  const getUniqueDeptsWithComments = Array.from(
    new Set(recentComments.map((c) => c.department))
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }} className="animate-fade-in">
      
      {/* 1. Acciones y Cabecera de Telemetría */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800 }}>Consola de Analítica de Clima</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            Visualización agregada y detección en tiempo real de focos de atención en la organización.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button 
            onClick={refreshData}
            className="btn btn-secondary"
            style={{ padding: "0.6rem 1rem", fontSize: "0.85rem" }}
            title="Sincronizar nuevas encuestas"
          >
            <RefreshCw size={14} /> Actualizar
          </button>
          <button 
            onClick={resetData}
            className="btn btn-danger"
            style={{ 
              padding: "0.6rem 1rem", 
              fontSize: "0.85rem",
              background: "rgba(244, 63, 94, 0.08)",
              border: "1px solid rgba(244, 63, 94, 0.2)",
              color: "var(--color-danger)"
            }}
            title="Restaurar a datos de prueba iniciales"
          >
            <RotateCcw size={14} /> Restablecer Mocks
          </button>
        </div>
      </div>

      {/* 2. Tarjetas de Métricas de Alto Nivel */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "1.25rem"
      }}>
        {/* Metrica 1: Score de Satisfacción */}
        <div className="glass-card" style={{ display: "flex", alignItems: "center", justifyBetween: "space-between", gap: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 600 }}>Satisfacción Global</span>
            <span style={{ fontSize: "2rem", fontWeight: 800, color: getScoreColor(overallScore) }}>
              {overallScore}%
            </span>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "3px" }}>
              <TrendingUp size={12} color="var(--color-secondary)" /> Promedio de 15 dimensiones
            </span>
          </div>
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            background: `${getScoreColor(overallScore)}10`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: getScoreColor(overallScore),
            marginLeft: "auto"
          }}>
            <BarChart3 size={24} />
          </div>
        </div>

        {/* Metrica 2: Encuestas Registradas */}
        <div className="glass-card" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 600 }}>Encuestas Completadas</span>
            <span style={{ fontSize: "2rem", fontWeight: 800, color: "white" }}>
              {totalSurveys}
            </span>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
              Respuestas 100% anónimas
            </span>
          </div>
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            background: "rgba(255, 255, 255, 0.03)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-primary)",
            marginLeft: "auto"
          }}>
            <FileText size={24} />
          </div>
        </div>

        {/* Metrica 3: Alertas Críticas */}
        <div className="glass-card" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 600 }}>Focos de Atención</span>
            <span style={{ 
              fontSize: "2rem", 
              fontWeight: 800, 
              color: alerts.length > 0 ? "var(--color-danger)" : "var(--color-secondary)" 
            }}>
              {alerts.length}
            </span>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
              {alerts.filter(a => a.type === "danger").length} alertas críticas activas
            </span>
          </div>
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            background: alerts.length > 0 ? "rgba(244, 63, 94, 0.1)" : "rgba(16, 185, 129, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: alerts.length > 0 ? "var(--color-danger)" : "var(--color-secondary)",
            marginLeft: "auto"
          }}>
            <ShieldAlert size={24} />
          </div>
        </div>
      </div>

      {/* 3. Panel Dividido: Gráfica de Prioridades y Ranking de Departamentos */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1.2fr 1fr",
        gap: "1.5rem"
      }} className="dashboard-grid-split">
        
        {/* Lado Izquierdo: Gráfica de Dimensiones */}
        <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Índices de Clima por Dimensión</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Calificación promedio convertida a porcentaje.</p>
          </div>
          <PriorityChart data={categoryScores} />
        </div>

        {/* Lado Derecho: Ranking de Intervención */}
        <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Prioridad de Intervención por Departamento</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Ordenado de menor a mayor satisfacción general.</p>
          </div>
          <CompanyRanking rankings={priorityRankings} />
        </div>
      </div>

      {/* 4. Banner consolidado de Alertas de Prioridad */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
          ⚠️ Plan de Atención Prioritario
        </h3>
        <AlertsBanner alerts={alerts} />
      </div>

      {/* 5. Vista de Desglose Detallado por Departamento (Acordeones) */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Desglose Detallado por Departamento</h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1rem"
        }}>
          {departmentScores.map((dept) => (
            <DepartmentCard key={dept.name} dept={dept} />
          ))}
        </div>
      </div>

      {/* 6. Buzón de Sugerencias Anónimas (Filtros + Lista de comentarios) */}
      <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <MessageSquare size={18} /> Buzón de Sugerencias y Comentarios Anónimos
            </h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Retroalimentación libre de los colaboradores.</p>
          </div>

          {/* Filtros de Comentarios */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              onClick={() => setCommentFilter("all")}
              className={`btn ${commentFilter === "all" ? "btn-primary" : "btn-secondary"}`}
              style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem", borderRadius: "8px" }}
            >
              Todos ({recentComments.length})
            </button>
            <button
              onClick={() => setCommentFilter("critical")}
              className={`btn ${commentFilter === "critical" ? "btn-primary" : "btn-secondary"}`}
              style={{ 
                padding: "0.35rem 0.75rem", 
                fontSize: "0.75rem", 
                borderRadius: "8px",
                borderColor: commentFilter !== "critical" && recentComments.some(c => c.isCritical) ? "var(--color-danger)" : "var(--border-color)"
              }}
            >
              🚨 Alertas Éticas ({recentComments.filter(c => c.isCritical).length})
            </button>
            {getUniqueDeptsWithComments.map((dept) => (
              <button
                key={dept}
                onClick={() => setCommentFilter(`dept-${dept}`)}
                className={`btn ${commentFilter === `dept-${dept}` ? "btn-primary" : "btn-secondary"}`}
                style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem", borderRadius: "8px" }}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Comentarios */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          maxHeight: "350px",
          overflowY: "auto",
          paddingRight: "0.5rem"
        }} className="comments-scroll-list">
          {filteredComments.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "2.5rem",
              color: "var(--text-muted)",
              fontSize: "0.85rem"
            }}>
              No se encontraron comentarios que coincidan con el filtro seleccionado.
            </div>
          ) : (
            filteredComments.map((c) => {
              const date = new Date(c.timestamp).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
              return (
                <div 
                  key={c.id}
                  style={{
                    background: c.isCritical ? "rgba(244,63,94,0.04)" : "rgba(255,255,255,0.01)",
                    border: c.isCritical ? "1px solid rgba(244,63,94,0.15)" : "1px solid var(--border-color)",
                    borderRadius: "10px",
                    padding: "0.85rem 1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.35rem"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontWeight: 700, color: "white" }}>{c.department}</span>
                      {c.isCritical && (
                        <span style={{
                          background: "var(--color-danger)",
                          color: "white",
                          padding: "0.1rem 0.35rem",
                          borderRadius: "4px",
                          fontSize: "0.6rem",
                          fontWeight: 700
                        }}>
                          🚨 {c.alertType || "CRÍTICO"}
                        </span>
                      )}
                    </div>
                    <span style={{ color: "var(--text-muted)" }}>{date}</span>
                  </div>
                  
                  <p style={{
                    fontSize: "0.85rem",
                    color: "var(--text-primary)",
                    lineHeight: "1.4",
                    fontStyle: "italic"
                  }}>
                    " {c.comment} "
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Estilos responsivos */}
      <style>{`
        @media (max-width: 900px) {
          .dashboard-grid-split {
            grid-template-columns: 1fr !important;
          }
        }
        .comments-scroll-list::-webkit-scrollbar {
          width: 5px;
        }
        .comments-scroll-list::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.06);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
