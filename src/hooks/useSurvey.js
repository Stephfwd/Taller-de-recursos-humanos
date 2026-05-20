import { useState, useCallback } from "react";
import { surveyQuestions } from "../data/surveyQuestions";
import { surveyService } from "../services/surveyService";

export const useSurvey = () => {
  const [department, setDepartment] = useState("");
  const [answers, setAnswers] = useState({});
  const [comment, setComment] = useState("");
  const [currentStep, setCurrentStep] = useState(0); // 0 = Dept select, 1-15 = Q1-15, 16 = Comentarios, 17 = Finalizado
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalQuestions = surveyQuestions.length;

  const selectDepartment = useCallback((dept) => {
    setDepartment(dept);
    setCurrentStep(1);
  }, []);

  const answerQuestion = useCallback((qId, rating) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: rating
    }));
  }, []);

  const nextStep = useCallback(() => {
    // Validar si la pregunta actual ha sido respondida
    if (currentStep >= 1 && currentStep <= totalQuestions) {
      if (answers[currentStep] === undefined) {
        // No avanzar si no ha contestado
        return false;
      }
    }
    
    setCurrentStep((prev) => prev + 1);
    return true;
  }, [currentStep, answers, totalQuestions]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const submitSurvey = useCallback(async () => {
    if (!department || Object.keys(answers).length < totalQuestions) {
      return false;
    }

    setIsSubmitting(true);

    try {
      // Simular un pequeño retraso de guardado para la experiencia de usuario
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      surveyService.saveSurvey(department, answers, comment);
      setCurrentStep(17); // Completado
      return true;
    } catch (e) {
      console.error("Error submitting survey:", e);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [department, answers, comment, totalQuestions]);

  const resetSurvey = useCallback(() => {
    setDepartment("");
    setAnswers({});
    setComment("");
    setCurrentStep(0);
    setIsSubmitting(false);
  }, []);

  const isCurrentQuestionAnswered = answers[currentStep] !== undefined;

  return {
    department,
    answers,
    comment,
    setComment,
    currentStep,
    totalQuestions,
    isSubmitting,
    selectDepartment,
    answerQuestion,
    nextStep,
    prevStep,
    submitSurvey,
    resetSurvey,
    isCurrentQuestionAnswered
  };
};
