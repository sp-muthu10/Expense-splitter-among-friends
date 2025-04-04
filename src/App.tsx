import React from 'react';
import { Auth } from './components/Auth';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseAnalytics } from './components/ExpenseAnalytics';
import { ExpenseExport } from './components/ExpenseExport';
import { useAuthStore } from './store/authStore';
import { LogOut } from 'lucide-react';

function App() {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Expense Splitter
              </h1>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">Welcome, {user.name}</span>
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <ExpenseForm />
        <ExpenseExport />
        <ExpenseAnalytics />
        <ExpenseList />
      </main>
    </div>
  );
}

export default App;