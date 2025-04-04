import React from 'react';
import { useExpenseStore } from '../store/expenseStore';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export function ExpenseExport() {
  const expenses = useExpenseStore(state => state.expenses);

  const exportToExcel = () => {
    const data = expenses.map(expense => ({
      Title: expense.title,
      Amount: expense.amount,
      Currency: expense.currency,
      Date: expense.date,
      Category: expense.category,
      'Split Method': expense.splitMethod,
      Participants: expense.participants.map(p => p.name).join(', '),
      'Is Recurring': expense.isRecurring ? 'Yes' : 'No',
      'Recurring Type': expense.recurringType || '-',
      Notes: expense.notes || '-'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Expenses');
    XLSX.writeFile(wb, 'expense-history.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    const tableData = expenses.map(expense => [
      expense.title,
      `${expense.currency} ${expense.amount}`,
      expense.date,
      expense.category,
      expense.participants.map(p => p.name).join(', ')
    ]);

    (doc as any).autoTable({
      head: [['Title', 'Amount', 'Date', 'Category', 'Participants']],
      body: tableData,
      theme: 'striped',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [102, 45, 145] }
    });

    doc.save('expense-history.pdf');
  };

  return (
    <div className="flex justify-end space-x-4 mb-6">
      <button
        onClick={exportToExcel}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        <Download className="h-4 w-4 mr-2" />
        Export to Excel
      </button>
      <button
        onClick={exportToPDF}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        <Download className="h-4 w-4 mr-2" />
        Export to PDF
      </button>
    </div>
  );
}