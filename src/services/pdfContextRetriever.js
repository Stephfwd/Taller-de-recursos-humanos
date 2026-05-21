const STOP_WORDS = new Set([
  "el", "la", "los", "las", "un", "una", "de", "del", "al", "a", "en", "y", "o", "que", "es",
  "son", "por", "para", "con", "sin", "se", "su", "como", "cual", "cuales", "hay", "si", "no",
  "me", "te", "le", "nos", "les", "este", "esta", "ese", "esa", "muy", "mas", "menos", "sobre",
  "cual", "cuales", "cuanto", "cuantos", "donde", "cuando", "puede", "puedo", "debo", "hacer",
]);

export const tokenize = (text) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

const isTableOfContents = (text) => {
  const dots = (text.match(/\.{4,}/g) || []).length;
  return dots >= 2 || /tabla de contenido|página\s+\d+\s+de/i.test(text);
};

const parseDocumentSections = (docName, body) => {
  const sections = [];
  const pages = body.split(/----------------Page \(\d+\) Break----------------/);

  for (const page of pages) {
    const text = page.replace(/\s+/g, " ").trim();
    if (text.length < 80) continue;

    const parts = text.split(
      /(?=\d+(?:\.\d+){0,3}\.?\s{1,4}[A-ZÁÉÍÓÚÑ0-9])/
    );

    for (const part of parts) {
      const content = part.trim();
      if (content.length < 70 || isTableOfContents(content)) continue;

      const header = content.match(
        /^(\d+(?:\.\d+)*)\.?\s*([A-ZÁÉÍÓÚÑ][A-Za-zÁÉÍÓÚáéíóúñ\s]{2,55})/
      );
      const title = header
        ? `${header[1]} ${header[2].trim()}`
        : content.slice(0, 55).trim();

      sections.push({ docName, title, content });
    }
  }

  if (!sections.length && body.trim().length > 80) {
    sections.push({
      docName,
      title: "Contenido general",
      content: body.replace(/\s+/g, " ").trim(),
    });
  }

  return sections;
};

export const parseAllSections = (contextData) => {
  const byDoc = contextData.split(/--- DOCUMENTO: /).filter(Boolean);
  const all = [];

  for (const doc of byDoc) {
    const nameEnd = doc.indexOf(" ---");
    const docName = nameEnd > 0 ? doc.slice(0, nameEnd).trim() : "Documento";
    const body = nameEnd > 0 ? doc.slice(nameEnd + 4) : doc;
    all.push(...parseDocumentSections(docName, body));
  }

  return all;
};

const INTENTS = [
  {
    id: "politicas_familia",
    match: (q) =>
      /politica|politicas|familia|familiar|familiarmente|vida.?trabajo|balance/i.test(q),
    docFilter: /RH-02/i,
    sectionBoost: [
      "propósito", "declaración", "política", "familia", "alcance", "maternidad",
      "paternidad", "horario flexible", "guardería", "tele-trabajo", "licencias",
    ],
    intro:
      "Las **políticas para familias** (procedimiento **RH-02**) promueven balance vida-trabajo y bienestar integral en Garnier & Garnier. Según el manual:",
  },
  {
    id: "maternidad",
    match: (q) => /maternidad|embarazo|lactancia|guarder/i.test(q),
    docFilter: /RH-02/i,
    sectionBoost: ["maternidad", "embarazo", "lactancia", "guardería", "6.1"],
    intro: "Sobre **maternidad y beneficios relacionados** (RH-02):",
  },
  {
    id: "paternidad",
    match: (q) => /paternidad|padre|papá/i.test(q),
    docFilter: /RH-02/i,
    sectionBoost: ["paternidad", "papá también cuida", "6.1.3"],
    intro: "Sobre **paternidad y permisos para padres** (RH-02):",
  },
  {
    id: "horario_flexible",
    match: (q) => /horario|flexible|teletrabajo|tele-trabajo|viernes|salida anticipada/i.test(q),
    docFilter: /RH-02/i,
    sectionBoost: ["horario", "flexible", "tele-trabajo", "semana comprimida", "6.2"],
    intro: "Sobre **horario flexible y modalidades de trabajo** (RH-02):",
  },
  {
    id: "sanciones_vestimenta",
    match: (q) =>
      (/vestimenta|uniforme|atuendo/i.test(q) &&
        /sancion|falto|incumpl|pasa si|desviacion|consecuencia|penal/i.test(q)) ||
      /sancion.*vestimenta|falto.*codigo/i.test(q),
    docFilter: /RH-25/i,
    sectionBoost: ["desviacion", "sancion", "régimen disciplinario", "incumplimiento"],
    intro: "Si **incumples el código de vestimenta** (RH-25), esto es lo que establece el manual:",
  },
  {
    id: "vestimenta",
    match: (q) => /vestimenta|atuendo|ropa|uniforme|jeans|zapatos|blusa|casual/i.test(q),
    docFilter: /RH-25/i,
    sectionBoost: [
      "casual de negocios", "vestimenta", "permitido", "hombres", "mujeres",
      "viernes", "presentación personal", "uniforme",
    ],
    intro: "Sobre el **código de vestimenta** permitido en la empresa (RH-25 — *Casual de Negocios*):",
  },
  {
    id: "uniforme",
    match: (q) => /uniforme|gafete|subvencion/i.test(q),
    docFilter: /RH-25/i,
    sectionBoost: ["uniforme", "solicitud", "entrega", "subvención", "gafete"],
    intro: "Sobre el **uso y gestión de uniformes** (RH-25):",
  },
  {
    id: "sanciones_familia",
    match: (q) =>
      /RH-02/i.test(q) === false &&
      /sancion|incumpl|desviacion|denuncia/i.test(q) &&
      /familia|familiar/i.test(q),
    docFilter: /RH-02/i,
    sectionBoost: ["desviacion", "sancion", "incumplimiento", "denuncia"],
    intro: "Sobre **sanciones o incumplimiento de la política familiar** (RH-02):",
  },
];

