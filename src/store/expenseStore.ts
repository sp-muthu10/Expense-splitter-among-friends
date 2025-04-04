import { create } from 'zustand';
import { ExpenseState } from '../types';

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: [],
  addExpense: (expense) => set((state) => ({
    expenses: [...state.expenses, {
      ...expense,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    }]
  })),
  getExpensesByCategory: () => {
    const { expenses } = get();
    return expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
  },
  getBalances: () => {
    const { expenses } = get();
    const balances: Record<string, number> = {};

    expenses.forEach(expense => {
      // Add amount paid by each person
      expense.paidBy.forEach(payerId => {
        balances[payerId] = (balances[payerId] || 0) + expense.amount / expense.paidBy.length;
      });

      // Subtract shares from each participant
      expense.participants.forEach(participant => {
        balances[participant.id] = (balances[participant.id] || 0) - participant.share;
      });
    });

    return balances;
  }
}));