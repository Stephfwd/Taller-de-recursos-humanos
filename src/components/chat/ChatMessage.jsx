import React from "react";
import { User, Bot, Clock } from "lucide-react";

export const ChatMessage = ({ message }) => {
  const { sender, text, timestamp, metadata } = message;
  const isBot = sender === "bot";

  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderInlineMarkdown = (text) => {
    // Dividir por ** para encontrar negritas
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} style={{ color: "white", fontWeight: 700 }}>{part}</strong>;
      }
      
      // Manejar saltos de línea internos
      const subParts = part.split("\n");
      if (subParts.length > 1) {
        return subParts.map((sub, j) => (
          <React.Fragment key={j}>
            {sub}
            {j < subParts.length - 1 && <br />}
          </React.Fragment>
        ));
      }
      return part;
    });
  };

  const parseMarkdown = (text) => {
    if (!text) return null;

    // Dividir por párrafos (doble salto de línea)
    const paragraphs = text.split("\n\n");

    return paragraphs.map((para, index) => {
      const trimmedPara = para.trim();
      
      // Detectar si el párrafo es una lista de viñetas
      if (trimmedPara.startsWith("- ") || trimmedPara.startsWith("* ") || trimmedPara.split("\n").every(l => l.trim().startsWith("- ") || l.trim().startsWith("* "))) {
        const items = trimmedPara.split("\n").map(line => line.replace(/^[-*]\s+/, "").trim());
        return (
          <ul key={index} style={{ 
            marginBottom: "0.75rem", 
            paddingLeft: "1.25rem",
            listStyleType: "disc" 
          }}>
            {items.map((item, i) => (
              <li key={i} style={{ marginBottom: "0.35rem", color: "var(--text-primary)" }}>
                {renderInlineMarkdown(item)}
              </li>
            ))}
          </ul>
        );
      }

      // Párrafo normal
      return (
        <p key={index} style={{ 
          marginBottom: "0.75rem", 
          lineHeight: "1.6",
          color: isBot ? "var(--text-primary)" : "white"
        }}>
          {renderInlineMarkdown(trimmedPara)}
        </p>
      );
    });
  };

  return (
    <div style={{
      display: "flex",
      gap: "0.75rem",
      alignSelf: isBot ? "flex-start" : "flex-end",
      flexDirection: isBot ? "row" : "row-reverse",
      maxWidth: "85%",
      animation: "fadeIn 0.3s ease-out forwards"
    }}>
      {/* Avatar */}
      <div style={{
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        background: isBot 
          ? "linear-gradient(135deg, var(--color-primary), #4f46e5)" 
          : "linear-gradient(135deg, var(--color-secondary), #059669)",
        boxShadow: isBot 
          ? "0 4px 10px var(--color-primary-glow)" 
          : "0 4px 10px var(--color-secondary-glow)"
      }}>
        {isBot ? <Bot size={16} color="white" /> : <User size={16} color="white" />}
      </div>

      {/* Bubble Content */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <div 
          className={`chat-bubble ${isBot ? "bot" : "user"}`}
          style={{
            maxWidth: "100%",
            padding: "0.85rem 1.1rem",
            borderRadius: "16px",
            borderTopLeftRadius: isBot ? "4px" : "16px",
            borderTopRightRadius: isBot ? "16px" : "4px",
            boxShadow: isBot ? "var(--glass-shadow)" : "0 4px 15px rgba(99, 102, 241, 0.2)",
            background: isBot ? "var(--bg-card)" : "var(--color-primary)",
            backdropFilter: isBot ? "var(--glass-blur)" : "none",
            border: isBot ? "1px solid var(--border-color)" : "none",
          }}
        >
          {parseMarkdown(text)}

          {metadata && metadata.article && (
            <div style={{
              marginTop: "0.75rem",
              paddingTop: "0.5rem",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              fontSize: "0.75rem",
              color: "var(--color-secondary)",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.25rem"
            }}>
              ⚖️ Referencia: {metadata.article}
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span style={{
          fontSize: "0.7rem",
          color: "var(--text-muted)",
          alignSelf: isBot ? "flex-start" : "flex-end",
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          padding: "0 0.25rem"
        }}>
          <Clock size={10} />
          {formatTime(timestamp)}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
