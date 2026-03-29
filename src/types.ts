export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD';

export interface Mission {
  id: string;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
  type: 'budget' | 'scam' | 'coach' | 'debt';
}

export interface UserProfile {
  name: string;
  age: number;
  country: string;
  currency: Currency;
  topics: string[];
  onboarded: boolean;
  xp: number;
  level: number;
  levelTitle: string;
  nextLevelXP?: number;
  streak: number;
  lastActiveDate?: string;
  missions: Mission[];
}

export interface BudgetItem {
  id: string;
  type: 'income' | 'fixed' | 'variable' | 'goal';
  label: string;
  amount: number;
  subCategory?: string;
}

export interface DebtItem {
  id: string;
  label: string;
  amount: number;
  interestRate: number;
  duration: number; // in months
  monthlyPayment: number;
}

export interface ScamScenario {
  id: string;
  title: string;
  message: string;
  isScam: boolean;
  explanation: string;
  redFlags: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
