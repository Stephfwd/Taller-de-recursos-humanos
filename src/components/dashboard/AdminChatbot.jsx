import React from "react";
import ChatWindow from "../chat/ChatWindow";
import { useAdminChat } from "../../hooks/useAdminChat";
import { Shield, Info, Activity } from "lucide-react";

export const AdminChatbot = () => {
  const { messages, isTyping, sendMessage, clearChat, quickReplies } = useAdminChat('ADMIN');

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
            <Shield size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "white", lineHeight: 1.2 }}>
              HR Admin Agent
            </h3>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
              Analítica e inteligencia artificial para el panel de administración.
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
          Seguro (En línea)
        </div>
      </div>

      {/* ── Ventana principal del chat ─────────────────────────────────── */}
      <ChatWindow
        messages={messages}
        isTyping={isTyping}
        onSendMessage={sendMessage}
        onClearChat={clearChat}
        quickReplies={quickReplies}
        placeholder="Ej: 'dashboard', 'críticos', 'nueva empresa'..."
      />

      {/* ── Aviso legal / Privacidad ───────────────────────────────────────────────── */}
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
        <Activity size={14} style={{ flexShrink: 0, marginTop: "1px", color: "var(--color-warning)" }} />
        <p>
          <strong style={{ color: "var(--color-warning)" }}>Privacidad de Datos:</strong>{" "}
          Este asistente procesa exclusivamente datos agregados. El sistema nunca revelará
          datos individuales de los empleados, manteniendo la total confidencialidad de la información.
        </p>
      </div>
    </div>
  );
};

export default AdminChatbot;
