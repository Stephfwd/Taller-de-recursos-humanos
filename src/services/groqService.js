import Groq from "groq-sdk";

// Inicializar el cliente de Groq.
// NOTA: 'dangerouslyAllowBrowser: true' permite llamar a la API desde el cliente (React).
// Para entornos de producción reales, es más seguro hacer esto a través de un backend.
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

/**
 * Consulta a la IA con el contexto del código de trabajo (extraído de los PDFs)
 */
export const queryLaborConsultantAI = async (userMessage, contextData) => {
  try {
    // Si no hay key configurada, damos aviso amistoso
    if (!import.meta.env.VITE_GROQ_API_KEY) {
      return {
        text: "⚠️ **No se ha configurado la API Key de Groq.**\nPor favor, añade `VITE_GROQ_API_KEY=tu_clave` en el archivo `.env` del proyecto y reinicia el servidor.",
        success: false
      };
    }

    // 1. Armar el System Prompt basado en los requerimientos del usuario
    const systemPrompt = `Eres un asistente útil y respondes de forma clara y breve. 
Respondes a todas las preguntas que tienen que ver con el código de trabajo, el cual se te proporciona como contexto. 
NO respondas a preguntas que son de otro tema no correspondiente que no sea al código de trabajo de la empresa. 
Respondes de manera amable a las consultas y mantienes la coherencia. 
No inventes información, básate ÚNICAMENTE en el siguiente contexto extraído de los manuales de la empresa.

--- CONTEXTO OFICIAL DE LA EMPRESA (PDFs) ---
${contextData}
---------------------------------------------`;

    // 2. Realizar la petición a Groq
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      model: "llama-3.1-8b-instant", // Usamos un modelo con 128k de contexto para procesar los PDFs completos
      temperature: 0.1, // Temperatura baja para respuestas factuales basadas en el contexto
      max_tokens: 1024,
    });

    const aiMessage = completion.choices[0]?.message?.content || "Lo siento, no pude generar una respuesta.";

    return {
      text: aiMessage,
      success: true,
    };
  } catch (error) {
    console.error("Error consultando a Groq:", error);
    return {
      text: `❌ Ocurrió un error al contactar con el servicio de IA.\n\n**Detalle del error:** ${error.message || "Error desconocido"}\n\nSi el error es 'Invalid API Key', verifica tu clave en el archivo .env. Si es un error de CORS, asegúrate de no tener bloqueadores de anuncios.`,
      success: false
    };
  }
};
