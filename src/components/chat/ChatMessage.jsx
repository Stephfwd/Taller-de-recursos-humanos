import React from "react";
import { User, Bot, Clock, PhoneCall, Scale } from "lucide-react";

export const ChatMessage = ({ message }) => {
  const { sender, text, timestamp, metadata } = message;
  const isBot = sender === "bot";
  const isEscalated = isBot && metadata?.escalated === true;

  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  /* ── Inline markdown renderer ─────────────────────────────────────────── */
  const renderInlineMarkdown = (rawText) => {
    // Dividir por ** para negritas
    const parts = rawText.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return (
          <strong key={i} style={{ color: "white", fontWeight: 700 }}>
            {part}
          </strong>
        );
      }
      // Saltos de línea internos dentro de un segmento
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

  /* ── Markdown to React nodes ──────────────────────────────────────────── */
  const parseMarkdown = (rawText) => {
    if (!rawText) return null;

    // Dividir por párrafos (doble salto de línea)
    const paragraphs = rawText.split("\n\n");

    return paragraphs.map((para, index) => {
      const trimmed = para.trim();

      // Separador horizontal "---"
      if (trimmed === "---") {
        return (
          <hr
            key={index}
            style={{
              border: "none",
              borderTop: "1px solid rgba(255, 255, 255, 0.07)",
              margin: "0.5rem 0"
            }}
          />
        );
      }

      // Líneas en cursiva (itálica) — _texto_
      const isItalic = trimmed.startsWith("_") && trimmed.endsWith("_");
      if (isItalic) {
        return (
          <p
            key={index}
            style={{
              marginBottom: "0.5rem",
              lineHeight: "1.5",
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              fontStyle: "italic"
            }}
          >
            {renderInlineMarkdown(trimmed.slice(1, -1))}
          </p>
        );
      }

      // Lista de viñetas: todos los items comienzan con "- " o "* "
      const lines = trimmed.split("\n");
      const isList = lines.every(
        (l) => l.trim().startsWith("- ") || l.trim().startsWith("* ")
      );
      if (isList) {
        return (
          <ul
            key={index}
            style={{
              marginBottom: "0.75rem",
              paddingLeft: "1.4rem",
              listStyleType: "disc"
            }}
          >
            {lines.map((line, i) => (
              <li
                key={i}
                style={{ marginBottom: "0.3rem", color: "var(--text-primary)" }}
              >
                {renderInlineMarkdown(line.replace(/^[-*]\s+/, "").trim())}
              </li>
            ))}
          </ul>
        );
      }

      // Párrafo normal
      return (
        <p
          key={index}
          style={{
            marginBottom: "0.75rem",
            lineHeight: "1.6",
            color: isBot ? "var(--text-primary)" : "white"
          }}
        >
          {renderInlineMarkdown(trimmed)}
        </p>
      );
    });
  };

  /* ── Estilos de burbuja según tipo de mensaje ─────────────────────────── */
  const getBubbleStyle = () => {
    if (!isBot) {
      // Burbuja del usuario: color primario
      return {
        background: "var(--color-primary)",
        border: "none",
        boxShadow: "0 4px 15px rgba(99, 102, 241, 0.2)",
        backdropFilter: "none"
      };
    }
    if (isEscalated) {
      // Burbuja de escalada: borde ámbar
      return {
        background: "rgba(245, 158, 11, 0.06)",
        border: "1px solid rgba(245, 158, 11, 0.3)",
        boxShadow: "0 4px 20px rgba(245, 158, 11, 0.08)",
        backdropFilter: "var(--glass-blur)"
      };
    }
    // Burbuja del bot: glassmorphism estándar
    return {
      background: "var(--bg-card)",
      border: "1px solid var(--border-color)",
      boxShadow: "var(--glass-shadow)",
      backdropFilter: "var(--glass-blur)"
    };
  };

  const getAvatarStyle = () => {
    if (!isBot) {
      return {
        background: "linear-gradient(135deg, var(--color-secondary), #059669)",
        boxShadow: "0 4px 10px var(--color-secondary-glow)"
      };
    }
    if (isEscalated) {
      return {
        background: "linear-gradient(135deg, #f59e0b, #d97706)",
        boxShadow: "0 4px 10px rgba(245, 158, 11, 0.3)"
      };
    }
    return {
      background: "linear-gradient(135deg, var(--color-primary), #4f46e5)",
      boxShadow: "0 4px 10px var(--color-primary-glow)"
    };
  };

  const AvatarIcon = isEscalated ? PhoneCall : isBot ? Bot : User;

  return (
    <div
      style={{
        display: "flex",
        gap: "0.75rem",
        alignSelf: isBot ? "flex-start" : "flex-end",
        flexDirection: isBot ? "row" : "row-reverse",
        maxWidth: "88%",
        animation: "fadeIn 0.3s ease-out forwards"
      }}
    >
      {/* ── Avatar ────────────────────────────────────────────────────────── */}
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          ...getAvatarStyle()
        }}
      >
        <AvatarIcon size={16} color="white" />
      </div>

      {/* ── Bubble + metadata ─────────────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {/* Etiqueta de rol (solo para bot) */}
        {isBot && (
          <span
            style={{
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.4px",
              color: isEscalated ? "var(--color-warning)" : "var(--color-primary)",
              paddingLeft: "0.25rem"
            }}
          >
            {isEscalated ? "⚠ ESCALANDO A RRHH" : "⚖ HR Legal Assistant"}
          </span>
        )}

        {/* Burbuja principal */}
        <div
          style={{
            maxWidth: "100%",
            padding: "0.9rem 1.15rem",
            borderRadius: "16px",
            borderTopLeftRadius: isBot ? "4px" : "16px",
            borderTopRightRadius: isBot ? "16px" : "4px",
            ...getBubbleStyle()
          }}
        >
          {parseMarkdown(text)}

          {/* Referencia al artículo del Código de Trabajo */}
          {metadata?.article && !isEscalated && (
            <div
              style={{
                marginTop: "0.75rem",
                paddingTop: "0.5rem",
                borderTop: "1px solid rgba(255, 255, 255, 0.07)",
                fontSize: "0.72rem",
                color: "var(--color-secondary)",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "0.35rem"
              }}
            >
              <Scale size={11} />
              {metadata.article}
            </div>
          )}

          {/* Banner de escalada a agente */}
          {isEscalated && (
            <div
              style={{
                marginTop: "0.85rem",
                paddingTop: "0.65rem",
                borderTop: "1px solid rgba(245, 158, 11, 0.2)",
                fontSize: "0.78rem",
                color: "var(--color-warning)",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "0.4rem"
              }}
            >
              <PhoneCall size={12} />
              Conectando con Relaciones Laborales...
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span
          style={{
            fontSize: "0.68rem",
            color: "var(--text-muted)",
            alignSelf: isBot ? "flex-start" : "flex-end",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            padding: "0 0.25rem"
          }}
        >
          <Clock size={10} />
          {formatTime(timestamp)}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
