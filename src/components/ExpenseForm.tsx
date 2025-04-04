import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useExpenseStore } from '../store/expenseStore';
import { useFriendStore } from '../store/friendStore';
import {
  Calendar,
  DollarSign,
  Users,
  Tag,
  RepeatIcon,
  Send,
  Plus,
  X
} from 'lucide-react';

const expenseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  currency: z.string(),
  date: z.string(),
  notes: z.string().optional(),
  category: z.string(),
  isRecurring: z.boolean(),
  recurringType: z.enum(['weekly', 'monthly', 'yearly']).optional(),
  splitMethod: z.enum(['equal', 'custom', 'percentage']),
  participants: z.array(z.object({
    id: z.string(),
    name: z.string(),
    share: z.number()
  })).min(1, 'At least one participant is required'),
  paidBy: z.array(z.string()).min(1, 'At least one payer is required'),
  tags: z.array(z.string())
});

const categories = [
  { id: 'food', label: 'Food & Dining', icon: '🍔' },
  { id: 'groceries', label: 'Groceries', icon: '🛒' },
  { id: 'travel', label: 'Travel', icon: '✈️' },
  { id: 'rent', label: 'Rent & Housing', icon: '🏠' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎮' },
  { id: 'utilities', label: 'Utilities', icon: '💡' },
  { id: 'health', label: 'Healthcare', icon: '🏥' },
  { id: 'education', label: 'Education', icon: '📚' },
  { id: 'transport', label: 'Transportation', icon: '🚗' },
  { id: 'fitness', label: 'Fitness', icon: '💪' },
  { id: 'pets', label: 'Pets', icon: '🐾' },
  { id: 'gifts', label: 'Gifts', icon: '🎁' },
  { id: 'misc', label: 'Miscellaneous', icon: '📦' }
];

const currencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD', 'SGD', 'CNY'];

export function ExpenseForm() {
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [newFriendName, setNewFriendName] = useState('');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const addExpense = useExpenseStore(state => state.addExpense);
  const { friends, addFriend } = useFriendStore();
  
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      currency: 'USD',
      date: new Date().toISOString().split('T')[0],
      splitMethod: 'equal',
      isRecurring: false,
      recurringType: 'monthly',
      participants: [],
      paidBy: [],
      tags: []
    }
  });

  const isRecurring = watch('isRecurring');
  const splitMethod = watch('splitMethod');
  const amount = watch('amount');

  const handleAddFriend = () => {
    if (newFriendName.trim()) {
      addFriend(newFriendName.trim());
      setNewFriendName('');
      setShowAddFriend(false);
    }
  };

  const handleFriendSelect = (friendId: string) => {
    const newSelection = selectedFriends.includes(friendId)
      ? selectedFriends.filter(id => id !== friendId)
      : [...selectedFriends, friendId];
    
    setSelectedFriends(newSelection);
    
    // Update participants with shares
    const shares = newSelection.map(id => ({
      id,
      name: friends.find(f => f.id === id)?.name || '',
      share: splitMethod === 'equal' 
        ? amount / newSelection.length
        : amount / newSelection.length
    }));
    
    setValue('participants', shares);
    setValue('paidBy', [newSelection[0]].filter(Boolean));
  };

  const onSubmit = (data: any) => {
    addExpense(data);
    
    // Reset form
    setSelectedFriends([]);
    reset({
      currency: 'USD',
      date: new Date().toISOString().split('T')[0],
      splitMethod: 'equal',
      isRecurring: false,
      recurringType: 'monthly',
      participants: [],
      paidBy: [],
      tags: []
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 rounded-lg shadow-lg border border-purple-100">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Add New Expense</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-purple-900">
            Expense Title
          </label>
          <input
            type="text"
            {...register('title')}
            className="mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            placeholder="Enter expense title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message as string}</p>
          )}
        </div>

        {/* Amount and Currency */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-purple-900">
              Amount
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-purple-400" />
              </div>
              <input
                type="number"
                step="0.01"
                {...register('amount', { valueAsNumber: true })}
                className="block w-full pl-10 pr-12 rounded-md border-purple-300 focus:border-purple-500 focus:ring-purple-500"
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="w-32">
            <label className="block text-sm font-medium text-purple-900">
              Currency
            </label>
            <select
              {...register('currency')}
              className="mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            >
              {currencies.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-purple-900">
            Date
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-purple-400" />
            </div>
            <input
              type="date"
              {...register('date')}
              className="block w-full pl-10 rounded-md border-purple-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-purple-900">
            Category
          </label>
          <select
            {...register('category')}
            className="mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-purple-900">
            Notes
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className="mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            placeholder="Add any additional notes here..."
          />
        </div>

        {/* Friends Selection */}
        <div className="col-span-2">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-purple-900">
              Select Friends
            </label>
            <button
              type="button"
              onClick={() => setShowAddFriend(!showAddFriend)}
              className="inline-flex items-center px-3 py-1 text-sm font-medium text-purple-600 hover:text-purple-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add New Friend
            </button>
          </div>

          {showAddFriend && (
            <div className="mb-4 flex items-center space-x-2">
              <input
                type="text"
                value={newFriendName}
                onChange={(e) => setNewFriendName(e.target.value)}
                placeholder="Enter friend's name"
                className="flex-1 rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={handleAddFriend}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddFriend(false)}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {friends.map(friend => (
              <button
                key={friend.id}
                type="button"
                onClick={() => handleFriendSelect(friend.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${selectedFriends.includes(friend.id)
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
              >
                {friend.name}
              </button>
            ))}
          </div>
        </div>

        {/* Split Method */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-purple-900">
            Split Method
          </label>
          <div className="mt-2 flex space-x-4">
            {['equal', 'custom', 'percentage'].map((method) => (
              <label key={method} className="inline-flex items-center">
                <input
                  type="radio"
                  {...register('splitMethod')}
                  value={method}
                  className="form-radio h-4 w-4 text-purple-600"
                />
                <span className="ml-2 capitalize text-purple-900">{method}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Recurring Options */}
        <div className="col-span-2">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              {...register('isRecurring')}
              className="form-checkbox h-4 w-4 text-purple-600"
            />
            <span className="ml-2 text-purple-900">Recurring Expense</span>
          </div>
          
          {isRecurring && (
            <div className="ml-6">
              <label className="block text-sm font-medium text-purple-900">
                Recurring Type
              </label>
              <select
                {...register('recurringType')}
                className="mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform transition-transform hover:scale-105"
        >
          <Send className="h-5 w-5 mr-2" />
          Add Expense
        </button>
      </div>
    </form>
  );
}