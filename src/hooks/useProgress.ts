import { useState, useCallback } from 'react';
import type { Progress, TestResult } from '../types';
import {
  loadProgress,
  saveProgress,
  exportProgressJSON,
  importProgressJSON,
} from '../utils/progress';

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress());

  const toggleTask = useCallback((taskId: string) => {
    setProgress((prev) => {
      const completed = prev.completedTasks.includes(taskId)
        ? prev.completedTasks.filter((id) => id !== taskId)
        : [...prev.completedTasks, taskId];
      const next = { ...prev, completedTasks: completed };
      saveProgress(next);
      return next;
    });
  }, []);

  const addTestResult = useCallback((result: TestResult) => {
    setProgress((prev) => {
      const next = {
        ...prev,
        testResults: [...prev.testResults, result],
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const updateNote = useCallback((domainId: string, note: string) => {
    setProgress((prev) => {
      const next = {
        ...prev,
        notes: { ...prev.notes, [domainId]: note },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const exportProgress = useCallback(() => {
    exportProgressJSON(progress);
  }, [progress]);

  const importProgress = useCallback(async (file: File) => {
    const imported = await importProgressJSON(file);
    saveProgress(imported);
    setProgress(imported);
  }, []);

  const resetProgress = useCallback(() => {
    const fresh: Progress = {
      completedTasks: [],
      testResults: [],
      lastUpdated: new Date().toISOString(),
      notes: {},
    };
    saveProgress(fresh);
    setProgress(fresh);
  }, []);

  return {
    progress,
    toggleTask,
    addTestResult,
    updateNote,
    exportProgress,
    importProgress,
    resetProgress,
  };
}
