export interface Domain {
  id: string;
  name: string;
  weight: number; // percentage
  color: string;  // tailwind color class e.g. 'blue'
  taskStatements: TaskStatement[];
}

export interface TaskStatement {
  id: string; // e.g. "1.1"
  title: string;
  knowledge: string[];
  skills: string[];
  explanation: string; // detailed teaching content, 3-5 paragraphs
  keyConcepts: KeyConcept[];
}

export interface KeyConcept {
  term: string;
  definition: string;
  example?: string;
}

export interface StudyDay {
  day: number;
  title: string;
  description: string;
  domains: string[]; // domain ids
  tasks: StudyTask[];
  estimatedHours: number;
}

export interface StudyTask {
  id: string;
  label: string;
  domainId: string;
  estimatedMinutes: number;
}

export interface Question {
  id: string;
  scenario?: string; // optional scenario context
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  domainId: string;
  taskStatementId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  source?: 'official' | 'community';
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  primaryDomains: string[];
  keyTopics: string[];
}

export interface Progress {
  completedTasks: string[]; // StudyTask ids
  testResults: TestResult[];
  lastUpdated: string;
  notes: Record<string, string>; // domainId -> notes
}

export interface TestResult {
  id: string;
  date: string;
  score: number; // out of 1000
  totalQuestions: number;
  correctAnswers: number;
  domainScores: Record<string, { correct: number; total: number }>;
  mode: 'full' | 'domain';
  domainId?: string;
}
