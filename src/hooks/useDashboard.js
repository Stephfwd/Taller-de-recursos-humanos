import { useState, useEffect, useCallback } from "react";
import { surveyService } from "../services/surveyService";
import { analyticsService } from "../services/analyticsService";

export const useDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(() => {
    setIsLoading(true);
    try {
      const surveys = surveyService.getSurveys();
      const results = analyticsService.calculateAnalytics(surveys);
      setAnalytics(results);
    } catch (e) {
      console.error("Error al cargar datos en el dashboard", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetData = useCallback(() => {
    setIsLoading(true);
    try {
      const resetSurveys = surveyService.resetSurveys();
      const results = analyticsService.calculateAnalytics(resetSurveys);
      setAnalytics(results);
    } catch (e) {
      console.error("Error al restablecer los datos del dashboard", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    analytics,
    isLoading,
    refreshData: loadData,
    resetData
  };
};
