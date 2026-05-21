import { useState, useCallback, useEffect } from "react";
import { queryLaborConsultantAI } from "../services/groqService";

const WELCOME_MESSAGE = {
  id: "welcome",
  sender: "bot",
  text: "¡Hola! 👋 Soy el **HR Legal Assistant**, impulsado por IA.\n\nEstoy entrenado específicamente con los manuales y el código de trabajo de la empresa (Ej: Código de Vestimenta, Políticas Familiares, etc).\n\n¿En qué te puedo ayudar hoy con base en nuestras normativas?",
  timestamp: new Date().toISOString()
};

export const useChat = () => {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [pdfContext, setPdfContext] = useState("");

  // Cargar el contexto extraído de los PDFs en el montaje del hook
  useEffect(() => {
    fetch("/pdf-context.json")
      .then(res => res.json())
      .then(data => {
        if (data && data.documents) {
          const combinedText = data.documents.map(d => `--- DOCUMENTO: ${d.name} ---\n${d.text}`).join("\n\n");
          setPdfContext(combinedText);
          console.log("Contexto PDF cargado exitosamente. Documentos:", data.documents.map(d => d.name));
        }
      })
      .catch(err => console.error("Error cargando el contexto PDF:", err));
  }, []);

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
      // Llamada a la IA usando el contexto de los PDFs
      const response = await queryLaborConsultantAI(text, pdfContext);
      
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
      console.error("Error en el chat:", error);
      
      const errMsg = {
        id: `bot_err_${Date.now()}`,
        sender: "bot",
        text: "Hubo un error de conexión con la inteligencia artificial. Por favor, intenta de nuevo.",
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  }, [pdfContext]);

  const clearChat = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
    setIsTyping(false);
  }, []);

  const quickReplies = [
    { text: "¿Cuál es el código de vestimenta permitido?", label: "Vestimenta" },
    { text: "¿Cuáles son las políticas para familias?", label: "Políticas Familiares" },
    { text: "¿Qué pasa si falto al código de vestimenta?", label: "Sanciones Vestimenta" },
  ];

  return {
    messages,
    isTyping,
    sendMessage,
    clearChat,
    quickReplies
  };
};
