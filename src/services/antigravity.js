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
    // Simular retraso de red de 1.5 a 2.5 segundos para la experiencia de usuario ("pensando...")
    const delay = 1200 + Math.random() * 1000;

    setTimeout(() => {
      const normalizedQuery = normalizarTexto(userMessage);
      const queryWords = normalizedQuery.split(/\s+/);

      let bestMatch = null;
      let highestMatchCount = 0;

      // Buscar el tema con la mayor coincidencia de palabras clave
      for (const item of codigoTrabajo) {
        let matchCount = 0;
        for (const kw of item.keywords) {
          if (queryWords.includes(normalizarTexto(kw))) {
            matchCount++;
          }
        }
        
        // Coincidencia parcial si la frase completa contiene el término
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

      // Si hay una coincidencia aceptable (umbral mínimo)
      if (bestMatch && highestMatchCount >= 0.5) {
        const responseText = `👋 Hola, según el **${bestMatch.title}** (${bestMatch.article}):\n\n${bestMatch.summary}\n\n💡 **Recomendación de RRHH:**\n${bestMatch.recommendation}`;
        
        resolve({
          text: responseText,
          matchedTopicId: bestMatch.id,
          article: bestMatch.article,
          success: true
        });
      } else {
        // Respuestas generales contextuales o fallback inteligente
        let genericResponse = "";
        
        if (normalizedQuery.includes("hola") || normalizedQuery.includes("buenos dias") || normalizedQuery.includes("buenas tardes")) {
          genericResponse = "¡Hola! Soy tu **Consultor Laboral Inteligente** de Recursos Humanos. 💼\n\n¿En qué te puedo asesorar hoy? Puedes preguntarme sobre tus vacaciones, horas extra, aguinaldo, incapacidades, licencias de maternidad o qué hacer en caso de despido o renuncia.";
        } else if (normalizedQuery.includes("gracias") || normalizedQuery.includes("agradezco") || normalizedQuery.includes("excelente")) {
          genericResponse = "¡Con gusto! Recuerda que en Recursos Humanos estamos para apoyarte y garantizar un entorno laboral justo y seguro. Si tienes más dudas, aquí estaré. 😊";
        } else {
          genericResponse = "Disculpa, no encontré una respuesta específica en el Código de Trabajo para esa consulta en mi base de datos de conocimiento. 📝\n\nSin embargo, puedes intentar preguntarme usando palabras como: **vacaciones**, **horas extra**, **aguinaldo**, **maternidad**, **paternidad**, **despido**, **incapacidad** o **acoso**.\n\nSi necesitas asesoría legal formal o personalizada, te recomiendo contactar directamente al equipo de Relaciones Laborales.";
        }

        resolve({
          text: genericResponse,
          matchedTopicId: null,
          article: null,
          success: false
        });
      }
    }, delay);
  });
};
