import { departments } from "../data/surveyQuestions";

const SURVEY_KEY = "hr_chatbot_surveys";

// Generar datos ficticios iniciales realistas para poblar el dashboard
const generateMockSurveys = () => {
  const mocks = [];
  const now = new Date();
  
  // Lista de comentarios posibles
  const comments = {
    "Trabajo en Equipo y Clima": [
      "El ambiente de mi equipo es excelente, siempre nos apoyamos.",
      "Hay buena comunicación, aunque a veces hay roces por la presión de las entregas.",
      "Me gusta mucho trabajar con mis compañeros de equipo."
    ],
    "Liderazgo y Dirección": [
      "Mi supervisor es un gran líder, pero a veces no tiene tiempo para darnos feedback.",
      "Siento que la dirección toma decisiones sin consultar a la base.",
      "Falta más claridad en la dirección estratégica de la gerencia."
    ],
    "Compensación y Reconocimiento": [
      "El salario se ha quedado corto frente al mercado y la inflación.",
      "El esfuerzo extra rara vez es reconocido de manera formal o monetaria.",
      "Los criterios para los bonos de ventas no son muy claros y cambian seguido."
    ],
    "Balance Vida-Trabajo": [
      "Mucha sobrecarga, trabajamos fines de semana con frecuencia.",
      "Es difícil desconectarse, los mensajes del jefe llegan a altas horas de la noche.",
      "La flexibilidad para home office ayuda mucho al balance, pero la carga es alta."
    ],
    "Desarrollo y Crecimiento": [
      "No hay un plan de carrera claro, es difícil ascender.",
      "Las capacitaciones han sido pocas este año debido a recortes de presupuesto.",
      "Siento que mis habilidades no se están explotando al máximo en mi rol actual."
    ]
  };

  // Generar 30 respuestas de ejemplo distribuidas por departamentos
  for (let i = 0; i < 30; i++) {
    const dept = departments[i % departments.length];
    const responses = {};
    let comment = "";
    
    // Crear respuestas (1 a 5) basadas en patrones de departamentos
    for (let qId = 1; qId <= 15; qId++) {
      let min = 2, max = 5;

      // Patrón: IT tiene sobrecarga de trabajo (bajo balance vida-trabajo, qIds: 10, 11, 12)
      if (dept === "Tecnología (IT)" && qId >= 10 && qId <= 12) {
        min = 1; max = 3;
      }
      // Patrón: Ventas tiene descontento con compensación/reconocimiento (qIds: 7, 8, 9)
      if (dept === "Ventas" && qId >= 7 && qId <= 9) {
        min = 1; max = 3;
      }
      // Patrón: Operaciones tiene quejas sobre liderazgo y dirección (qIds: 4, 5, 6)
      if (dept === "Operaciones" && qId >= 4 && qId <= 6) {
        min = 2; max = 4;
      }
      // Patrón: Recursos Humanos tiene alta satisfacción general
      if (dept === "Recursos Humanos") {
        min = 4; max = 5;
      }

      responses[qId] = Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Agregar comentario basado en el puntaje más bajo del usuario
    // Categorías: 
    // Q1-3: Trabajo en Equipo y Clima
    // Q4-6: Liderazgo y Dirección
    // Q7-9: Compensación y Reconocimiento
    // Q10-12: Balance Vida-Trabajo
    // Q13-15: Desarrollo y Crecimiento
    const lowestCategory = getLowestCategoryForMock(responses);
    if (Math.random() > 0.4 && comments[lowestCategory]) {
      const list = comments[lowestCategory];
      comment = list[Math.floor(Math.random() * list.length)];
    }

    // Fecha en los últimos 45 días
    const daysAgo = Math.floor(Math.random() * 45);
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    mocks.push({
      id: `mock_${i}_${date.getTime()}`,
      department: dept,
      responses,
      comment,
      timestamp: date.toISOString()
    });
  }

  return mocks;
};

// Obtiene la categoría con menor puntaje para el mock
function getLowestCategoryForMock(responses) {
  const scores = {
    "Trabajo en Equipo y Clima": (responses[1] + responses[2] + responses[3]) / 3,
    "Liderazgo y Dirección": (responses[4] + responses[5] + responses[6]) / 3,
    "Compensación y Reconocimiento": (responses[7] + responses[8] + responses[9]) / 3,
    "Balance Vida-Trabajo": (responses[10] + responses[11] + responses[12]) / 3,
    "Desarrollo y Crecimiento": (responses[13] + responses[14] + responses[15]) / 3
  };
  
  let lowest = "Trabajo en Equipo y Clima";
  for (const cat in scores) {
    if (scores[cat] < scores[lowest]) {
      lowest = cat;
    }
  }
  return lowest;
}

export const surveyService = {
  /**
   * Obtiene todas las encuestas guardadas. Si no hay, genera y guarda los mocks.
   */
  getSurveys: () => {
    const raw = localStorage.getItem(SURVEY_KEY);
    if (!raw) {
      const mocks = generateMockSurveys();
      localStorage.setItem(SURVEY_KEY, JSON.stringify(mocks));
      return mocks;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error("Error al parsear las encuestas de localStorage", e);
      return [];
    }
  },

  /**
   * Guarda una nueva encuesta.
   */
  saveSurvey: (department, responses, comment = "") => {
    const surveys = surveyService.getSurveys();
    const newSurvey = {
      id: `survey_${Date.now()}`,
      department,
      responses,
      comment,
      timestamp: new Date().toISOString()
    };
    
    surveys.push(newSurvey);
    localStorage.setItem(SURVEY_KEY, JSON.stringify(surveys));
    return newSurvey;
  },

  /**
   * Limpia todas las encuestas y restablece los datos ficticios.
   */
  resetSurveys: () => {
    localStorage.removeItem(SURVEY_KEY);
    return surveyService.getSurveys();
  }
};
