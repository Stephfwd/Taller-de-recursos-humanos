import React, { useState, useRef, useEffect } from "react";
import { Send, CornerDownLeft } from "lucide-react";

export const ChatInput = ({ onSendMessage, disabled, placeholder = "Escribe tu consulta laboral aquí..." }) => {
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (inputValue.trim() === "" || disabled) return;
    onSendMessage(inputValue.trim());
    setInputValue("");
    
    // Resetear altura del textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    // Si presiona enter sin shift, envía el mensaje
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Ajustar automáticamente la altura del textarea según el contenido
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  return (
    <div style={{
      display: "flex",
      gap: "0.75rem",
      alignItems: "flex-end",
      background: "var(--bg-card)",
      border: "1px solid var(--border-color)",
      borderRadius: "16px",
      padding: "0.5rem 0.75rem",
      backdropFilter: "var(--glass-blur)",
      position: "relative"
    }}>
      <textarea
        ref={textareaRef}
        rows={1}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          flexGrow: 1,
          background: "none",
          border: "none",
          color: "var(--text-primary)",
          fontFamily: "inherit",
          fontSize: "0.95rem",
          outline: "none",
          resize: "none",
          padding: "0.5rem 0",
          maxHeight: "120px",
          minHeight: "24px",
          lineHeight: "1.5"
        }}
      />

      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        paddingBottom: "0.25rem"
      }}>
        <span 
          style={{
            fontSize: "0.7rem",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            gap: "2px"
          }}
          className="hide-on-mobile"
        >
          <CornerDownLeft size={10} />
          Enter para enviar
        </span>
        
        <button
          onClick={handleSend}
          disabled={inputValue.trim() === "" || disabled}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: inputValue.trim() === "" || disabled ? "rgba(255,255,255,0.05)" : "var(--color-primary)",
            color: inputValue.trim() === "" || disabled ? "var(--text-muted)" : "white",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: inputValue.trim() === "" || disabled ? "not-allowed" : "pointer",
            transition: "all var(--transition-fast)",
            boxShadow: inputValue.trim() === "" || disabled ? "none" : "0 4px 10px var(--color-primary-glow)"
          }}
          className="send-button"
        >
          <Send size={16} />
        </button>
      </div>

      <style>{`
        .send-button:not(:disabled):hover {
          background: var(--color-primary-hover);
          transform: scale(1.05);
        }
        .send-button:not(:disabled):active {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
};

export default ChatInput;
