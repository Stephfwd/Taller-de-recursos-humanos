import { codigoTrabajo } from "../data/codigoTrabajo";

/**
 * Normaliza un texto para mejorar la coincidencia de palabras clave.
 */
function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, ""); // Eliminar signos de puntuación
}

/**
 * Consulta la base de datos de legislación laboral para simular una respuesta inteligente.
 */
export const queryLaborConsultant = (userMessage) => {
  return new Promise((resolve) => {
    // Simular retraso de red de 1.0 a 2.0 segundos para la experiencia de usuario
    const delay = 1000 + Math.random() * 1000;

    setTimeout(() => {
      const normalizedQuery = normalizarTexto(userMessage);
      const queryWords = normalizedQuery.split(/\s+/);

      // 1. Identificar temas sensibles de alta prioridad o trámites internos que requieren escalación directa
      const rrhhEscalationKeywords = [
        "acoso", "hostigamiento", "discriminacion", "maltrato", "grita", "insulta", "violencia", "acosador",
        "constancia", "recibo", "documento", "carta", "certificado", "tramite", "firma", "contratar",
        "pelea", "disputa", "conflicto", "malentendido", "compañero", "jefe", "gerente", "discusion"
      ];

      const needsEscalation = rrhhEscalationKeywords.some(kw => {
        return queryWords.includes(kw) || normalizedQuery.includes(kw);
      });

      if (needsEscalation) {
        resolve({
          text: "Esta consulta requiere atención personalizada de RRHH. Te estoy conectando con un agente.",
          matchedTopicId: null,
          article: null,
          success: false
        });
        return;
      }

      // 2. Manejar saludos y preguntas generales
      const greetings = ["hola", "buenos dias", "buenas tardes", "buenas noches", "hey", "saludos"];
      const generalQueries = ["quien eres", "que haces", "como funcionas", "ayuda", "que puedes hacer", "que responder"];

      const isGreeting = greetings.some(g => queryWords.includes(g)) || 
                         generalQueries.some(q => normalizedQuery.includes(q));

      if (isGreeting) {
        const welcomeResponse = "¡Hola! Soy **HR Legal Assistant**, tu asistente virtual especializado exclusivamente en el Código de Trabajo. 💼\n\nPuedo responder tus consultas sobre:\n- Vacaciones, días de descanso y días feriados\n- Jornadas laborales y horas extra\n- Salarios, aguinaldo y liquidaciones\n- Permisos, incapacidades y licencias de maternidad/paternidad\n- Causales de despido con y sin responsabilidad patronal\n- Contratos de trabajo y derechos/obligaciones del trabajador y patrono\n\n¿En qué te puedo asesorar hoy?";
        resolve({
          text: welcomeResponse,
          matchedTopicId: null,
          article: null,
          success: true
        });
        return;
      }

      // 3. Manejar agradecimientos
      const gratitude = ["gracias", "agradezco", "muchas gracias", "excelente", "perfecto"];
      const isGratitude = gratitude.some(g => normalizedQuery.includes(g));
      if (isGratitude) {
        resolve({
          text: "¡Con gusto! Recuerda que estoy aquí para asistirte con cualquier duda sobre el Código de Trabajo. Si tienes otra consulta laboral, no dudes en preguntar.",
          matchedTopicId: null,
          article: null,
          success: true
        });
        return;
      }

      // 4. Buscar el tema con la mayor coincidencia en el Código de Trabajo
      let bestMatch = null;
      let highestMatchCount = 0;

      for (const item of codigoTrabajo) {
        let matchCount = 0;
        for (const kw of item.keywords) {
          if (queryWords.includes(normalizarTexto(kw))) {
            matchCount++;
          }
        }
        
        // Coincidencia parcial si la frase contiene el término
        if (matchCount === 0) {
          for (const kw of item.keywords) {
            if (normalizedQuery.includes(normalizarTexto(kw))) {
              matchCount += 0.5;
            }
          }
        }

        if (matchCount > highestMatchCount) {
          highestMatchCount = matchCount;
          bestMatch = item;
        }
      }

      // 5. Si hay coincidencia aceptable (umbral >= 0.5), formatear según las reglas estrictas
      if (bestMatch && highestMatchCount >= 0.5) {
        const formattedResponse = `**Respuesta:** ${bestMatch.summary}\n\n**Base Legal:** ${bestMatch.article} (${bestMatch.title})\n\n**Pasos a seguir / Recomendación:** ${bestMatch.recommendation}`;
        
        resolve({
          text: formattedResponse,
          matchedTopicId: bestMatch.id,
          article: bestMatch.article,
          success: true
        });
      } else {
        // Si no está cubierto por el Código de Trabajo en nuestra base de datos
        resolve({
          text: "Esta consulta requiere atención personalizada de RRHH. Te estoy conectando con un agente.",
          matchedTopicId: null,
          article: null,
          success: false
        });
      }
    }, delay);
  });
};
