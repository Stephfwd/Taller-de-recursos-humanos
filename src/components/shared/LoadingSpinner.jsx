import React from "react";

export const LoadingSpinner = ({ size = "medium", label = "Cargando..." }) => {
  const sizeMap = {
    small: "20px",
    medium: "40px",
    large: "60px"
  };

  const spinnerSize = sizeMap[size] || sizeMap.medium;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "1rem",
      padding: "2rem",
      minHeight: "200px"
    }}>
      <div className="spinner-ring" style={{
        width: spinnerSize,
        height: spinnerSize,
        border: "3px solid rgba(99, 102, 241, 0.1)",
        borderTop: "3px solid var(--color-primary)",
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
      }} />
      {label && <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", fontWeight: 500 }}>{label}</p>}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
