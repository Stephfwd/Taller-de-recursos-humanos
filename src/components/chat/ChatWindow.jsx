import React, { useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import { MessageSquare, Trash2 } from "lucide-react";

export const ChatWindow = ({ 
  messages, 
  isTyping, 
  onSendMessage, 
  onClearChat, 
  quickReplies = [], 
  placeholder 
}) => {
  const scrollRef = useRef(null);

  // Scroll automático al fondo cuando cambian los mensajes o el estado de escritura
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="glass-card" style={{
      display: "flex",
      flexDirection: "column",
      height: "calc(100vh - 180px)",
      minHeight: "500px",
      padding: "1rem",
      gap: "1rem"
    }}>
      {/* Cabecera del Chat */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid var(--border-color)",
        paddingBottom: "0.75rem",
        marginBottom: "0.5rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: "10px",
            height: "10px",
            background: "var(--color-secondary)",
            borderRadius: "50%",
            boxShadow: "0 0 10px var(--color-secondary)"
          }} />
          <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>
            Sesión de Consulta Activa
          </span>
        </div>

        {onClearChat && (
          <button
            onClick={onClearChat}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              fontSize: "0.8rem",
              fontWeight: 500,
              padding: "0.25rem 0.5rem",
              borderRadius: "6px",
              transition: "all var(--transition-fast)"
            }}
            className="clear-chat-btn"
          >
            <Trash2 size={13} />
            Limpiar Chat
          </button>
        )}
      </div>

      {/* Cuerpo del Chat (Mensajes) */}
      <div 
        ref={scrollRef}
        style={{
          flexGrow: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          paddingRight: "0.5rem"
        }}
      >
        {messages.length === 0 ? (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "var(--text-muted)",
            gap: "0.75rem"
          }}>
            <MessageSquare size={40} style={{ opacity: 0.3 }} />
            <p style={{ fontSize: "0.9rem" }}>No hay mensajes. Envía una consulta para iniciar.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))
        )}
        
        {isTyping && <TypingIndicator />}
      </div>

      {/* Respuestas Rápidas (Sugerencias) */}
      {quickReplies.length > 0 && !isTyping && (
        <div style={{
          display: "flex",
          gap: "0.5rem",
          overflowX: "auto",
          padding: "0.25rem 0",
          scrollbarWidth: "none" // Ocultar barra en Firefox
        }} className="quick-replies-container">
          {quickReplies.map((reply, i) => (
            <button
              key={i}
              onClick={() => onSendMessage(reply.text)}
              style={{
                padding: "0.5rem 0.85rem",
                borderRadius: "20px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid var(--border-color)",
                color: "var(--text-secondary)",
                fontSize: "0.8rem",
                fontWeight: 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all var(--transition-fast)"
              }}
              className="quick-reply-btn"
            >
              {reply.label || reply.text}
            </button>
          ))}
        </div>
      )}

      {/* Input de Mensajes */}
      <div>
        <ChatInput 
          onSendMessage={onSendMessage} 
          disabled={isTyping} 
          placeholder={placeholder} 
        />
      </div>

      <style>{`
        .clear-chat-btn:hover {
          color: var(--color-danger) !important;
          background: rgba(244, 63, 94, 0.05) !important;
        }
        .quick-reply-btn:hover {
          border-color: var(--color-primary);
          color: white;
          background: rgba(99, 102, 241, 0.08);
          transform: translateY(-1px);
        }
        .quick-replies-container::-webkit-scrollbar {
          display: none; /* Ocultar barra en Chrome/Safari */
        }
      `}</style>
    </div>
  );
};

export default ChatWindow;
