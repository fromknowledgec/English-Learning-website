'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { progressManager } from '@/lib/progress-manager';
import { ExerciseProgress, ModuleType } from '@/types/progress';

interface UseExerciseProgressOptions {
  exerciseId: string;
  moduleName: string;
  moduleType: ModuleType;
  totalQuestions: number;
}

interface UseExerciseProgressReturn {
  hasProgress: boolean;
  savedProgress: ExerciseProgress | null;
  answers: Map<number, string[]>;
  currentQuestionIndex: number;
  setAnswer: (questionId: number, answer: string[], questionIndex: number) => void;
  setCurrentQuestionIndex: (index: number) => void;
  saveProgress: () => void;
  clearProgress: () => void;
  completeProgress: () => void;
  startNewProgress: () => void;
  restoreProgress: () => void;
}

export function useExerciseProgress({
  exerciseId,
  moduleName,
  moduleType,
  totalQuestions,
}: UseExerciseProgressOptions): UseExerciseProgressReturn {
  const [hasProgress, setHasProgress] = useState(false);
  const [savedProgress, setSavedProgress] = useState<ExerciseProgress | null>(null);
  const [answers, setAnswers] = useState<Map<number, string[]>>(new Map());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const progress = progressManager.getExerciseProgress(exerciseId);
    if (progress && progress.status === 'in_progress') {
      setHasProgress(true);
      setSavedProgress(progress);
    }
  }, [exerciseId]);

  const setAnswer = useCallback((questionId: number, answer: string[], questionIndex: number) => {
    setAnswers(prev => {
      const newMap = new Map(prev);
      newMap.set(questionId, answer);
      return newMap;
    });
    setCurrentQuestionIndex(questionIndex);

    const answersObj: Record<number, string[]> = {};
    answers.forEach((value, key) => {
      answersObj[key] = value;
    });
    answersObj[questionId] = answer;

    progressManager.updateExerciseAnswer(
      exerciseId,
      questionId,
      answer,
      questionIndex,
      totalQuestions
    );
  }, [exerciseId, totalQuestions, answers]);

  const saveProgress = useCallback(() => {
    const answersObj: Record<number, string[]> = {};
    answers.forEach((value, key) => {
      answersObj[key] = value;
    });

    const progress: ExerciseProgress = {
      exerciseId,
      moduleName,
      moduleType,
      answers: answersObj,
      currentQuestionIndex,
      totalQuestions,
      answeredCount: answers.size,
      status: 'in_progress',
      createdAt: savedProgress?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    progressManager.saveExerciseProgress(progress);
  }, [exerciseId, moduleName, moduleType, totalQuestions, answers, currentQuestionIndex, savedProgress]);

  const clearProgress = useCallback(() => {
    progressManager.clearExerciseProgress(exerciseId);
    setHasProgress(false);
    setSavedProgress(null);
    setAnswers(new Map());
    setCurrentQuestionIndex(0);
  }, [exerciseId]);

  const completeProgress = useCallback(() => {
    progressManager.completeExerciseProgress(exerciseId);
    setHasProgress(false);
    setSavedProgress(null);
  }, [exerciseId]);

  const startNewProgress = useCallback(() => {
    clearProgress();
    const progress = progressManager.createExerciseProgress(
      exerciseId,
      moduleName,
      moduleType,
      totalQuestions
    );
    setSavedProgress(progress);
  }, [exerciseId, moduleName, moduleType, totalQuestions, clearProgress]);

  const restoreProgress = useCallback(() => {
    if (savedProgress) {
      const restoredAnswers = new Map<number, string[]>();
      Object.entries(savedProgress.answers).forEach(([key, value]) => {
        restoredAnswers.set(Number(key), value);
      });
      setAnswers(restoredAnswers);
      setCurrentQuestionIndex(savedProgress.currentQuestionIndex);
    }
  }, [savedProgress]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (answers.size > 0) {
        saveProgress();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [answers, saveProgress]);

  return {
    hasProgress,
    savedProgress,
    answers,
    currentQuestionIndex,
    setAnswer,
    setCurrentQuestionIndex,
    saveProgress,
    clearProgress,
    completeProgress,
    startNewProgress,
    restoreProgress,
  };
}
