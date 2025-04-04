export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  currency: string;
  date: string;
  notes?: string;
  receiptUrl?: string;
  paidBy: string[];
  splitMethod: 'equal' | 'custom' | 'percentage';
  category: string;
  isRecurring: boolean;
  recurringType?: 'weekly' | 'monthly' | 'yearly';
  participants: { id: string; name: string; share: number }[];
  tags: string[];
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
}

export interface ExpenseState {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  getExpensesByCategory: () => Record<string, number>;
  getBalances: () => Record<string, number>;
}

export interface Friend {
  id: string;
  name: string;
}