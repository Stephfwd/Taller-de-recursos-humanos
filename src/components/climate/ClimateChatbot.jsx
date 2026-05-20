import React from "react";
import { useSurvey } from "../../hooks/useSurvey";
import { surveyQuestions, departments } from "../../data/surveyQuestions";
import SurveyProgress from "./SurveyProgress";
import { Heart, ChevronLeft, ChevronRight, CheckCircle, Send, Users } from "lucide-react";

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

  const ratingOptions = [
    { value: 1, label: "Totalmente en desacuerdo", emoji: "😠", color: "#f43f5e" },
    { value: 2, label: "En desacuerdo", emoji: "🙁", color: "#f59e0b" },
    { value: 3, label: "Neutral", emoji: "😐", color: "#9ca3af" },
    { value: 4, label: "De acuerdo", emoji: "🙂", color: "#10b981" },
    { value: 5, label: "Totalmente de acuerdo", emoji: "😍", color: "#0ea5e9" }
  ];

  // Manejar el click de una opción de respuesta
  const handleRatingSelect = (val) => {
    answerQuestion(currentQuestion.id, val);
    // Pequeño retraso antes de avanzar para ver la selección
    setTimeout(() => {
      nextStep();
    }, 250);
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
      
      {/* 1. Pantalla de Bienvenida / Selección de Departamento */}
      {currentStep === 0 && (
        <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <div style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--color-primary), #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.25rem",
              boxShadow: "0 8px 24px rgba(99, 102, 241, 0.3)"
            }}>
              <Heart size={28} color="white" />
            </div>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800 }} className="gradient-text-indigo">
              Encuesta de Clima Laboral
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "0.5rem" }}>
              Tu opinión es muy valiosa para construir un mejor lugar de trabajo. Esta encuesta es <strong>100% anónima</strong> y confidencial.
            </p>
          </div>

          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1.5rem" }}>
            <h4 style={{ fontSize: "1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Users size={16} /> Selecciona tu Departamento para iniciar:
            </h4>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem"
            }}>
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => selectDepartment(dept)}
                  className="dept-btn"
                  style={{
                    padding: "1rem 1.25rem",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all var(--transition-fast)"
                  }}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Preguntas de la Encuesta */}
      {currentStep >= 1 && currentStep <= totalQuestions && currentQuestion && (
        <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem", flexGrow: 1 }}>
          {/* Cabecera de pregunta */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <SurveyProgress current={currentStep} total={totalQuestions} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
              <span style={{
                background: "rgba(99, 102, 241, 0.1)",
                color: "var(--color-primary)",
                padding: "0.35rem 0.75rem",
                borderRadius: "20px",
                fontSize: "0.75rem",
                fontWeight: 600
              }}>
                📁 {currentQuestion.category}
              </span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Depto: {department}
              </span>
            </div>
          </div>

          {/* Texto de Pregunta */}
          <div style={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem 0" }}>
            <h3 style={{
              fontSize: "1.4rem",
              fontWeight: 600,
              textAlign: "center",
              lineHeight: "1.4",
              maxWidth: "580px"
            }}>
              {currentQuestion.text}
            </h3>
          </div>

          {/* Opciones de Rating */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "0.75rem",
            width: "100%"
          }} className="rating-grid">
            {ratingOptions.map((opt) => {
              const isSelected = answers[currentQuestion.id] === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleRatingSelect(opt.value)}
                  className={`rating-btn ${isSelected ? "selected" : ""}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "1rem 0.5rem",
                    borderRadius: "14px",
                    background: isSelected ? `${opt.color}20` : "rgba(255,255,255,0.02)",
                    border: isSelected ? `2px solid ${opt.color}` : "1px solid var(--border-color)",
                    cursor: "pointer",
                    transition: "all var(--transition-fast)"
                  }}
                  title={opt.label}
                >
                  <span style={{ fontSize: "2rem" }}>{opt.emoji}</span>
                  <span className="rating-label" style={{
                    fontSize: "0.7rem",
                    textAlign: "center",
                    fontWeight: 600,
                    color: isSelected ? "white" : "var(--text-secondary)"
                  }}>{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Navegación inferior */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "1.5rem",
            paddingTop: "1rem",
            borderTop: "1px solid var(--border-color)"
          }}>
            <button
              onClick={prevStep}
              className="btn btn-secondary"
              style={{ padding: "0.6rem 1.2rem" }}
            >
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

      {/* 3. Pantalla de Comentario Opcional */}
      {currentStep === totalQuestions + 1 && (
        <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem", flexGrow: 1 }}>
          <div>
            <h3 style={{ fontSize: "1.35rem", fontWeight: 700 }} className="gradient-text-indigo">
              ¿Hay algo más que quieras compartir?
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
              Tus sugerencias ayudan al equipo directivo a enfocar mejor las iniciativas de mejora. Este comentario es totalmente opcional.
            </p>
          </div>

          <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Escribe aquí de forma libre y honesta tus sugerencias o inquietudes..."
              style={{
                width: "100%",
                flexGrow: 1,
                minHeight: "150px",
                background: "var(--bg-input)",
                border: "1px solid var(--border-color)",
                borderRadius: "12px",
                padding: "1rem",
                color: "white",
                fontFamily: "inherit",
                fontSize: "0.95rem",
                resize: "none",
                outline: "none"
              }}
              maxLength={400}
            />
            <span style={{ alignSelf: "flex-end", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              {comment.length} / 400 caracteres
            </span>
          </div>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid var(--border-color)",
            paddingTop: "1rem"
          }}>
            <button
              onClick={prevStep}
              className="btn btn-secondary"
            >
              <ChevronLeft size={16} /> Atrás
            </button>
            <button
              onClick={submitSurvey}
              disabled={isSubmitting}
              className="btn btn-emerald"
            >
              {isSubmitting ? "Enviando..." : (
                <>Enviar Encuesta <Send size={14} /></>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 4. Pantalla de Éxito / Finalizado */}
      {currentStep === totalQuestions + 2 && (
        <div className="animate-fade-in" style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: "1.5rem",
          padding: "2rem 0",
          flexGrow: 1
        }}>
          <div style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: "rgba(16, 185, 129, 0.1)",
            color: "var(--color-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 24px rgba(16, 185, 129, 0.2)",
            marginBottom: "0.5rem"
          }}>
            <CheckCircle size={36} />
          </div>

          <div>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800 }} className="gradient-text-emerald">
              ¡Muchas gracias!
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", maxWidth: "420px", margin: "0.5rem auto 0" }}>
              Tus respuestas anónimas han sido registradas. Los resultados agregados serán calculados en tiempo real para el análisis del equipo de Recursos Humanos.
            </p>
          </div>

          <div style={{
            display: "flex",
            gap: "1rem",
            marginTop: "1rem",
            width: "100%",
            justifyContent: "center"
          }}>
            <button
              onClick={resetSurvey}
              className="btn btn-secondary"
              style={{ width: "160px" }}
            >
              Nueva Encuesta
            </button>
            <a
              href="/dashboard"
              onClick={(e) => {
                e.preventDefault();
                // Navegar programáticamente usando React Router o recarga si es necesario
                window.location.href = "/dashboard";
              }}
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
          background: rgba(255, 255, 255, 0.06) !important;
          border-color: var(--border-color-hover) !important;
          transform: translateY(-2px);
        }
        .rating-btn.selected {
          box-shadow: 0 4px 15px rgba(255, 255, 255, 0.02);
          transform: translateY(-2px);
        }
        @media (max-width: 600px) {
          .rating-grid {
            grid-template-columns: 1fr !important;
          }
          .rating-btn {
            flex-direction: row !important;
            justify-content: flex-start !important;
            padding: 0.75rem 1rem !important;
            gap: 1rem !important;
          }
          .rating-label {
            text-align: left !important;
            font-size: 0.85rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ClimateChatbot;
