import { create } from 'zustand';
import { AuthState, User } from '../types';

// Dummy users for demo
const dummyUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  }
];

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: (email: string, password: string) => {
    const user = dummyUsers.find(u => u.email === email && u.password === password);
    if (user) {
      set({ user });
    } else {
      throw new Error('Invalid credentials');
    }
  },
  register: (name: string, email: string, password: string) => {
    const exists = dummyUsers.some(u => u.email === email);
    if (exists) {
      throw new Error('User already exists');
    }
    const newUser: User = {
      id: String(dummyUsers.length + 1),
      name,
      email,
      password
    };
    dummyUsers.push(newUser);
    set({ user: newUser });
  },
  logout: () => set({ user: null })
}));