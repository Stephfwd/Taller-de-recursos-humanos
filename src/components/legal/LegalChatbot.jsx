import React from "react";
import ChatWindow from "../chat/ChatWindow";
import { useChat } from "../../hooks/useChat";
import { Scale, Info, ShieldCheck, PhoneCall, BookOpen } from "lucide-react";

export const LegalChatbot = () => {
  const { messages, isTyping, sendMessage, clearChat, quickReplies } = useChat();

  const temasCubiertos = [
    "Vacaciones y días de descanso",
    "Jornadas laborales y horas extra",
    "Salarios, aguinaldo y liquidaciones",
    "Permisos, incapacidades, maternidad y paternidad",
    "Causales de despido con y sin responsabilidad patronal",
    "Contratos de trabajo y período de prueba"
  ];

  const casosEscalados = [
    "Conflictos personales o situaciones específicas",
    "Solicitudes de documentos o trámites internos",
    "Casos de acoso, discriminación u hostigamiento",
    "Cualquier tema fuera del Código de Trabajo"
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} className="animate-fade-in">

      {/* ── Cabecera del asistente ─────────────────────────────────────── */}
      <div
        className="glass-card"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.5rem",
          padding: "1.25rem 1.5rem",
          borderLeft: "4px solid var(--color-primary)",
          flexWrap: "wrap"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "rgba(99, 102, 241, 0.1)",
              border: "1px solid rgba(99, 102, 241, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-primary)",
              flexShrink: 0
            }}
          >
            <Scale size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "white", lineHeight: 1.2 }}>
              HR Legal Assistant
            </h3>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
              Asistente virtual especializado en el <strong style={{ color: "var(--color-primary)" }}>Código de Trabajo vigente</strong>. Respuestas con base legal citada.
            </p>
          </div>
        </div>

        {/* Badge de estado */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            background: "rgba(16, 185, 129, 0.08)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            borderRadius: "20px",
            padding: "0.35rem 0.85rem",
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "var(--color-secondary)"
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "var(--color-secondary)",
              boxShadow: "0 0 6px var(--color-secondary)",
              animation: "pulse-glow 2s infinite"
            }}
          />
          En línea
        </div>
      </div>

      {/* ── Panel de cobertura + escalada (colapsable) ─────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem"
        }}
        className="legal-info-grid"
      >
        {/* Temas que puede responder */}
        <div
          className="glass-card"
          style={{
            padding: "1rem 1.25rem",
            borderLeft: "3px solid var(--color-primary)",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <BookOpen size={15} style={{ color: "var(--color-primary)" }} />
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-primary)" }}>
              TEMAS QUE PUEDO RESPONDER
            </span>
          </div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {temasCubiertos.map((t, i) => (
              <li
                key={i}
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem"
                }}
              >
                <span style={{ color: "var(--color-secondary)", fontSize: "0.7rem" }}>✓</span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Casos que escala a RRHH */}
        <div
          className="glass-card"
          style={{
            padding: "1rem 1.25rem",
            borderLeft: "3px solid var(--color-warning)",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <PhoneCall size={15} style={{ color: "var(--color-warning)" }} />
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-warning)" }}>
              ESCALO A UN AGENTE CUANDO...
            </span>
          </div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {casosEscalados.map((t, i) => (
              <li
                key={i}
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem"
                }}
              >
                <span style={{ color: "var(--color-warning)", fontSize: "0.7rem" }}>→</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Ventana principal del chat ─────────────────────────────────── */}
      <ChatWindow
        messages={messages}
        isTyping={isTyping}
        onSendMessage={sendMessage}
        onClearChat={clearChat}
        quickReplies={quickReplies}
        placeholder="Escribe tu consulta sobre el Código de Trabajo..."
      />

      {/* ── Aviso legal ───────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "0.75rem",
          padding: "0.85rem 1.1rem",
          background: "rgba(245, 158, 11, 0.04)",
          border: "1px solid rgba(245, 158, 11, 0.12)",
          borderRadius: "12px",
          color: "var(--text-muted)",
          fontSize: "0.78rem",
          lineHeight: "1.5"
        }}
      >
        <Info size={14} style={{ flexShrink: 0, marginTop: "1px", color: "var(--color-warning)" }} />
        <p>
          <strong style={{ color: "var(--color-warning)" }}>Aviso Legal:</strong>{" "}
          Este asistente responde únicamente con base en el Código de Trabajo vigente y cita el
          artículo correspondiente en cada respuesta. Las respuestas son de carácter informativo
          y no constituyen un dictamen legal formal. Para situaciones específicas o sensibles,
          el asistente te conectará automáticamente con el equipo de Relaciones Laborales.
        </p>
      </div>

      <style>{`
        @media (max-width: 680px) {
          .legal-info-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LegalChatbot;
