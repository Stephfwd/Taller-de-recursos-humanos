import React from "react";
import ChatWindow from "../chat/ChatWindow";
import { useChat } from "../../hooks/useChat";
import { ShieldCheck, Info } from "lucide-react";

export const LegalChatbot = () => {
  const { messages, isTyping, sendMessage, clearChat, quickReplies } = useChat();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} className="animate-fade-in">
      {/* Encabezado descriptivo */}
      <div className="glass-card" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1.5rem",
        padding: "1.25rem 1.5rem",
        borderLeft: "4px solid var(--color-primary)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            background: "rgba(99, 102, 241, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-primary)"
          }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>HR Legal Assistant</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Asistente virtual especializado exclusivamente en el Código de Trabajo vigente.
            </p>
          </div>
        </div>
      </div>

      {/* Ventana de Chat */}
      <ChatWindow 
        messages={messages}
        isTyping={isTyping}
        onSendMessage={sendMessage}
        onClearChat={clearChat}
        quickReplies={quickReplies}
        placeholder="Escribe tu consulta laboral (ej. vacaciones, aguinaldo, horas extra)..."
      />

      {/* Nota Legal / Disclaimer */}
      <div style={{
        display: "flex",
        alignItems: "start",
        gap: "0.75rem",
        padding: "0.75rem 1rem",
        background: "rgba(245, 158, 11, 0.05)",
        border: "1px solid rgba(245, 158, 11, 0.15)",
        borderRadius: "12px",
        color: "var(--color-warning)",
        fontSize: "0.8rem",
        lineHeight: "1.4"
      }}>
        <Info size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
        <p>
          <strong>Aviso de RRHH:</strong> La información provista por este chatbot se basa en fragmentos del Código de Trabajo y guías internas de la empresa con fines puramente informativos. No representa un dictamen legal formal ni reemplaza el análisis personalizado de la dirección de Relaciones Laborales.
        </p>
      </div>
    </div>
  );
};

export default LegalChatbot;
