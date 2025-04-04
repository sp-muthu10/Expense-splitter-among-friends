import React from 'react';
import { useExpenseStore } from '../store/expenseStore';
import { format } from 'date-fns';
import { Receipt, Calendar, RefreshCw } from 'lucide-react';

export function ExpenseList() {
  const expenses = useExpenseStore(state => state.expenses);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>
      <div className="space-y-4">
        {expenses.map(expense => (
          <div key={expense.id} className="border-l-4 border-indigo-500 bg-indigo-50 p-4 rounded-r-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-indigo-900">{expense.title}</h3>
                <div className="flex items-center mt-1 text-indigo-700">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="text-sm">{format(new Date(expense.date), 'MMM d, yyyy')}</span>
                  {expense.isRecurring && (
                    <span className="flex items-center ml-3">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      <span className="text-sm capitalize">{expense.recurringType}</span>
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-semibold text-indigo-900">
                  {expense.currency} {expense.amount.toFixed(2)}
                </span>
                {expense.receiptUrl && (
                  <div className="flex items-center mt-1 text-indigo-700">
                    <Receipt className="h-4 w-4 mr-1" />
                    <span className="text-sm">Receipt attached</span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3">
              <h4 className="text-sm font-medium text-indigo-900">Participants:</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {expense.participants.map(participant => (
                  <span
                    key={participant.id}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {participant.name} ({((participant.share / expense.amount) * 100).toFixed(0)}%)
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
        {expenses.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No expenses added yet. Add your first expense above!
          </div>
        )}
      </div>
    </div>
  );
}