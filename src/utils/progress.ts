import type { Progress, TestResult } from '../types';

const STORAGE_KEY = 'claude-exam-prep-progress';

export const defaultProgress: Progress = {
  completedTasks: [],
  testResults: [],
  lastUpdated: new Date().toISOString(),
  notes: {},
};

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultProgress };
    return JSON.parse(raw) as Progress;
  } catch {
    return { ...defaultProgress };
  }
}

export function saveProgress(progress: Progress): void {
  try {
    const updated = { ...progress, lastUpdated: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save progress:', e);
  }
}

export function exportProgressJSON(progress: Progress): void {
  const blob = new Blob([JSON.stringify(progress, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'progress.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function importProgressJSON(file: File): Promise<Progress> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const progress = JSON.parse(e.target?.result as string) as Progress;
        resolve(progress);
      } catch {
        reject(new Error('Invalid progress file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export function calculateDomainScore(
  results: TestResult[],
  domainId: string
): number {
  const domainResults = results.flatMap((r) =>
    r.domainScores[domainId] ? [r.domainScores[domainId]] : []
  );
  if (domainResults.length === 0) return 0;
  const total = domainResults.reduce((sum, r) => sum + r.total, 0);
  const correct = domainResults.reduce((sum, r) => sum + r.correct, 0);
  return total > 0 ? Math.round((correct / total) * 100) : 0;
}
