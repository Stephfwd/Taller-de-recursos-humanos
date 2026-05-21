import {
  rankSections,
  extractFacts,
  resolveIntent,
  buildRetrievedContext,
  extractOverviewFromDocuments,
} from "./pdfContextRetriever";
import { formatCuratedAnswer, CURATED_BY_INTENT } from "./pdfCuratedAnswers";

const buildDirectAnswer = (intent, facts, sources) => {
  const sourceLine = sources.length
    ? `\n\n📄 **Fuente:** ${sources.join(" · ")}`
    : "";

  if (!facts.length) return null;

  const intro =
    intent?.intro ||
    "Con base en los manuales de Recursos Humanos de la empresa:";

  const bullets = facts.map((f) => `- ${f}`).join("\n");

  return `${intro}\n\n${bullets}${sourceLine}`;
};

/**
 * Responde de forma coherente según la pregunta, usando secciones relevantes de los PDFs.
 */
export const queryPdfContextLocal = (userMessage, contextData) => {
  if (!contextData || contextData.trim().length < 50) {
    return {
      text: "⚠️ No se cargó el contexto de los manuales (PDFs). Verifica que exista `public/pdf-context.json` y recarga la página.",
      success: false,
    };
  }

  const normalizedQuestion = userMessage.trim();
  if (!normalizedQuestion) {
    return { text: "Escribe tu consulta sobre las políticas o el código de vestimenta.", success: false };
  }

  const { ranked, intent } = rankSections(normalizedQuestion, contextData);

  if (intent?.id && CURATED_BY_INTENT[intent.id]) {
    const curated = formatCuratedAnswer(intent.id);
    if (curated) {
      return {
        text: `${curated}\n\n_Si necesitas más detalle, indica el tema específico (ej. guardería, viernes informal, uniforme)._`,
        success: true,
      };
    }
  }

  if (!ranked.length) {
    return {
      text:
        "No encontré información en los manuales cargados (**RH-02** política familiar y **RH-25** código de vestimenta) para esa pregunta.\n\n" +
        "Intenta preguntar, por ejemplo:\n" +
        "- *¿Cuáles son las políticas para familias?*\n" +
        "- *¿Cuál es el código de vestimenta permitido?*\n" +
        "- *¿Qué pasa si incumplo el código de vestimenta?*\n" +
        "- *¿Cuántos días de paternidad hay?*",
      success: false,
    };
  }

  const topSections = ranked.slice(0, 4).map((r) => r.section);
  const sources = [...new Set(topSections.map((s) => s.docName))];

  let dedupedFacts = [];

  if (intent?.id) {
    dedupedFacts = extractOverviewFromDocuments(contextData, intent.id);
  }

  if (dedupedFacts.length < 3) {
    const sectionFacts = topSections
      .flatMap((section) => extractFacts(section.content, 4))
      .filter(Boolean);

    for (const fact of sectionFacts) {
      const key = fact.slice(0, 70).toLowerCase();
      if (!dedupedFacts.some((f) => f.slice(0, 70).toLowerCase() === key)) {
        dedupedFacts.push(fact);
      }
      if (dedupedFacts.length >= 7) break;
    }
  }

  const answer = buildDirectAnswer(intent, dedupedFacts, sources);

  if (!answer) {
    const { context, sources: ragSources } = buildRetrievedContext(
      normalizedQuestion,
      contextData
    );
    return {
      text: `Encontré el tema en los manuales pero no pude extraer un resumen claro. Consulta el apartado en:\n\n${ragSources.join(", ")}`,
      success: true,
    };
  }

  const outOfScope =
    intent &&
    !intent.docFilter &&
    /vacacion|aguinaldo|despido|codigo de trabajo|ley laboral|horas extra/i.test(
      normalizedQuestion
    );

  const suffix = outOfScope
    ? "\n\n_Nota: Los manuales cargados cubren política familiar (RH-02) y vestimenta (RH-25). Para temas del Código de Trabajo general de Costa Rica, consulta con Recursos Humanos._"
    : "\n\n_Si necesitas más detalle, indica el tema específico (ej. maternidad, viernes informal, uniforme)._";

  return {
    text: answer + suffix,
    success: true,
  };
};

export { resolveIntent, buildRetrievedContext };
