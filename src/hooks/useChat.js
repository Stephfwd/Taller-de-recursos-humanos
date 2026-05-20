import { useState, useCallback } from "react";
import { queryLaborConsultant } from "../services/antigravity";

const WELCOME_MESSAGE = {
  id: "welcome",
  sender: "bot",
  text: "¡Hola! Soy tu **Consultor Laboral Inteligente** de Recursos Humanos. 💼\n\n¿En qué te puedo asesorar hoy? Puedes consultarme sobre tus vacaciones, horas extra, aguinaldo, incapacidades, licencias de maternidad o qué hacer en caso de despido o renuncia.",
  timestamp: new Date().toISOString()
};

export const useChat = () => {
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
      const response = await queryLaborConsultant(text);
      
      const botMsg = {
        id: `bot_${Date.now()}`,
        sender: "bot",
        text: response.text,
        timestamp: new Date().toISOString(),
        metadata: {
          matchedTopicId: response.matchedTopicId,
          article: response.article
        }
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Error sending message to simulator:", error);
      
      const errMsg = {
        id: `bot_err_${Date.now()}`,
        sender: "bot",
        text: "Hubo un error de conexión al consultar el Código de Trabajo. Por favor, intenta de nuevo.",
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
    setIsTyping(false);
  }, []);

  const quickReplies = [
    { text: "¿Cuántos días de vacaciones me corresponden?", label: "🌴 Vacaciones" },
    { text: "¿Cómo se pagan las horas extra?", label: "⏰ Horas Extra" },
    { text: "¿Cómo se calcula mi aguinaldo?", label: "🎁 Aguinaldo" },
    { text: "¿Cuáles son mis derechos ante un despido?", label: "📄 Liquidación" },
    { text: "¿Cómo reporto acoso o maltrato laboral?", label: "🛡️ Reportar Acoso" }
  ];

  return {
    messages,
    isTyping,
    sendMessage,
    clearChat,
    quickReplies
  };
};
