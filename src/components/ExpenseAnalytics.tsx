import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { useExpenseStore } from '../store/expenseStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export function ExpenseAnalytics() {
  const getExpensesByCategory = useExpenseStore(state => state.getExpensesByCategory);
  const getBalances = useExpenseStore(state => state.getBalances);
  const expenses = useExpenseStore(state => state.expenses);

  const categoryData = getExpensesByCategory();
  const balances = getBalances();

  const categoryChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: 'Expenses by Category',
        data: Object.values(categoryData),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
        ],
      },
    ],
  };

  const balanceChartData = {
    labels: Object.keys(balances).map(id => 
      expenses.find(e => e.participants.some(p => p.id === id))?.participants.find(p => p.id === id)?.name || id
    ),
    datasets: [
      {
        label: 'Balance',
        data: Object.values(balances),
        backgroundColor: Object.values(balances).map(balance =>
          balance >= 0 ? 'rgba(75, 192, 192, 0.8)' : 'rgba(255, 99, 132, 0.8)'
        ),
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Expenses by Category</h3>
        <Pie data={categoryChartData} />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Balance Overview</h3>
        <Bar
          data={balanceChartData}
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
      <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Settlement Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-green-800 font-medium mb-2">To Receive</h4>
            {Object.entries(balances)
              .filter(([_, amount]) => amount > 0)
              .map(([id, amount]) => (
                <div key={id} className="flex justify-between items-center text-green-600 mb-2">
                  <span>{expenses.find(e => e.participants.some(p => p.id === id))?.participants.find(p => p.id === id)?.name}</span>
                  <span className="font-medium">+${amount.toFixed(2)}</span>
                </div>
              ))}
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="text-red-800 font-medium mb-2">To Pay</h4>
            {Object.entries(balances)
              .filter(([_, amount]) => amount < 0)
              .map(([id, amount]) => (
                <div key={id} className="flex justify-between items-center text-red-600 mb-2">
                  <span>{expenses.find(e => e.participants.some(p => p.id === id))?.participants.find(p => p.id === id)?.name}</span>
                  <span className="font-medium">${Math.abs(amount).toFixed(2)}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}