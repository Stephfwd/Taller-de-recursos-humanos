import { useState, useCallback } from "react";
import { queryAdminAgent } from "../services/adminAgent";

const WELCOME_MESSAGE = {
  id: "welcome",
  sender: "bot",
  text: "¡Hola! Soy el **HR Admin Agent**, el asistente de inteligencia de tu panel de control.\n\nEstoy aquí para ayudarte a interpretar resultados, configurar alertas y gestionar la estructura de la empresa.\n\nPuedes probar comandos rápidos como:\n- `dashboard`\n- `críticos`\n- `nueva empresa`\n- `configurar alerta`",
  timestamp: new Date().toISOString()
};

export const useAdminChat = (userRole = 'ADMIN') => {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(async (text) => {
    if (!text || text.trim() === "") return;

    const userMsg = {
      id: `user_${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await queryAdminAgent(text, userRole);
      
      const botMsg = {
        id: `bot_${Date.now()}`,
        sender: "bot",
        text: response.text,
        timestamp: new Date().toISOString(),
        metadata: {
          success: response.success
        }
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Error sending message to admin agent:", error);
      
      const errMsg = {
        id: `bot_err_${Date.now()}`,
        sender: "bot",
        text: "Error de conexión con el agente. Intenta nuevamente.",
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  }, [userRole]);

  const clearChat = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
    setIsTyping(false);
  }, []);

  const quickReplies = [
    { text: "dashboard", label: "Dashboard" },
    { text: "críticos", label: "Ver Críticos" },
    { text: "nueva empresa", label: "Nueva Empresa" },
    { text: "historial alertas", label: "Historial de Alertas" }
  ];

  return {
    messages,
    isTyping,
    sendMessage,
    clearChat,
    quickReplies
  };
};
