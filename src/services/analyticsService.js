/**
 * Convierte un promedio en escala 1-5 a porcentaje (0-100%).
 * Rango: 1 -> 0%, 5 -> 100%
 * Fórmula: ((val - 1) / 4) * 100
 */
const toPercentage = (avgRating) => {
  if (!avgRating) return 0;
  return Math.round(((avgRating - 1) / 4) * 100);
};

export const analyticsService = {
  /**
   * Procesa la lista de encuestas y calcula todas las métricas de RRHH.
   */
  calculateAnalytics: (surveys) => {
    if (!surveys || surveys.length === 0) {
      return {
        overallScore: 0,
        totalSurveys: 0,
        categoryScores: [],
        departmentScores: [],
        priorityRankings: [],
        alerts: [],
        recentComments: []
      };
    }

    const totalSurveys = surveys.length;
    let totalGlobalSum = 0;
    let totalQuestionsCount = 0;

    // Acumuladores de categoría
    const categories = {
      "Trabajo en Equipo y Clima": { sum: 0, count: 0, qIds: [1, 2, 3] },
      "Liderazgo y Dirección": { sum: 0, count: 0, qIds: [4, 5, 6] },
      "Compensación y Reconocimiento": { sum: 0, count: 0, qIds: [7, 8, 9] },
      "Balance Vida-Trabajo": { sum: 0, count: 0, qIds: [10, 11, 12] },
      "Desarrollo y Crecimiento": { sum: 0, count: 0, qIds: [13, 14, 15] }
    };

    // Acumuladores por departamento
    const departmentsData = {};

    // Comentarios y alertas de palabras clave
    const alerts = [];
    const recentComments = [];

    // Recorrer todas las encuestas
    surveys.forEach((survey) => {
      const { department, responses, comment, timestamp } = survey;

      // Inicializar departamento si no existe
      if (!departmentsData[department]) {
        departmentsData[department] = { sum: 0, count: 0, categories: {} };
        Object.keys(categories).forEach((cat) => {
          departmentsData[department].categories[cat] = { sum: 0, count: 0 };
        });
      }

      // Procesar respuestas
      Object.entries(responses).forEach(([qStr, rating]) => {
        const qId = parseInt(qStr);
        const val = Number(rating);

        totalGlobalSum += val;
        totalQuestionsCount++;

        // Sumar al departamento
        departmentsData[department].sum += val;
        departmentsData[department].count++;

        // Buscar categoría de la pregunta
        Object.entries(categories).forEach(([catName, catObj]) => {
          if (catObj.qIds.includes(qId)) {
            // Global por categoría
            catObj.sum += val;
            catObj.count++;

            // Por categoría dentro del departamento
            departmentsData[department].categories[catName].sum += val;
            departmentsData[department].categories[catName].count++;
          }
        });
      });

      // Procesar comentarios y buscar alertas críticas
      if (comment && comment.trim() !== "") {
        const cleanComment = comment.toLowerCase();
        let isCritical = false;
        let alertType = "";

        if (cleanComment.includes("acoso") || cleanComment.includes("hostigamiento") || cleanComment.includes("acosador")) {
          isCritical = true;
          alertType = "Acoso Laboral";
        } else if (cleanComment.includes("maltrato") || cleanComment.includes("grita") || cleanComment.includes("insulto")) {
          isCritical = true;
          alertType = "Violencia/Maltrato";
        } else if (cleanComment.includes("renunciar") || cleanComment.includes("renuncia") || cleanComment.includes("irme")) {
          alertType = "Riesgo de Fuga de Talento";
        }

        recentComments.push({
          id: survey.id,
          comment,
          department,
          timestamp,
          isCritical,
          alertType
        });
      }
    });

    // 1. Calcular score global de satisfacción (%)
    const overallScore = toPercentage(totalGlobalSum / totalQuestionsCount);

    // 2. Calcular scores por categoría
    const categoryScores = Object.entries(categories).map(([name, data]) => {
      const avg = data.sum / data.count;
      const score = toPercentage(avg);
      return { name, score, avg: Math.round(avg * 10) / 10 };
    });

    // 3. Calcular scores por departamento
    const departmentScores = Object.entries(departmentsData).map(([name, data]) => {
      const deptOverallAvg = data.sum / data.count;
      const score = toPercentage(deptOverallAvg);

      const deptCategories = Object.entries(data.categories).map(([catName, catData]) => {
        return {
          categoryName: catName,
          score: toPercentage(catData.sum / catData.count)
        };
      });

      return {
        name,
        score,
        categories: deptCategories,
        surveyCount: Math.round(data.count / 15) // Cada encuesta tiene 15 preguntas
      };
    });

    // 4. Generar alertas basadas en scores bajos (< 60)
    categoryScores.forEach((cat) => {
      if (cat.score < 60) {
        let type = "warning";
        let message = "";
        let recommendation = "";

        if (cat.name === "Balance Vida-Trabajo") {
          message = "Riesgo de Burnout Generalizado: Puntuación crítica en balance vida-trabajo.";
          recommendation = "Revisar la distribución de cargas, limitar envíos de correos fuera de horario y fomentar días de desconexión.";
        } else if (cat.name === "Compensación y Reconocimiento") {
          message = "Descontento con Compensaciones: Baja satisfacción salarial y de incentivos.";
          recommendation = "Realizar un estudio de mercado salarial y revisar los esquemas de bonos y reconocimientos no monetarios.";
        } else if (cat.name === "Liderazgo y Dirección") {
          message = "Brecha de Liderazgo: Falta de confianza en la comunicación y dirección de líderes.";
          recommendation = "Implementar capacitaciones de liderazgo empático y canales de feedback bidireccional.";
        } else if (cat.name === "Desarrollo y Crecimiento") {
          message = "Sensación de Estancamiento: Baja perspectiva de crecimiento profesional.";
          recommendation = "Lanzar planes de carrera transparentes y habilitar becas o programas de autoaprendizaje.";
        } else {
          message = "Tensión en Clima y Colaboración: Problemas de respeto y cohesión interna.";
          recommendation = "Ejecutar actividades de teambuilding y talleres de resolución de conflictos.";
        }

        alerts.push({
          id: `alert_score_${cat.name.replace(/\s+/g, "_")}`,
          category: cat.name,
          score: cat.score,
          message,
          recommendation,
          type: cat.score < 50 ? "danger" : "warning"
        });
      }
    });

    // Agregar alertas éticas extraídas de comentarios
    recentComments.forEach((c) => {
      if (c.isCritical) {
        alerts.push({
          id: `alert_comm_${c.id}`,
          category: "Ética y Cumplimiento",
          message: `Alerta Crítica (${c.alertType}): Reporte anónimo detectado en ${c.department}.`,
          recommendation: `Iniciar protocolo de investigación interna confidencial en el departamento de ${c.department}.`,
          type: "danger",
          commentRef: c.comment
        });
      }
    });

    // 5. Ranking de prioridades de intervención
    // Departamentos con menor score requieren mayor y más rápida prioridad de intervención.
    const priorityRankings = [...departmentScores]
      .sort((a, b) => a.score - b.score) // Menor score primero
      .map((dept, index) => {
        // Encontrar la categoría más débil de ese departamento
        const weakestCategory = [...dept.categories].sort((a, b) => a.score - b.score)[0];
        
        let priorityLevel = "Baja";
        if (dept.score < 60) priorityLevel = "Crítica";
        else if (dept.score < 75) priorityLevel = "Media";

        return {
          rank: index + 1,
          departmentName: dept.name,
          score: dept.score,
          weakestCategory: weakestCategory ? weakestCategory.categoryName : "N/A",
          weakestScore: weakestCategory ? weakestCategory.score : 0,
          priorityLevel
        };
      });

    // Ordenar comentarios recientes (más nuevos primero)
    recentComments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return {
      overallScore,
      totalSurveys,
      categoryScores,
      departmentScores,
      priorityRankings,
      alerts,
      recentComments
    };
  }
};
