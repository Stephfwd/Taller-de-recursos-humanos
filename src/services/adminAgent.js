export const queryAdminAgent = (userMessage, userRole = 'ADMIN') => {
  return new Promise((resolve) => {
    // Simula latencia
    const delay = 800 + Math.random() * 800;

    setTimeout(() => {
      // 1. Verificación de permisos
      if (!userRole || !['ADMIN', 'VISOR', 'SUPERADMIN'].includes(userRole.toUpperCase())) {
        resolve({
          text: "Sesión no válida. Por favor inicia sesión nuevamente.",
          success: false
        });
        return;
      }

      const q = userMessage.toLowerCase().trim();

      // ── COMANDOS RÁPIDOS ─────────────────────────────────────────────────
      if (q === "dashboard") {
        resolve({
          text: "📊 **Resumen General del Dashboard**\n\n- **Total encuestas:** 142 respuestas\n- **Período consultado:** Este mes\n\n**Ranking por Prioridad:**\n1. 🔴 Empresa Alpha (Crítico - 4.2)\n2. 🟡 Empresa Beta (Atención - 6.5)\n3. 🟢 Empresa Gamma (Saludable - 8.1)\n\n**Departamentos Críticos:**\n- Alpha > Operaciones\n- Beta > Ventas\n\n**Temas en Alerta:** Liderazgo, Carga laboral.",
          success: true
        });
        return;
      }

      if (q === "críticos" || q === "criticos") {
        resolve({
          text: "🔴 **Zonas Críticas Actuales (Score < 5)**\n\n- **Empresa Alpha** (Global: 4.2)\n  - Departamento: Operaciones (Score: 3.8)\n  - Departamento: Logística (Score: 4.5)\n\n_El departamento de Operaciones de Empresa Alpha lleva 3 semanas consecutivas en zona crítica. Se recomienda intervención prioritaria._",
          success: true
        });
        return;
      }

      if (q === "nueva empresa") {
        resolve({
          text: "🏢 **Creación de Nueva Empresa**\n\nPara registrar una nueva empresa, por favor indícame en un solo mensaje o por partes:\n1. Nombre de la empresa\n2. Código interno\n3. Zona horaria",
          success: true
        });
        return;
      }

      if (q === "nuevo departamento") {
        resolve({
          text: "📂 **Creación de Nuevo Departamento**\n\nPara registrar un nuevo departamento, necesito:\n1. Nombre del departamento\n2. Código del departamento\n3. Empresa a la que pertenece",
          success: true
        });
        return;
      }

      if (q === "configurar alerta") {
        resolve({
          text: "🔔 **Configuración de Alerta**\n\nPor favor, indícame:\n1. ¿Para qué empresa o todas?\n2. ¿Qué umbral de score activa la alerta? (1 al 10)\n3. ¿Por qué canal notifico? (Email, Slack, etc.)\n4. ¿Para qué tema? (Ej. Liderazgo, Carga laboral)",
          success: true
        });
        return;
      }

      if (q === "exportar") {
        resolve({
          text: "📥 **Exportar Reporte**\n\n¿En qué formato deseas el reporte (PDF o Excel) y para qué período (Ej. este mes, último trimestre)?",
          success: true
        });
        return;
      }

      if (q === "historial alertas") {
        resolve({
          text: "📜 **Historial de Alertas Recientes**\n\n- **Hoy 09:30 AM:** Alerta crítica en Empresa Alpha (Operaciones) por Carga Laboral (Score 3.8) - _Notificado vía Email_\n- **Ayer 16:45 PM:** Alerta de atención en Empresa Beta (Ventas) por Liderazgo (Score 5.1) - _Notificado vía Slack_",
          success: true
        });
        return;
      }

      // ── PRIVACIDAD DE DATOS (Manejador de nombres o empleados específicos)
      if (q.includes("empleado") || q.includes("persona") || q.includes("quien") || q.includes("nombre")) {
        resolve({
          text: "🔒 El sistema protege la privacidad individual. Solo puedo mostrarte datos agrupados por empresa o departamento.",
          success: false
        });
        return;
      }

      // ── FILTROS Y PREGUNTAS GENERALES
      if (q.includes("empresa alpha")) {
        resolve({
          text: "📊 **Resultados de Empresa Alpha**\n\n**Estado:** 🔴 CRÍTICO (Score: 4.2)\n**Departamento más crítico:** Operaciones\n**Tema más bajo:** Carga y equilibrio laboral\n\n_Interpretación: La empresa Alpha necesita atención urgente en el área operativa. Podría ser un patrón estructural de sobrecarga._",
          success: true
        });
        return;
      }

      if (q.includes("liderazgo")) {
        resolve({
          text: "⚠️ **Análisis del tema: Liderazgo**\n\nLa pregunta sobre liderazgo y jefatura directa tiene el score más bajo en 2 de 3 empresas.\n- Empresa Alpha: 4.5 (CRÍTICO)\n- Empresa Beta: 5.1 (ATENCIÓN)\n- Empresa Gamma: 7.8 (SALUDABLE)",
          success: true
        });
        return;
      }

      // Si es una creación simulada
      if (q.includes("crear") && q.includes("empresa") && q.includes("codigo")) {
        resolve({
          text: "✓ Empresa 'Nueva' creada correctamente. ID asignado: EMP-9982. ¿Deseas agregar otro departamento o volver al dashboard?",
          success: true
        });
        return;
      }

      // Respuesta por defecto
      resolve({
        text: "¡Hola! Soy el **HR Admin Agent**, tu asistente en el panel de control. Puedo ayudarte a gestionar empresas, configurar alertas o analizar resultados de clima.\n\nPrueba comandos rápidos como `dashboard`, `críticos`, `nueva empresa` o `configurar alerta`.",
        success: true
      });
    }, delay);
  });
};
