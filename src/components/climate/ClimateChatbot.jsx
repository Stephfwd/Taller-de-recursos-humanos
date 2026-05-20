import React from "react";
import { useSurvey } from "../../hooks/useSurvey";
import { surveyQuestions, departments } from "../../data/surveyQuestions";
import SurveyProgress from "./SurveyProgress";
import { ClipboardList, ChevronLeft, ChevronRight, CheckCircle, Send, Users } from "lucide-react";

export const ClimateChatbot = () => {
  const {
    department,
    answers,
    comment,
    setComment,
    currentStep,
    totalQuestions,
    isSubmitting,
    selectDepartment,
    answerQuestion,
    nextStep,
    prevStep,
    submitSurvey,
    resetSurvey
  } = useSurvey();

  const currentQuestion = surveyQuestions[currentStep - 1];

  // Sin emojis — cada opción tiene color semántico y texto corto para el badge
  const ratingOptions = [
    { value: 1, label: "Totalmente en desacuerdo", shortLabel: "Muy mal",    color: "#f43f5e", textColor: "#fda4af" },
    { value: 2, label: "En desacuerdo",            shortLabel: "Mal",        color: "#f59e0b", textColor: "#fcd34d" },
    { value: 3, label: "Neutral",                  shortLabel: "Regular",    color: "#6b7280", textColor: "#d1d5db" },
    { value: 4, label: "De acuerdo",               shortLabel: "Bien",       color: "#10b981", textColor: "#6ee7b7" },
    { value: 5, label: "Totalmente de acuerdo",    shortLabel: "Muy bien",   color: "#0ea5e9", textColor: "#7dd3fc" }
  ];

  const handleRatingSelect = (val) => {
    answerQuestion(currentQuestion.id, val);
    setTimeout(() => { nextStep(); }, 250);
  };

  return (
    <div className="glass-card" style={{
      maxWidth: "700px",
      margin: "2rem auto",
      padding: "2rem",
      minHeight: "450px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      position: "relative"
    }}>

      {/* ── 1. Selección de departamento ─────────────────────────────── */}
      {currentStep === 0 && (
        <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <div style={{
              width: "60px", height: "60px", borderRadius: "14px",
              background: "linear-gradient(135deg, var(--color-primary), #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 1.25rem",
              boxShadow: "0 8px 24px rgba(99, 102, 241, 0.3)"
            }}>
              <ClipboardList size={28} color="white" />
            </div>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800 }} className="gradient-text-indigo">
              Encuesta de Clima Laboral
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "0.5rem" }}>
              Tu opinión es muy valiosa para construir un mejor lugar de trabajo.
              Esta encuesta es <strong>100% anónima</strong> y confidencial.
            </p>
          </div>

          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1.5rem" }}>
            <h4 style={{ fontSize: "1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Users size={16} /> Selecciona tu departamento para iniciar:
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => selectDepartment(dept)}
                  className="dept-btn"
                  style={{
                    padding: "0.9rem 1.25rem",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all var(--transition-fast)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
                  {dept}
                  <ChevronRight size={15} style={{ color: "var(--text-muted)" }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 2. Preguntas ─────────────────────────────────────────────── */}
      {currentStep >= 1 && currentStep <= totalQuestions && currentQuestion && (
        <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem", flexGrow: 1 }}>

          {/* Progreso + categoría */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <SurveyProgress current={currentStep} total={totalQuestions} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{
                background: "rgba(99, 102, 241, 0.1)",
                color: "var(--color-primary)",
                padding: "0.3rem 0.75rem",
                borderRadius: "20px",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.3px"
              }}>
                {currentQuestion.category}
              </span>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                Departamento: {department}
              </span>
            </div>
          </div>

          {/* Texto de la pregunta */}
          <div style={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem 0" }}>
            <h3 style={{
              fontSize: "1.35rem", fontWeight: 600,
              textAlign: "center", lineHeight: "1.45",
              maxWidth: "580px"
            }}>
              {currentQuestion.text}
            </h3>
          </div>

          {/* Opciones de calificación — colores semánticos sin emojis */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "0.65rem",
            width: "100%"
          }} className="rating-grid">
            {ratingOptions.map((opt) => {
              const isSelected = answers[currentQuestion.id] === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleRatingSelect(opt.value)}
                  className={`rating-btn ${isSelected ? "selected" : ""}`}
                  title={opt.label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.6rem",
                    padding: "1rem 0.4rem",
                    borderRadius: "14px",
                    background: isSelected ? `${opt.color}18` : "rgba(255,255,255,0.02)",
                    border: isSelected ? `2px solid ${opt.color}` : "1px solid var(--border-color)",
                    cursor: "pointer",
                    transition: "all var(--transition-fast)"
                  }}
                >
                  {/* Círculo de color en lugar del emoji */}
                  <div style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: isSelected ? opt.color : `${opt.color}30`,
                    border: `2px solid ${isSelected ? opt.color : `${opt.color}50`}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all var(--transition-fast)"
                  }}>
                    <span style={{
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      color: isSelected ? "white" : opt.textColor
                    }}>
                      {opt.value}
                    </span>
                  </div>

                  {/* Etiqueta corta */}
                  <span className="rating-label" style={{
                    fontSize: "0.65rem",
                    textAlign: "center",
                    fontWeight: 700,
                    lineHeight: 1.2,
                    color: isSelected ? opt.textColor : "var(--text-muted)"
                  }}>
                    {opt.shortLabel}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Leyenda completa debajo del grid */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.68rem",
            color: "var(--text-muted)",
            padding: "0 0.25rem"
          }}>
            <span style={{ color: ratingOptions[0].color, fontWeight: 600 }}>{ratingOptions[0].label}</span>
            <span style={{ color: ratingOptions[4].color, fontWeight: 600 }}>{ratingOptions[4].label}</span>
          </div>

          {/* Navegación */}
          <div style={{
            display: "flex", justifyContent: "space-between",
            paddingTop: "1rem", borderTop: "1px solid var(--border-color)"
          }}>
            <button onClick={prevStep} className="btn btn-secondary" style={{ padding: "0.6rem 1.2rem" }}>
              <ChevronLeft size={16} /> Atrás
            </button>
            <button
              onClick={nextStep}
              disabled={answers[currentQuestion.id] === undefined}
              className="btn btn-primary"
              style={{ padding: "0.6rem 1.2rem" }}
            >
              Siguiente <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── 3. Comentario opcional ───────────────────────────────────── */}
      {currentStep === totalQuestions + 1 && (
        <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem", flexGrow: 1 }}>
          <div>
            <h3 style={{ fontSize: "1.35rem", fontWeight: 700 }} className="gradient-text-indigo">
              Comentarios adicionales (opcional)
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
              Tus sugerencias ayudan al equipo directivo a enfocar mejor las iniciativas de mejora.
            </p>
          </div>
          <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Escribe aquí de forma libre tus sugerencias o inquietudes..."
              style={{
                width: "100%", flexGrow: 1, minHeight: "150px",
                background: "var(--bg-input)", border: "1px solid var(--border-color)",
                borderRadius: "12px", padding: "1rem", color: "white",
                fontFamily: "inherit", fontSize: "0.95rem", resize: "none", outline: "none"
              }}
              maxLength={400}
            />
            <span style={{ alignSelf: "flex-end", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              {comment.length} / 400 caracteres
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "1rem", borderTop: "1px solid var(--border-color)" }}>
            <button onClick={prevStep} className="btn btn-secondary">
              <ChevronLeft size={16} /> Atrás
            </button>
            <button onClick={submitSurvey} disabled={isSubmitting} className="btn btn-emerald">
              {isSubmitting ? "Enviando..." : <><Send size={14} /> Enviar Encuesta</>}
            </button>
          </div>
        </div>
      )}

      {/* ── 4. Pantalla de éxito ─────────────────────────────────────── */}
      {currentStep === totalQuestions + 2 && (
        <div className="animate-fade-in" style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", textAlign: "center", gap: "1.5rem",
          padding: "2rem 0", flexGrow: 1
        }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "50%",
            background: "rgba(16, 185, 129, 0.1)", color: "var(--color-secondary)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 24px rgba(16, 185, 129, 0.2)"
          }}>
            <CheckCircle size={36} />
          </div>
          <div>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800 }} className="gradient-text-emerald">
              Encuesta completada
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", maxWidth: "420px", margin: "0.5rem auto 0" }}>
              Tus respuestas anónimas han sido registradas. Los resultados agregados estarán disponibles de forma inmediata en el Dashboard de RRHH.
            </p>
          </div>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", justifyContent: "center" }}>
            <button onClick={resetSurvey} className="btn btn-secondary" style={{ width: "160px" }}>
              Nueva Encuesta
            </button>
            <a
              href="/dashboard"
              onClick={(e) => { e.preventDefault(); window.location.href = "/dashboard"; }}
              className="btn btn-primary"
              style={{ width: "180px", textDecoration: "none" }}
            >
              Ver Dashboard RRHH
            </a>
          </div>
        </div>
      )}

      <style>{`
        .dept-btn:hover {
          background: rgba(99, 102, 241, 0.08) !important;
          border-color: var(--color-primary) !important;
          transform: translateX(4px);
        }
        .rating-btn:hover:not(.selected) {
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: var(--border-color-hover) !important;
          transform: translateY(-2px);
        }
        .rating-btn.selected { transform: translateY(-2px); }
        @media (max-width: 600px) {
          .rating-grid { grid-template-columns: 1fr !important; }
          .rating-btn {
            flex-direction: row !important;
            justify-content: flex-start !important;
            padding: 0.75rem 1rem !important;
            gap: 0.75rem !important;
          }
          .rating-label { text-align: left !important; font-size: 0.8rem !important; }
        }
      `}</style>
    </div>
  );
};

export default ClimateChatbot;
