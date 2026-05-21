const STOP_WORDS = new Set([
  "el", "la", "los", "las", "un", "una", "unos", "unas", "de", "del", "al", "a", "en", "y", "o",
  "que", "es", "son", "por", "para", "con", "sin", "se", "su", "sus", "mi", "tu", "como", "cual",
  "cuales", "cuál", "cuáles", "qué", "hay", "si", "no", "me", "te", "le", "nos", "les", "este",
  "esta", "estos", "estas", "ese", "esa", "eso", "aquí", "allí", "muy", "más", "menos", "sobre",
]);

const TOPIC_KEYWORDS = {
  familia: ["familia", "familiar", "maternidad", "paternidad", "lactancia", "guardería", "embarazo", "padres", "hijos"],
  vestimenta: ["vestimenta", "vestir", "ropa", "uniforme", "atuendo", "casual", "jeans", "zapatos", "blusa"],
  sanciones: ["sanción", "sanciones", "incumplimiento", "falta", "disciplinario", "desviación"],
};

const tokenize = (text) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

const detectTopics = (terms) => {
  const topics = [];
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    if (terms.some((t) => keywords.some((k) => t.includes(k) || k.includes(t)))) {
      topics.push(topic);
    }
  }
  return topics;
};

const chunkBodyText = (body, docName, size = 520, overlap = 160) => {
  const normalized = body.replace(/\s+/g, " ").trim();
  const chunks = [];

  for (let i = 0; i < normalized.length; i += size - overlap) {
    const slice = normalized.slice(i, i + size).trim();
    if (slice.length > 120) chunks.push({ docName, text: slice });
  }

  return chunks;
};

const splitContextIntoChunks = (contextData) => {
  const byDoc = contextData.split(/--- DOCUMENTO: /).filter(Boolean);
  const chunks = [];

  for (const doc of byDoc) {
    const nameEnd = doc.indexOf(" ---");
    const docName = nameEnd > 0 ? doc.slice(0, nameEnd).trim() : "Documento";
    const body = nameEnd > 0 ? doc.slice(nameEnd + 4) : doc;
    const pageParts = body.split(/----------------Page \(\d+\) Break----------------/);

    for (const part of pageParts) {
      chunks.push(...chunkBodyText(part, docName));
    }
  }

  return chunks.length ? chunks : chunkBodyText(contextData, "Manual");
};

const scoreChunk = (chunk, terms, topics) => {
  const haystack = `${chunk.docName} ${chunk.text}`.toLowerCase();
  let score = 0;

  for (const term of terms) {
    if (haystack.includes(term)) score += 3;
  }

  for (const topic of topics) {
    const keywords = TOPIC_KEYWORDS[topic] || [];
    for (const kw of keywords) {
      if (haystack.includes(kw)) score += 2;
    }
  }

  if (/(otorga|permiso|licencia|política|debe|empresa|familia)/i.test(chunk.text)) score += 4;
  if (/\.{4,}/.test(chunk.text) || /página\s*\d/i.test(chunk.text)) score -= 6;
  if (chunk.text.length < 80) score -= 3;

  return score;
};

const formatExcerpt = (text, maxLen = 600) => {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLen) return clean;
  return `${clean.slice(0, maxLen).trim()}…`;
};

/**
 * Respuestas locales buscando en el contexto de PDFs (sin API de Groq).
 */
export const queryPdfContextLocal = (userMessage, contextData) => {
  if (!contextData || contextData.trim().length < 50) {
    return {
      text: "⚠️ No se cargó el contexto de los manuales (PDFs). Verifica que exista `public/pdf-context.json` y recarga la página.",
      success: false,
    };
  }

  const terms = tokenize(userMessage);
  const topics = detectTopics(terms);
  const chunks = splitContextIntoChunks(contextData);

  const ranked = chunks
    .map((chunk) => ({ chunk, score: scoreChunk(chunk, terms, topics) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (ranked.length === 0) {
    return {
      text:
        "No encontré un apartado específico en los manuales para esa consulta.\n\n" +
        "Prueba con términos como **familia**, **vestimenta**, **uniforme**, **maternidad**, **paternidad** o **sanciones**.",
      success: false,
    };
  }

  const top = ranked.slice(0, 4);
  const intro =
    topics.includes("familia")
      ? "Según la **Política Empresa Familiarmente Responsable (RH-02)**:"
      : topics.includes("vestimenta")
        ? "Según el **Código de Vestimenta (RH-25)**:"
        : "Según los manuales de la empresa:";

  const body = top
    .map(
      ({ chunk }, i) =>
        `**${i + 1}. ${chunk.docName}**\n${formatExcerpt(chunk.text)}`
    )
    .join("\n\n");

  return {
    text: `${intro}\n\n${body}\n\n_Si necesitas el detalle completo de un artículo, indica el tema con más precisión._`,
    success: true,
  };
};
