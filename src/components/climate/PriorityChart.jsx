import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from "recharts";

export const PriorityChart = ({ data = [] }) => {
  // Colores dinámicos basados en la puntuación
  const getColorForScore = (score) => {
    if (score < 60) return "#f43f5e"; // Rose
    if (score < 75) return "#f59e0b"; // Amber
    return "#10b981"; // Emerald
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const score = payload[0].value;
      const name = payload[0].payload.name;
      
      let statusText = "Excelente";
      let statusColor = "var(--color-secondary)";
      
      if (score < 60) {
        statusText = "Prioridad Crítica";
        statusColor = "var(--color-danger)";
      } else if (score < 75) {
        statusText = "Atención Moderada";
        statusColor = "var(--color-warning)";
      }

      return (
        <div style={{
          background: "rgba(17, 24, 39, 0.95)",
          border: "1px solid var(--border-color)",
          borderRadius: "12px",
          padding: "0.75rem 1rem",
          boxShadow: "var(--glass-shadow)",
          backdropFilter: "var(--glass-blur)"
        }}>
          <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "white", marginBottom: "0.25rem" }}>
            {name}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.1rem", fontWeight: 800, color: statusColor }}>{score}%</span>
            <span style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              color: statusColor,
              background: `${statusColor}15`,
              padding: "0.15rem 0.4rem",
              borderRadius: "4px"
            }}>{statusText}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: "100%", height: 320 }}>
      {data.length === 0 ? (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "var(--text-muted)",
          fontSize: "0.9rem"
        }}>
          No hay datos disponibles para graficar.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -25, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="var(--text-secondary)" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              dy={10}
              tickFormatter={(value) => {
                // Abreviar nombres largos de categorías para móvil
                if (value.length > 15) {
                  return value.substring(0, 15) + "...";
                }
                return value;
              }}
            />
            <YAxis 
              stroke="var(--text-secondary)" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              domain={[0, 100]} 
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            <Bar 
              dataKey="score" 
              radius={[8, 8, 0, 0]} 
              barSize={32}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getColorForScore(entry.score)} 
                  style={{
                    filter: `drop-shadow(0 4px 8px ${getColorForScore(entry.score)}30)`
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PriorityChart;
