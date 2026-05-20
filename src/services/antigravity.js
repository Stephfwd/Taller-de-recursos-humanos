import { codigoTrabajo } from "../data/codigoTrabajo";

// ──────────────────────────────────────────────────────────────────────────────
// SISTEMA: HR Legal Assistant — Asistente virtual de Recursos Humanos
// Responde EXCLUSIVAMENTE con base en el Código de Trabajo vigente.
// Escala automáticamente cuando la consulta está fuera del alcance legal.
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Detecta palabras clave de alto riesgo que obligan a escalar a RRHH.
 * Cubre: acoso, discriminación, conflictos personales, trámites internos, etc.
 */
const ESCALATE_KEYWORDS = [
  "acoso", "hostigamiento", "discriminacion", "maltrato", "denuncia", "denunciar",
  "bullying", "insulto", "violencia", "amenaza", "expediente", "documento",
  "certificado", "constancia", "tramite", "conflicto", "demanda", "juridico",
  "abogado", "sindicato", "huelga", "paro", "queja", "reclamacion"
];

/**
 * Detecta saludos y preguntas generales de bienvenida.
 */
const GREETING_KEYWORDS = [
  "hola", "buenos dias", "buenas tardes", "buenas noches", "buen dia",
  "hey", "saludos", "que tal", "como estas", "hi"
];

/**
 * Detecta expresiones de agradecimiento o cierre.
 */
const THANKS_KEYWORDS = [
  "gracias", "muchas gracias", "agradezco", "perfecto", "excelente",
  "entendido", "listo", "ok", "hasta luego", "adios", "nos vemos"
];

/**
 * Normaliza texto para facilitar la comparación.
 */
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")        // quitar acentos
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?¿¡]/g, ""); // quitar puntuación
}

/**
 * Comprueba si el texto normalizado contiene alguna de las palabras clave.
 */
function coincide(normalizedText, keywords) {
  return keywords.some(kw => normalizedText.includes(normalizar(kw)));
}

/**
 * Construye la respuesta estructurada del HR Legal Assistant a partir de un
 * artículo coincidente del Código de Trabajo.
 */
function construirRespuestaLegal(item) {
  return [
    `📋 **${item.title}**`,
    "",
    item.summary,
    "",
    `⚖️ **Base legal:** *${item.article}*`,
    "",
    `💡 **Orientación práctica:** ${item.recommendation}`,
    "",
    "---",
    "_Si tienes una situación específica no cubierta por esta disposición, escríbeme y te indico si corresponde escalar tu caso al equipo de Relaciones Laborales._"
  ].join("\n");
}

/**
 * Motor principal del HR Legal Assistant.
 * Aplica las reglas del sistema prompt de forma estricta.
 */
export const queryLaborConsultant = (userMessage) => {
  return new Promise((resolve) => {
    // Simula latencia realista de "pensando..." (1.2 – 2.2 s)
    const delay = 1200 + Math.random() * 1000;

    setTimeout(() => {
      const q = normalizar(userMessage);
      const words = q.split(/\s+/);

      // ── REGLA 1: Escalada inmediata por temas de alta sensibilidad ──────────
      if (coincide(q, ESCALATE_KEYWORDS)) {
        resolve({
          text: "⚠️ **Esta consulta requiere atención personalizada de RRHH. Te estoy conectando con un agente.**\n\nSi deseas continuar de forma confidencial, puedes contactar directamente al equipo de Relaciones Laborales a través del canal oficial de tu empresa.\n\n_El HR Legal Assistant solo puede asesorarte en disposiciones del Código de Trabajo. Para situaciones de alta sensibilidad, un agente humano puede atenderte mejor._",
          matchedTopicId: "escalated",
          article: null,
          escalated: true,
          success: false
        });
        return;
      }

      // ── REGLA 2: Saludos — respuesta de bienvenida y guía ──────────────────
      if (coincide(q, GREETING_KEYWORDS)) {
        resolve({
          text: "¡Hola! 👋 Soy **HR Legal Assistant**, tu asistente virtual de Recursos Humanos especializado en el **Código de Trabajo**.\n\nEstoy aquí para orientarte sobre tus derechos y obligaciones laborales con base en la legislación vigente. Puedes consultarme sobre:\n\n- 🌴 **Vacaciones** y días de descanso\n- ⏰ **Jornadas laborales** y horas extra\n- 💰 **Salario, aguinaldo** y liquidaciones\n- 🏥 **Permisos e incapacidades**\n- 👶 **Maternidad y paternidad**\n- 📄 **Contratos y causales de despido**\n\n¿Cuál es tu consulta laboral hoy?",
          matchedTopicId: null,
          article: null,
          success: true
        });
        return;
      }

      // ── REGLA 3: Agradecimientos y cierres ─────────────────────────────────
      if (coincide(q, THANKS_KEYWORDS)) {
        resolve({
          text: "¡Con mucho gusto! 😊 Recuerda que puedo asesorarte en cualquier consulta relacionada con el **Código de Trabajo**.\n\nSi en el futuro tienes otra duda laboral, aquí estaré. ¡Que tengas un excelente día!",
          matchedTopicId: null,
          article: null,
          success: true
        });
        return;
      }

      // ── REGLA 4: Búsqueda en la base del Código de Trabajo ─────────────────
      let bestMatch = null;
      let highestScore = 0;

      for (const item of codigoTrabajo) {
        let score = 0;

        for (const kw of item.keywords) {
          const kwNorm = normalizar(kw);
          // Coincidencia exacta de palabra (mayor peso)
          if (words.includes(kwNorm)) {
            score += 2;
          }
          // Coincidencia parcial (menor peso)
          else if (q.includes(kwNorm)) {
            score += 1;
          }
        }

        if (score > highestScore) {
          highestScore = score;
          bestMatch = item;
        }
      }

      // Umbral mínimo de 1 punto para considerar coincidencia válida
      if (bestMatch && highestScore >= 1) {
        resolve({
          text: construirRespuestaLegal(bestMatch),
          matchedTopicId: bestMatch.id,
          article: bestMatch.article,
          escalated: false,
          success: true
        });
        return;
      }

      // ── REGLA 5: Sin coincidencia en el Código de Trabajo → escalar ────────
      resolve({
        text: "⚠️ **Esta consulta requiere atención personalizada de RRHH. Te estoy conectando con un agente.**\n\nNo encontré disposiciones específicas en el Código de Trabajo que respondan tu consulta tal como fue formulada.\n\nSi crees que es un tema laboral, intenta reformular tu pregunta usando términos como: **vacaciones**, **horas extra**, **aguinaldo**, **incapacidad**, **despido**, **contrato**, **jornada** o **maternidad**.",
        matchedTopicId: null,
        article: null,
        escalated: true,
        success: false
      });

    }, delay);
  });
};
