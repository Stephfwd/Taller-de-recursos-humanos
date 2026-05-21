import Groq from "groq-sdk";
import { queryPdfContextLocal, buildRetrievedContext } from "./pdfLocalConsultant";
import { isGroqApiKeyConfigured, getGroqKeyIssue } from "./groqApiKey";

const useLocalAssistant = () =>
  import.meta.env.VITE_USE_LOCAL_LEGAL_ASSISTANT === "true";

const getGroqClient = () => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY?.trim();
  if (!isGroqApiKeyConfigured(apiKey)) return null;
  return new Groq({
    apiKey,
    dangerouslyAllowBrowser: true,
  });
};

const buildMissingKeyMessage = (issue) => {
  const hints = {
    truncated:
      "Parece que pegaste una clave **abreviada** (con `...`). Debes copiar la clave **completa** desde Groq.",
    too_short: "La clave es demasiado corta.",
    placeholder: "Aún hay texto de ejemplo en `.env`.",
    format: "La clave debe empezar con `gsk_`.",
    missing: "No se encontró `VITE_GROQ_API_KEY` en el `.env`.",
  };

  return (
    "⚠️ **La API Key de Groq no está configurada.**\n\n" +
    `${hints[issue] || hints.missing}\n\n` +
    "Mientras tanto el asistente usa el **modo local** con los manuales PDF.\n\n" +
    "Para activar Groq: clave completa en `.env`, `VITE_USE_LOCAL_LEGAL_ASSISTANT=false` y reinicia `npm run dev`."
  );
};

const SYSTEM_PROMPT_BASE = `Eres el HR Legal Assistant de Garnier & Garnier.
Tu única fuente de verdad es el CONTEXTO de los manuales RH-02 (política familiar) y RH-25 (código de vestimenta).

Reglas:
1. Lee la pregunta del usuario y responde EXACTAMENTE lo que preguntó, en español claro.
2. Empieza con una respuesta directa (1-3 oraciones). Luego, si aplica, usa viñetas con detalles.
3. No inventes datos, cifras ni artículos que no estén en el CONTEXTO.
4. Si el contexto no alcanza para responder, dilo y sugiere reformular o contactar a Recursos Humanos.
5. No respondas temas ajenos a los manuales (deportes, cocina, etc.).
6. Menciona el documento (RH-02 o RH-25) cuando cites una política.`;

const askGroq = async (groq, userMessage, contextData) => {
  const { context, sources, intent } = buildRetrievedContext(userMessage, contextData);

  if (!context.trim()) {
    return queryPdfContextLocal(userMessage, contextData);
  }

  const intentHint = intent?.intro ? `\nEnfoque detectado: ${intent.intro}` : "";

  const systemPrompt = `${SYSTEM_PROMPT_BASE}
${intentHint}

--- CONTEXTO RELEVANTE (extracto de PDFs) ---
${context}
---------------------------------------------`;

  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    model: "llama-3.1-8b-instant",
    temperature: 0.15,
    max_tokens: 1024,
  });

  const aiMessage =
    completion.choices[0]?.message?.content || "No pude generar una respuesta.";

  const sourceNote = sources.length
    ? `\n\n📄 *Basado en: ${sources.join(", ")}*`
    : "";

  return {
    text: aiMessage + sourceNote,
    success: true,
  };
};

export const queryLaborConsultantAI = async (userMessage, contextData) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY?.trim();
  const preferLocal = useLocalAssistant();

  if (preferLocal || !isGroqApiKeyConfigured(apiKey)) {
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

    return await askGroq(groq, userMessage, contextData);
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
        : `❌ Error al contactar el servicio de IA.\n\n**Detalle:** ${detail}`,
      success: false,
    };
  }
};
