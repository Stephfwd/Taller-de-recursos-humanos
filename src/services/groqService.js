import Groq from "groq-sdk";
import { queryPdfContextLocal } from "./pdfLocalConsultant";

const useLocalAssistant = () =>
  import.meta.env.VITE_USE_LOCAL_LEGAL_ASSISTANT === "true";

const PLACEHOLDER_PATTERNS = [
  "pon_tu_clave",
  "tu_clave",
  "your_api_key",
  "api_key_here",
  "gsk_xxx",
];

/** Motivo por el que la clave no es válida (para mensajes al usuario). */
export const getGroqKeyIssue = (apiKey) => {
  if (!apiKey || typeof apiKey !== "string") return "missing";
  const trimmed = apiKey.trim();
  if (!trimmed) return "missing";
  if (trimmed.includes("...")) return "truncated";
  const lower = trimmed.toLowerCase();
  if (PLACEHOLDER_PATTERNS.some((p) => lower.includes(p))) return "placeholder";
  if (!trimmed.startsWith("gsk_")) return "format";
  if (trimmed.length < 40) return "too_short";
  return null;
};

export const isGroqApiKeyConfigured = (apiKey) => getGroqKeyIssue(apiKey) === null;

const getGroqClient = () => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY?.trim();
  if (!isGroqApiKeyConfigured(apiKey)) return null;
  return new Groq({
    apiKey,
    dangerouslyAllowBrowser: true,
  });
};

/**
 * Consulta a la IA con el contexto del código de trabajo (extraído de los PDFs)
 */
const buildMissingKeyMessage = (issue) => {
  const hints = {
    truncated:
      "Parece que pegaste una clave **abreviada** (con `...`). Debes copiar la clave **completa** desde Groq, sin omitir caracteres.",
    too_short:
      "La clave es demasiado corta. Una API Key real de Groq suele tener unos **50 caracteres** o más.",
    placeholder:
      "Aún hay texto de ejemplo en `.env`. Sustitúyelo por la clave real que empieza con `gsk_`.",
    format: "La clave debe empezar exactamente con `gsk_`.",
    missing: "No se encontró `VITE_GROQ_API_KEY` en el `.env` de `Taller-de-recursos-humanos`.",
  };

  return (
    "⚠️ **La API Key de Groq no está configurada correctamente.**\n\n" +
    `**Problema detectado:** ${hints[issue] || hints.missing}\n\n` +
    "1. Entra a [console.groq.com/keys](https://console.groq.com/keys) y copia la clave **entera** (botón Copy).\n" +
    "2. En `Taller-de-recursos-humanos/.env` deja una sola línea, **sin espacios** después del `=`:\n" +
    "   `VITE_GROQ_API_KEY=gsk_` seguido de todos los caracteres de tu clave (sin `...`)\n" +
    "3. Guarda el archivo y reinicia: `Ctrl+C` → `npm run dev`."
  );
};

export const queryLaborConsultantAI = async (userMessage, contextData) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY?.trim();

  if (useLocalAssistant() || !isGroqApiKeyConfigured(apiKey)) {
    const local = queryPdfContextLocal(userMessage, contextData);
    if (local.success) return local;
    if (!isGroqApiKeyConfigured(apiKey)) {
      return {
        text: buildMissingKeyMessage(getGroqKeyIssue(apiKey)),
        success: false,
      };
    }
  }

  try {
    const groq = getGroqClient();
    if (!groq) {
      return queryPdfContextLocal(userMessage, contextData);
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
    const detail = error.message || "Error desconocido";
    const isInvalidKey =
      detail.includes("Invalid API Key") || detail.includes("invalid_api_key");

    const localFallback = queryPdfContextLocal(userMessage, contextData);
    if (localFallback.success) return localFallback;

    return {
      text: isInvalidKey
        ? buildMissingKeyMessage(getGroqKeyIssue(apiKey))
        : `❌ Ocurrió un error al contactar con el servicio de IA.\n\n**Detalle del error:** ${detail}\n\nSi es un error de CORS, asegúrate de no tener bloqueadores de anuncios activos.`,
      success: false,
    };
  }
};
