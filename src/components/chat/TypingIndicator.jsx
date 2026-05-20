import React from "react";

export const TypingIndicator = () => {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "0.75rem 1rem",
      background: "rgba(31, 41, 55, 0.5)",
      border: "1px solid var(--border-color)",
      borderRadius: "18px",
      borderBottomLeftRadius: "4px",
      alignSelf: "flex-start",
      width: "fit-content",
      margin: "0.5rem 0"
    }}>
      <div className="dot" style={{ animationDelay: "0s" }} />
      <div className="dot" style={{ animationDelay: "0.2s" }} />
      <div className="dot" style={{ animationDelay: "0.4s" }} />

      <style>{`
        .dot {
          width: 8px;
          height: 8px;
          background: var(--text-secondary);
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default TypingIndicator;