export const resolveIntent = (userMessage) => {
  const q = userMessage.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
  return INTENTS.find((intent) => intent.match(q)) || null;
};

const scoreSection = (section, terms, intent) => {
  const hay = `${section.title} ${section.content}`.toLowerCase();
  let score = 0;

  for (const term of terms) {
    if (hay.includes(term)) score += 4;
  }

  if (intent?.docFilter?.test(section.docName)) score += 12;

  for (const hint of intent?.sectionBoost || []) {
    if (hay.includes(hint.toLowerCase())) score += 6;
  }

  if (intent?.id === "politicas_familia") {
    if (/(propósito|declaración de política|alcance|balance vida|bienestar integral|empresa familiarmente)/i.test(hay)) {
      score += 18;
    }
    if (/^6\.1\.[0-9]|permiso especial por paternidad$/i.test(section.title)) score -= 10;
  }

  if (intent?.id === "vestimenta") {
    if (/(casual de negocios|business casual|permitido|permitidas|zapatos|jeans|viernes informal)/i.test(hay)) {
      score += 12;
    }
  }

  if (intent?.id === "sanciones_vestimenta") {
    if (/(régimen disciplinario|sanciones por el incumplimiento|desviaciones)/i.test(hay)) {
      score += 20;
    }
  }

  if (/(otorga|permiso|licencia|debe|aplica|prohib|permit|días|horas|empresa)/i.test(section.content)) {
    score += 3;
  }

  if (isTableOfContents(section.content)) score -= 25;

  return score;
};

const polishSentence = (sentence) => {
  let clean = sentence
    .replace(/\s+/g, " ")
    .replace(/\s+\d+\.\s*$/g, "")
    .replace(/\s+•\s+.+$/g, "")
    .trim();
  if (!clean || clean.length < 25) return "";
  if (!/[.!?]$/.test(clean)) clean += ".";
  return clean.charAt(0).toUpperCase() + clean.slice(1);
};

const PHRASES_BY_INTENT = {
  politicas_familia: [
    "El propósito de esta política es constituir un marco de referencia",
    "Garnier & Garnier promoverá el bienestar integral",
    "Se considera como familia toda diversidad",
    "Las disposiciones establecidas en la presente política aplicarán",
    "La empresa promoverá la implementación de horarios flexibles",
    "La empresa otorgará permiso con goce de salario para que las mujeres en estado de embarazo",
    "En adición al cumplimiento de la legislación vigente (120 días por nacimiento",
    "la empresa subsidiará el pago del servicio de guardería",
    "El teletrabajo le permite a la persona trabajar desde diferentes ubicaciones",
  ],
  vestimenta: [
    "Establecer los lineamientos generales de vestimenta",
    "Casual de Negocios",
    "es vestir profesionalmente",
    "En general, la vestimenta casual significa",
    "Zapatos: De preferencia cerrados",
    "Los jeans son permitidos",
    "El uso de camisetas de equipos deportivos solo podrá hacerse",
    "viernes informal",
    "evitar sandalias y zapatos deportivos",
  ],
  sanciones_vestimenta: [
    "Las sanciones por el incumplimiento de esta política serán aplicadas",
    "El incumplimiento de lo dispuesto en la presente política constituye una falta",
    "establecido en el Régimen Disciplinario",
  ],
  maternidad: [
    "En adición al cumplimiento de la legislación vigente (120 días",
    "se otorgará un tiempo adicional de 7 días",
    "La empresa otorgará un permiso semanal, adicional a la hora de lactancia",
    "Las madres contaran con una sala de lactancia",
  ],
  paternidad: [
    "la empresa otorgará a los padres un permiso con goce de salario de siete (7) días",
    "Papá también cuida",
    "Para disfrutar la licencia por paternidad los padres deberán completar el curso interno",
  ],
};

