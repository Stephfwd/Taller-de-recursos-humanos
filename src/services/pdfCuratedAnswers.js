/** Respuestas estructuradas alineadas al texto de los PDFs (RH-02 y RH-25). */
export const CURATED_BY_INTENT = {
  politicas_familia: {
    intro:
      "Las **políticas para familias** están en el procedimiento **RH-02** (*Política Empresa Familiarmente Responsable*). En síntesis:",
    bullets: [
      "La empresa busca un **balance vida-trabajo** y el bienestar integral de quienes trabajan en Garnier & Garnier.",
      "Reconoce toda **diversidad familiar** (matrimonios, familias homoparentales, uniparentales, ampliadas, etc.).",
      "Incluye beneficios como **maternidad y paternidad** ampliados, **horario flexible**, **teletrabajo**, **guardería** (subsidio según condiciones), **licencias especiales** y apoyo en situaciones familiares.",
      "Quienes lideran deben **modelar** hábitos que refuercen el equilibrio entre familia y trabajo.",
      "El incumplimiento se rige según la legislación laboral y el régimen disciplinario interno.",
    ],
    source: "RH-02 Politica Empresa Familiarmente Responsable v5",
  },
  vestimenta: {
    intro:
      "El **código de vestimenta** (**RH-25**) define el estilo **Casual de Negocios** (*Business Casual*). Lo permitido en oficina incluye:",
    bullets: [
      "Vestir **profesional pero cómodo**; colores variados, evitando exceso de brillos o aplicaciones.",
      "**Mujeres:** blusas/camisas apropiadas para oficina; faldas/pantalones/vestidos con largo adecuado; zapatos preferiblemente cerrados.",
      "**Hombres:** camisas (manga corta o larga con botones en oficina); pantalones formales o tipo dockers; **jeans permitidos entre semana** (sin rasgaduras); zapatos cerrados (no sandalias ni tenis deportivos en contexto formal).",
      "**Viernes informales:** se relaja el atuendo, pero **no** es día libre de reglas (evitar shorts, tops inadecuados, tenis deportivos, etc.).",
      "Prohibido usar camisetas de equipos deportivos salvo eventos promovidos por la empresa.",
    ],
    source: "RH-25 Código de vestimenta v6",
  },
  sanciones_vestimenta: {
    intro:
      "Si **incumples el código de vestimenta** (**RH-25**), aplica lo siguiente:",
    bullets: [
      "El incumplimiento **constituye una falta** y se atiende según el **Régimen Disciplinario** de la empresa.",
      "Las **sanciones** se aplican según la gravedad del caso; Recursos Humanos puede intervenir si la vestimenta no está alineada a la imagen corporativa.",
      "Si por fuerza mayor no puedes portar uniforme cuando es obligatorio, debes **notificar por escrito** a tu jefatura inmediata.",
    ],
    source: "RH-25 Código de vestimenta v6",
  },
  paternidad: {
    intro: "Según **RH-02**, los beneficios de **paternidad** incluyen:",
    bullets: [
      "**7 días** de permiso con goce de salario adicionales a la legislación, a disfrutar desde el nacimiento (también aplica en adopción de menores).",
      "Permiso semanal **«Papá también cuida»** para involucrar a los padres en el cuido del hogar.",
      "Para gozar la licencia por paternidad extendida se requiere completar el curso interno de **Corresponsabilidad en el Hogar** y presentar certificado de preparación para el parto.",
    ],
    source: "RH-02 Politica Empresa Familiarmente Responsable v5",
  },
  maternidad: {
    intro: "Según **RH-02**, los beneficios de **maternidad** incluyen:",
    bullets: [
      "Cumplimiento de la legislación vigente (**120 días** por nacimiento; **90 días** por adopción) más **7 días adicionales** pagados por la empresa tras la licencia de la CCSS.",
      "Permisos con goce de salario para **control prenatal** (coordinados con jefatura; comprobante médico).",
      "**Sala de lactancia** en Centro Corporativo Lindora y permisos para lactancia e incorporación gradual.",
      "Subsidio de **guardería** (₡30.000 mensuales, según presupuesto y condiciones del procedimiento).",
    ],
    source: "RH-02 Politica Empresa Familiarmente Responsable v5",
  },
};

export const formatCuratedAnswer = (intentId) => {
  const entry = CURATED_BY_INTENT[intentId];
  if (!entry) return null;
  const bullets = entry.bullets.map((b) => `- ${b}`).join("\n");
  return `${entry.intro}\n\n${bullets}\n\n📄 **Fuente:** ${entry.source}`;
};