const cleanExcerpt = (raw) => {
  let excerpt = raw.replace(/----------------Page[^-]+Break-+/g, " ");
  const stops = [
    "Diciembre 20",
    "Febrero 20",
    "PROXIMA REVISION",
    "PROCEDIMIENTO RH-",
    "POLITICA Y",
    "Página",
    "TABLA DE CONTENIDO",
  ];
  for (const stop of stops) {
    const at = excerpt.indexOf(stop);
    if (at > 40) excerpt = excerpt.slice(0, at);
  }
  excerpt = excerpt.replace(/\.{3,}/g, " ").replace(/\s+/g, " ").trim();
  if (excerpt.length > 300) excerpt = `${excerpt.slice(0, 297).trim()}…`;
  return excerpt;
};

const extractPassage = (text, phrase, windowBefore = 10, windowAfter = 220) => {
  const norm = text.replace(/\s+/g, " ");
  const idx = norm.toLowerCase().indexOf(phrase.toLowerCase());
  if (idx === -1) return null;

  const start = Math.max(0, idx - windowBefore);
  const end = Math.min(norm.length, idx + phrase.length + windowAfter);
  return polishSentence(cleanExcerpt(norm.slice(start, end)));
};

/** Extrae fragmentos relevantes del texto completo según frases ancla del manual. */
export const extractOverviewFromDocuments = (contextData, intentId) => {
  const phrases = PHRASES_BY_INTENT[intentId];
  if (!phrases) return [];

  const byDoc = contextData.split(/--- DOCUMENTO: /).filter(Boolean);
  const facts = [];

  for (const doc of byDoc) {
    const nameEnd = doc.indexOf(" ---");
    const docName = nameEnd > 0 ? doc.slice(0, nameEnd).trim() : "";
    const body = nameEnd > 0 ? doc.slice(nameEnd + 4) : doc;

    if (intentId === "politicas_familia" && !/RH-02/i.test(docName)) continue;
    if (intentId === "vestimenta" && !/RH-25/i.test(docName)) continue;
    if (intentId === "sanciones_vestimenta" && !/RH-25/i.test(docName)) continue;

    for (const phrase of phrases) {
      const passage = extractPassage(body, phrase);
      if (passage) facts.push(passage);
    }
  }

  const unique = [];
  for (const f of facts) {
    const key = f.slice(0, 55).toLowerCase();
    if (!unique.some((u) => u.slice(0, 55).toLowerCase() === key)) unique.push(f);
  }
  return unique.slice(0, 7);
};

export const rankSections = (userMessage, contextData) => {
  const terms = tokenize(userMessage);
  const intent = resolveIntent(userMessage);
  const sections = parseAllSections(contextData);

  let ranked = sections
    .map((section) => ({ section, score: scoreSection(section, terms, intent) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (ranked.length < 2) {
    ranked = sections
      .map((section) => ({
        section,
        score: scoreSection(section, terms, null) + (terms.length ? 0 : 1),
      }))
      .filter((item) => item.score > 2 && !isTableOfContents(item.section.content))
      .sort((a, b) => b.score - a.score);
  }

  return { ranked, intent, terms };
};

export const extractFacts = (text, max = 6) => {
  const sentences = text
    .split(/(?<=[.;])\s+|\s+•\s+/)
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter(
      (s) =>
        s.length > 35 &&
        s.length < 420 &&
        /(otorga|permiso|licencia|debe|aplica|prohib|permit|día|días|horas|empresa|colaborador|persona|se considera|establece|podrá|máximo|mínimo|subsidio|sancion|incumpl|vestimenta|familia|uniforme)/i.test(
          s
        ) &&
        !isTableOfContents(s)
    );

  const unique = [];
  for (const s of sentences) {
    const key = s.slice(0, 80).toLowerCase();
    if (!unique.some((u) => u.slice(0, 80).toLowerCase() === key)) {
      unique.push(polishSentence(s));
    }
  }

  return unique.slice(0, max);
};

/** Fragmento de contexto relevante para Groq (RAG). */
export const buildRetrievedContext = (userMessage, contextData, maxChars = 12000) => {
  const { ranked, intent } = rankSections(userMessage, contextData);
  const top = ranked.slice(0, 8);

  if (!top.length) return { context: "", sources: [], intent };

  const blocks = [];
  const sources = new Set();
  let length = 0;

  for (const { section } of top) {
    const block = `### ${section.docName} — ${section.title}\n${section.content.slice(0, 2200)}`;
    if (length + block.length > maxChars) break;
    blocks.push(block);
    sources.add(section.docName);
    length += block.length;
  }

  return {
    context: blocks.join("\n\n"),
    sources: [...sources],
    intent,
  };
};
